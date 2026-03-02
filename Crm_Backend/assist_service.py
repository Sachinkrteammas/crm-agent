"""
Agent Assist Service - Router
Provides realtime coaching and transcript processing
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Request
from pydantic import BaseModel, Field, AliasChoices, ConfigDict
from typing import Dict, List, Optional, Union, Any
import asyncio
import json
import logging
import os
import time
import psutil
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv
import aiofiles
from fastapi.responses import JSONResponse

from database import get_db, get_engine
from sqlalchemy import text

# --------------------------------
# Setup
# --------------------------------
assist_router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load env
load_dotenv()
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# --------------------------------
# Data Models
# --------------------------------
class TranscriptChunk(BaseModel):
    call_id: str
    client_id: Optional[str] = "default"
    transcript: str
    timestamp: float

class CoachCard(BaseModel):
    type: str
    title: str
    content: str
    priority: str = "normal"
    timestamp: datetime = None
    confidence: float = 0.0
    category: str = "general"
    action_required: bool = False

class SOPData(BaseModel):
    client_id: str
    content: str
    format: str = "text"

class CallMetrics(BaseModel):
    call_id: str
    start_time: datetime
    end_time: datetime = None
    transcript_chunks: int = 0
    coaching_cards_generated: int = 0
    avg_response_time: float = 0.0
    customer_sentiment: str = "neutral"
    call_category: str = "general"
    resolution_status: str = "ongoing"

# --------------------------------
# Global state
# --------------------------------
active_connections: Dict[str, List[WebSocket]] = {}
call_transcripts: Dict[str, List[str]] = {}
call_metrics: Dict[str, CallMetrics] = {}
sop_content: str = ""
recent_call_cards: Dict[str, List[dict]] = {}
client_sops: Dict[str, str] = {}

# Card storage (file-backed for testing)
CARD_STORAGE_DIR = os.getenv("CARD_STORAGE_DIR", "./cards_storage")


system_metrics = {
    "start_time": datetime.now(),
    "total_requests": 0,
    "total_transcripts": 0,
    "total_coaching_cards": 0,
    "active_calls": 0,
    "uptime_seconds": 0,
    "memory_usage_mb": 0,
    "cpu_usage_percent": 0
}

# --------------------------------
# Connection Manager
# --------------------------------
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, call_id: str):
        await websocket.accept()
        if call_id not in self.active_connections:
            self.active_connections[call_id] = []
        self.active_connections[call_id].append(websocket)
        logger.info(f"Agent connected to call {call_id}")

    def disconnect(self, websocket: WebSocket, call_id: str):
        connections_for_call = self.active_connections.get(call_id)
        if connections_for_call is None:
            logger.info(f"Agent disconnected from call {call_id} (no active list)")
            return
        if websocket in connections_for_call:
            connections_for_call.remove(websocket)
        if not connections_for_call:
            del self.active_connections[call_id]
        logger.info(f"Agent disconnected from call {call_id}")

    async def send_to_call(self, call_id: str, message: dict):
        if call_id in self.active_connections:
            disconnected = []
            for connection in self.active_connections[call_id]:
                try:
                    await connection.send_text(json.dumps(message, default=str))
                except:
                    disconnected.append(connection)

            # Remove disconnected connections safely
            for conn in disconnected:
                connections_for_call = self.active_connections.get(call_id)
                if connections_for_call is None:
                    break
                if conn in connections_for_call:
                    connections_for_call.remove(conn)
                if not connections_for_call:
                    del self.active_connections[call_id]


manager = ConnectionManager()

# OpenAI structured output schema
coaching_schema = {
    "type": "object",
    "properties": {
        "coaching_cards": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": ["say_this", "ask_this", "alert", "kb", "escalate", "follow_up", "compliance"]
                    },
                    "title": {"type": "string"},
                    "content": {"type": "string"},
                    "priority": {
                        "type": "string",
                        "enum": ["low", "normal", "high", "urgent"]
                    },
                    "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                    "category": {
                        "type": "string",
                        "enum": ["customer_service", "sales", "technical", "billing", "general"]
                    },
                    "action_required": {"type": "boolean"}
                },
                "required": ["type", "title", "content", "priority"]
            }
        },
        "call_analysis": {
            "type": "object",
            "properties": {
                "customer_sentiment": {
                    "type": "string",
                    "enum": ["positive", "neutral", "negative"]
                },
                "call_category": {
                    "type": "string",
                    "enum": ["customer_service", "sales", "technical", "billing", "complaint", "general"]
                },
                "urgency_level": {
                    "type": "string",
                    "enum": ["low", "medium", "high", "critical"]
                }
            }
        }
    },
    "required": ["coaching_cards"]
}

import httpx
async def generate_coaching_cards(transcript: str, call_id: str, client_id: Optional[str] = "default") -> List[CoachCard]:
    """Generate coaching cards using OpenAI with structured outputs"""
    try:
        logger.info(f"Generating coaching cards for call {call_id} (client: {client_id})")
        logger.info(f"Transcript length: {len(transcript)} characters")

        # Load SOP for client (memory + file)
        sop_content = await get_sop_content_safe(client_id)
        logger.info(f"SOP content length for client {client_id}: {len(sop_content)} characters")

        print(sop_content,"sop_content===checkdata")

        # --- Get service URL directly from env ---
        # agent_service_url = os.getenv("AGENT_SERVICE_URL", "http://172.12.13.118:8010")

        # --- Call /fields/{client_id} ---
        # field_names = []
        # try:
        #     async with httpx.AsyncClient() as client:
        #         resp = await client.get(f"{agent_service_url}/call/fields/{client_id}")
        #         resp.raise_for_status()
        #         fields = resp.json()
        #         field_names = [f["FieldName"].strip() for f in fields if "FieldName" in f]
        # except Exception as fe:
        #     logger.warning(f"Could not fetch fields for client {client_id}: {fe}")
        #
        # fields_prompt = ", ".join(field_names) if field_names else "No fields available"

        # fields_prompt = "No fields available"
        # try:
        #     async with httpx.AsyncClient() as client:
        #         resp = await client.get(f"{agent_service_url}/call/fields/{client_id}")
        #         resp.raise_for_status()
        #         fields = resp.json()
        #
        #         # Build dict: {FieldName: null OR options}
        #         fields_dict = {}
        #         for f in fields:
        #             field_name = f.get("FieldName", "").strip()
        #             if not field_name:
        #                 continue
        #
        #             # If dropdown, include options
        #             if f.get("FieldType", "").lower() == "dropdown" and "options" in f:
        #                 fields_dict[field_name] = f["options"]
        #             else:
        #                 fields_dict[field_name] = None  # not collected yet
        #
        #         import json
        #         fields_prompt = json.dumps(fields_dict, indent=2)
        #
        # except Exception as fe:
        #     logger.warning(f"Could not fetch fields for client {client_id}: {fe}")

        # Build context-aware prompt
        prompt = f"""
You are an AI assistant helping call center agents during live calls.
Analyze the conversation transcript and provide real-time coaching suggestions.

SOP Guidelines:
{sop_content if sop_content else "No specific SOP guidelines available."}

Current Call Transcript:
{transcript}

Based on the transcript and SOP guidelines, provide coaching cards that will help the agent:
1. Say the right things (say_this)
2. Ask appropriate questions (ask_this)
3. Be aware of alerts or issues (alert)
4. Access relevant knowledge base info (kb)

Focus on immediate, actionable advice for the current moment in the call.
"""

        logger.info("Sending request to OpenAI...")

        await save_prompt_to_file(client_id, prompt)

        # Ensure we have valid API key
        if not openai_client.api_key:
            logger.error("OpenAI API key not configured")
            return []

        try:
            response = openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system",
                     "content": "You are a call center coaching assistant. Provide structured coaching cards based on conversation analysis. Always respond with valid JSON in the exact format specified."},
                    {"role": "user",
                     "content": prompt + "\n\nRespond with JSON in this exact format:\n{\n  \"coaching_cards\": [\n    {\n      \"type\": \"say_this|ask_this|alert|kb\",\n      \"title\": \"Card title\",\n      \"content\": \"Card content\",\n      \"priority\": \"low|normal|high|urgent\"\n    }\n  ]\n}"}
                ],
                temperature=0.3,
                max_tokens=1000
            )
        except Exception as api_error:
            logger.error(f"OpenAI API error: {api_error}")
            return []

        logger.info("Received response from OpenAI")
        logger.info(f"Response content: {response.choices[0].message.content}")

        # Try to parse JSON response
        try:
            result = json.loads(response.choices[0].message.content)
        except json.JSONDecodeError:
            # If JSON parsing fails, try to extract JSON from the response
            content = response.choices[0].message.content
            logger.warning(f"Failed to parse JSON response, attempting to extract: {content}")

            # Try to find JSON in the response
            import re
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                try:
                    result = json.loads(json_match.group())
                except json.JSONDecodeError:
                    logger.error("Could not parse extracted JSON")
                    return []
            else:
                logger.error("No JSON found in response")
                return []

        cards = []

        # Validate and create cards
        if "coaching_cards" in result and isinstance(result["coaching_cards"], list):
            logger.info(f"Found {len(result['coaching_cards'])} coaching cards in response")
            for i, card_data in enumerate(result["coaching_cards"]):
                try:
                    card = CoachCard(
                        type=card_data.get("type", "say_this"),
                        title=card_data.get("title", "Coaching Suggestion"),
                        content=card_data.get("content", "No content provided"),
                        priority=card_data.get("priority", "normal"),
                        timestamp=datetime.now(),
                        confidence=card_data.get("confidence", 0.8),
                        category=card_data.get("category", "general"),
                        action_required=card_data.get("action_required", False)
                    )
                    cards.append(card)
                    logger.info(f"Created card {i + 1}: {card.type} - {card.title} (confidence: {card.confidence})")
                except Exception as card_error:
                    logger.error(f"Error creating card {i + 1}: {card_error}")
                    continue

            # Update call metrics with analysis if available
            if "call_analysis" in result and call_id in call_metrics:
                analysis = result["call_analysis"]
                call_metrics[call_id].customer_sentiment = analysis.get("customer_sentiment", "neutral")
                call_metrics[call_id].call_category = analysis.get("call_category", "general")

        else:
            logger.warning("No coaching_cards found in response or invalid format")
            logger.warning(f"Response keys: {list(result.keys()) if isinstance(result, dict) else 'Not a dict'}")

        logger.info(f"Returning {len(cards)} coaching cards")
        return cards

    except Exception as e:
        logger.error(f"Error generating coaching cards: {e}")
        # Return fallback cards if AI fails
        return [
            CoachCard(
                type="alert",
                title="AI Coaching Unavailable",
                content="AI coaching is temporarily unavailable. Please follow standard procedures.",
                priority="normal",
                timestamp=datetime.now()
            )
        ]


async def ensure_cards_directory():
    try:
        os.makedirs(CARD_STORAGE_DIR, exist_ok=True)
    except Exception as e:
        logger.error(f"Error creating cards directory: {e}")

async def save_cards_to_file(call_id: str, cards: List[Dict[str, Any]]):
    try:
        await ensure_cards_directory()
        path = os.path.join(CARD_STORAGE_DIR, f"{call_id}.json")
        payload = {"coaching_cards": cards}
        async with aiofiles.open(path, 'w', encoding='utf-8') as f:
            # default=str ensures datetime values serialize
            await f.write(json.dumps(payload, ensure_ascii=False, default=str))
        logger.info(f"Saved {len(cards)} cards to {path}")
    except Exception as e:
        logger.error(f"Error saving cards for {call_id}: {e}")

async def load_cards_from_file(call_id: str) -> List[Dict[str, Any]]:
    try:
        path = os.path.join(CARD_STORAGE_DIR, f"{call_id}.json")
        if not os.path.exists(path):
            return []
        async with aiofiles.open(path, 'r', encoding='utf-8') as f:
            content = await f.read()
        data = json.loads(content)
        cards = data.get("coaching_cards", [])
        logger.info(f"Loaded {len(cards)} cards from {path}")
        return cards
    except Exception as e:
        logger.error(f"Error loading cards for {call_id}: {e}")
        return []


# Safe SOP loader (memory + file fallback)
async def get_sop_content_safe(client_id: Optional[str]) -> str:
    try:
        cid = client_id or "default"
        if cid in client_sops:
            return client_sops[cid]
        # Fallback to file
        content = await load_sop_from_file(cid)
        if content is not None:
            client_sops[cid] = content
            return content
        return ""
    except Exception as e:
        logger.error(f"get_sop_content_safe error for {client_id}: {e}")
        return ""

async def ensure_sop_directories():
    try:
        os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True) # Ensure parent directory exists
        os.makedirs(os.path.join(os.path.dirname(os.path.abspath(__file__)), "sop_storage"), exist_ok=True)
    except Exception as e:
        logger.error(f"Error creating SOP directories: {e}")

async def save_sop_to_file(client_id: str, content: str):
    try:
        await ensure_sop_directories()
        path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sop_storage", f"{client_id}.txt")
        async with aiofiles.open(path, 'w', encoding='utf-8') as f:
            await f.write(content)
        logger.info(f"Saved SOP content for client {client_id} to {path}")
    except Exception as e:
        logger.error(f"Error saving SOP for client {client_id}: {e}")


# async def save_prompt_to_file(client_id: str, prompt: str):
#     try:
#         # ensure directory exists
#         base_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "prompt_storage")
#         os.makedirs(base_dir, exist_ok=True)
#
#         # save with client_id
#         path = os.path.join(base_dir, f"{client_id}.txt")
#
#         async with aiofiles.open(path, "w", encoding="utf-8") as f:
#             await f.write(prompt)
#
#         logger.info(f"Saved prompt for client {client_id} to {path}")
#     except Exception as e:
#         logger.error(f"Error saving prompt for client {client_id}: {e}")

async def save_prompt_to_file(client_id: str, prompt: str):
    try:
        # Ensure directory exists (blocking is fine here)
        base_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "prompt_storage")
        os.makedirs(base_dir, exist_ok=True)

        # Save file with client_id as filename
        path = os.path.join(base_dir, f"{client_id}.txt")

        async with aiofiles.open(path, "w", encoding="utf-8") as f:
            await f.write(prompt)

        logger.info(f"Saved prompt for client {client_id} to {path}")

    except Exception as e:
        logger.error(f"Error saving prompt for client {client_id}: {e}")

async def load_sop_from_file(client_id: str) -> Optional[str]:
    try:
        path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sop_storage", f"{client_id}.txt")
        if not os.path.exists(path):
            return None
        async with aiofiles.open(path, 'r', encoding='utf-8') as f:
            content = await f.read()
        logger.info(f"Loaded SOP content for client {client_id} from {path}")
        return content
    except Exception as e:
        logger.error(f"Error loading SOP for client {client_id}: {e}")
        return None


# API Endpoints

@assist_router.post("/transcript-chunk")
async def receive_transcript_chunk(chunk: TranscriptChunk):
    """Receive final transcript chunks from EAGI bridge"""
    try:
        call_id_str = str(chunk.call_id)
        client_id_str = str(chunk.client_id)
        #print(client_id_str,"client_id_str==")
        # Initialize call metrics if this is the first chunk
        if call_id_str not in call_transcripts:
            call_transcripts[call_id_str] = []
            call_metrics[call_id_str] = CallMetrics(
                call_id=call_id_str,
                start_time=datetime.now()
            )

        # Ensure SOP for client is available (memory + file)
        _ = await get_sop_content_safe(chunk.client_id)

        call_transcripts[call_id_str].append(chunk.transcript)
        call_metrics[call_id_str].transcript_chunks += 1

        # Update system metrics
        system_metrics["total_transcripts"] += 1

        # Generate coaching cards with client-specific SOP
        full_transcript = " ".join(call_transcripts[call_id_str])
        coaching_cards = await generate_coaching_cards(full_transcript, call_id_str, chunk.client_id)

        # Update metrics
        call_metrics[call_id_str].coaching_cards_generated += len(coaching_cards)
        system_metrics["total_coaching_cards"] += len(coaching_cards)

        # Persist latest cards (file-backed for frontend polling)
        if coaching_cards:
            serialized = [c.dict() for c in coaching_cards]
            await save_cards_to_file(call_id_str, serialized)
            # Also save to in-memory storage for immediate access
            recent_call_cards[call_id_str] = serialized

        # Send cards to connected agents
        for card in coaching_cards:
            await manager.send_to_call(call_id_str, {
                "type": "coaching_card",
                "data": card.dict()
            })

        logger.info(f"Processed transcript chunk for call {call_id_str}")
        return {
            "status": "success",
            "cards_generated": len(coaching_cards),
            "call_metrics": call_metrics[call_id_str].dict()
        }

    except Exception as e:
        logger.error(f"Error processing transcript chunk: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@assist_router.websocket("/ws/{call_id}")
async def websocket_endpoint(websocket: WebSocket, call_id: str):
    """WebSocket endpoint for real-time agent coaching"""
    await manager.connect(websocket, call_id)
    try:
        while True:
            # Keep connection alive and handle any incoming messages
            data = await websocket.receive_text()
            message = json.loads(data)

            # Handle different message types from agent
            if message.get("type") == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
            elif message.get("type") == "request_context":
                # Send current transcript context
                transcript = " ".join(call_transcripts.get(call_id, []))
                await websocket.send_text(json.dumps({
                    "type": "context",
                    "transcript": transcript
                }))
                # Also replay recent coaching cards so UI can render immediately
                for card in recent_call_cards.get(call_id, []):
                    await websocket.send_text(json.dumps({
                        "type": "coaching_card",
                        "data": card
                    }, default=str))

    except WebSocketDisconnect:
        manager.disconnect(websocket, call_id)
    except Exception as e:
        logger.error(f"WebSocket error for call {call_id}: {e}")
        manager.disconnect(websocket, call_id)


@assist_router.post("/finalize/{call_id}")
async def finalize_call(call_id: str):
    """Finalize call and cleanup resources"""
    try:
        # Update call metrics
        if call_id in call_metrics:
            call_metrics[call_id].end_time = datetime.now()
            call_metrics[call_id].resolution_status = "resolved"

        # Send final coaching summary
        if call_id in call_transcripts:
            full_transcript = " ".join(call_transcripts[call_id])

            # Generate final cards
            final_cards = await generate_coaching_cards(full_transcript, call_id)

            # Send final cards
            for card in final_cards:
                await manager.send_to_call(call_id, {
                    "type": "final_summary",
                    "data": card.dict()
                })

            # Also generate and persist quality summary
            try:
                # Use client_id "default" unless you store real client_id elsewhere
                _ = await generate_and_save_quality_summary(call_id=call_id, client_id="default", transcript=full_transcript)
            except Exception as qerr:
                logger.error(f"Quality summary generation failed for {call_id}: {qerr}")

            # Cleanup transcript data (keep metrics for analytics)
            del call_transcripts[call_id]

        logger.info(f"Finalized call {call_id}")
        return {
            "status": "success",
            "message": f"Call {call_id} finalized",
            "metrics": call_metrics.get(call_id, {}).dict() if call_id in call_metrics else {}
        }

    except Exception as e:
        logger.error(f"Error finalizing call {call_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@assist_router.post("/sop")
async def upload_sop(sop: SOPData):
    """Upload or refresh SOP content (memory + file)."""
    try:
        # Save to memory
        client_sops[sop.client_id] = sop.content
        # Persist to file
        await ensure_sop_directories()
        await save_sop_to_file(sop.client_id, sop.content)
        logger.info(f"SOP content updated for client {sop.client_id} (memory + file), length={len(sop.content)}")
        # Strict response shape
        return {
            "status": "success",
            "message": f"SOP content updated for client {sop.client_id}",
            "client_id": sop.client_id,
            "length": len(sop.content),
            "persistent": True
        }
    except Exception as e:
        logger.error(f"Error updating SOP for client {sop.client_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@assist_router.get("/sop/{client_id}")
async def get_sop(client_id: str):
    """Get SOP content for a specific client (memory + file fallback)."""
    try:
        content = await get_sop_content_safe(client_id)
        if content:
            return {
                "client_id": client_id,
                "content": content,
                "length": len(content),
                "source": "memory" if client_id in client_sops else "file"
            }
        raise HTTPException(status_code=404, detail=f"No SOP found for client {client_id}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting SOP for client {client_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@assist_router.get("/analytics/calls")
async def get_call_analytics():
    """Get analytics for all calls"""
    try:
        total_calls = len(call_metrics)
        active_calls = len([m for m in call_metrics.values() if m.end_time is None])
        completed_calls = total_calls - active_calls

        # Calculate averages
        avg_chunks = sum(m.transcript_chunks for m in call_metrics.values()) / max(total_calls, 1)
        avg_cards = sum(m.coaching_cards_generated for m in call_metrics.values()) / max(total_calls, 1)

        # Sentiment analysis
        sentiments = [m.customer_sentiment for m in call_metrics.values()]
        sentiment_counts = {
            "positive": sentiments.count("positive"),
            "neutral": sentiments.count("neutral"),
            "negative": sentiments.count("negative")
        }

        # Call categories
        categories = [m.call_category for m in call_metrics.values()]
        category_counts = {}
        for cat in categories:
            category_counts[cat] = category_counts.get(cat, 0) + 1

        return {
            "total_calls": total_calls,
            "active_calls": active_calls,
            "completed_calls": completed_calls,
            "average_transcript_chunks": round(avg_chunks, 2),
            "average_coaching_cards": round(avg_cards, 2),
            "sentiment_distribution": sentiment_counts,
            "category_distribution": category_counts,
            "timestamp": datetime.now()
        }
    except Exception as e:
        logger.error(f"Error getting analytics: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@assist_router.get("/analytics/call/{call_id}")
async def get_call_details(call_id: str):
    """Get detailed analytics for a specific call"""
    try:
        if call_id not in call_metrics:
            raise HTTPException(status_code=404, detail="Call not found")

        metrics = call_metrics[call_id]
        transcript = " ".join(call_transcripts.get(call_id, []))

        return {
            "call_id": call_id,
            "metrics": metrics.dict(),
            "transcript": transcript,
            "transcript_length": len(transcript),
            "timestamp": datetime.now()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting call details: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@assist_router.get("/health")
async def health_check():
    """Health check endpoint"""
    # Update system metrics
    system_metrics["uptime_seconds"] = (datetime.now() - system_metrics["start_time"]).total_seconds()
    system_metrics["memory_usage_mb"] = psutil.Process().memory_info().rss / 1024 / 1024
    system_metrics["cpu_usage_percent"] = psutil.cpu_percent()
    system_metrics["active_calls"] = len([m for m in call_metrics.values() if m.end_time is None])

    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "uptime_seconds": system_metrics["uptime_seconds"],
        "memory_usage_mb": round(system_metrics["memory_usage_mb"], 2),
        "cpu_usage_percent": system_metrics["cpu_usage_percent"],
        "active_calls": system_metrics["active_calls"]
    }


@assist_router.get("/metrics")
async def get_system_metrics():
    """Get comprehensive system metrics"""
    # Update metrics
    system_metrics["uptime_seconds"] = (datetime.now() - system_metrics["start_time"]).total_seconds()
    system_metrics["memory_usage_mb"] = psutil.Process().memory_info().rss / 1024 / 1024
    system_metrics["cpu_usage_percent"] = psutil.cpu_percent()
    system_metrics["active_calls"] = len([m for m in call_metrics.values() if m.end_time is None])

    return {
        "system": system_metrics,
        "calls": {
            "total_calls": len(call_metrics),
            "active_calls": system_metrics["active_calls"],
            "completed_calls": len(call_metrics) - system_metrics["active_calls"]
        },
        "performance": {
            "avg_response_time": sum(m.avg_response_time for m in call_metrics.values()) / max(len(call_metrics), 1),
            "total_transcripts": system_metrics["total_transcripts"],
            "total_coaching_cards": system_metrics["total_coaching_cards"]
        },
        "timestamp": datetime.now()
    }


@assist_router.get("/debug/ai-test")
async def debug_ai_test():
    """Debug endpoint to test AI generation directly"""
    try:
        test_transcript = "I am very upset about my bill! This is the third time I have called about this issue."
        cards = await generate_coaching_cards(test_transcript, "debug-test")
        return {
            "status": "success",
            "cards_generated": len(cards),
            "cards": [card.dict() for card in cards]
        }
    except Exception as e:
        logger.error(f"Debug AI test failed: {e}")
        return {"status": "error", "message": str(e)}


@assist_router.get("/")
async def root():
    """Root endpoint with basic info"""
    return {
        "service": "Agent Assist Service",
        "version": "1.0.0",
        "endpoints": {
            "transcript": "POST /transcript-chunk",
            "websocket": "WS /ws/{call_id}",
            "finalize": "POST /finalize/{call_id}",
            "sop": "POST /sop",
            "debug": "GET /debug/ai-test"
        }
    }


@assist_router.get("/cards/{call_id}")
async def get_cards(call_id: str):
    """Return latest coaching cards for a call from memory or file."""
    try:
        call_id_str = str(call_id)
        
        # Try in-memory storage first (fastest)
        cards = recent_call_cards.get(call_id_str, [])
        
        # If no cards in memory, try loading from file
        if not cards:
            cards = await load_cards_from_file(call_id_str)
            # If we found cards in file, also update memory for next time
            if cards:
                recent_call_cards[call_id_str] = cards
        
        logger.info(f"Returning {len(cards)} cards for call {call_id_str}")
        return {"coaching_cards": cards}
    except Exception as e:
        logger.error(f"Error in /cards/{call_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@assist_router.get("/coaching-cards/{call_id}")
async def get_latest_cards_alias(call_id: str):
    """Alias endpoint returning the same payload."""
    return await get_cards(call_id)


@assist_router.get("/transcript-chunk/{call_id}")
async def get_latest_cards_transcript_alias(call_id: str):
    """Alias endpoint returning the same payload."""
    return await get_cards(call_id)

############################################# new changes ############################################

class Utterance(BaseModel):
    speaker: str
    text: str

class SopChunk(BaseModel):
    section: str
    text: str

class AgentConfirmed(BaseModel):
    key: str
    value: Optional[Any] = None

class AssembleIn(BaseModel):
    client_id: int
    call_id: str
    session_id: str
    last_utterances: List[Utterance] = Field(default_factory=list)
    sop_snippets: List[SopChunk] = Field(default_factory=list)
    agent_confirmed: List[AgentConfirmed] = Field(default_factory=list)
    allowed_intents: Optional[List[str]] = None

DEFAULT_INTENTS = [
    "Appointments","Enquiry","Refund","Cancellation",
    "Clinical/Medicine","Billing","General Inquiry"
]


def _norm(x): return "" if x is None else str(x).strip()

def infer_type(field_name: str, field_type: str, field_validation: str) -> str:
    n = _norm(field_name).lower()
    ft = _norm(field_type).lower()
    fv = _norm(field_validation).lower()
    if any(k in n for k in ["date","dob","doa","appointment"]): return "date_iso"
    if "email" in n: return "email"
    if any(k in n for k in ["phone","contact","mobile","msisdn","alt number","alt no"]): return "phone"
    if any(k in n for k in ["amount","amt","payment","price","charges","fee","balance"]): return "money"
    if any(k in n for k in ["is_","has_","flag","consent","dnc"]): return "boolean"
    if any(k in n for k in ["count","qty","quantity","no_of","number_of"]): return "number"
    if "drop" in ft or "dropdown" in ft:
        return "enum:<Option1|Option2|Option3>"  # replace if you have actual options table
    if "date" in ft: return "date_iso"
    if "number" in ft: return "number"
    return "string"

def uniq_key(field_name, field_number):
    fn = _norm(field_name); num=_norm(field_number)
    return f"{fn}#{num}" if num else fn

from pymysql.cursors import DictCursor

def get_client_schema(client_id: int):
    conn = next(get_db())   # SQLAlchemy session
    cur = conn.connection().connection.cursor(DictCursor)  # raw pymysql dict cursor ✅

    cur.execute("""SELECT id, ecrName FROM ecr_master WHERE Client=%s AND Label=1 ORDER BY id""",(client_id,))
    l1 = [{"id":int(r["id"]), "name":_norm(r["ecrName"])} for r in cur.fetchall()]

    cur.execute("""SELECT id, ecrName, parent_id FROM ecr_master WHERE Client=%s AND Label=2 ORDER BY parent_id,id""",(client_id,))
    l2 = []
    for r in cur.fetchall():
        l2.append({
            "id": int(r["id"]),
            "name": _norm(r["ecrName"]),
            "parent_id": int(r["parent_id"]) if r["parent_id"] is not None else 0
        })

    cur.execute("""SELECT FieldName, FieldType, FieldValidation, RequiredCheck, fieldNumber, Priority
                   FROM field_master WHERE ClientId=%s ORDER BY Priority, fieldNumber""",(client_id,))
    allowed_fields=[]
    for r in cur.fetchall():
        allowed_fields.append({
            "key": uniq_key(r.get("FieldName"), r.get("fieldNumber")),
            "type": infer_type(r.get("FieldName",""), r.get("FieldType",""), r.get("FieldValidation","")),
            "required": bool(int(r.get("RequiredCheck") or 0))
        })

    cur.close()
    conn.close()
    return {"level1": l1, "level2": l2, "allowed_fields": allowed_fields}

@assist_router.post("/assemble-payload")
def assemble_payload(inp: AssembleIn):
    schema = get_client_schema(inp.client_id)
    if not (schema["level1"] or schema["level2"] or schema["allowed_fields"]):
        raise HTTPException(404, f"No schema for client {inp.client_id}")
    return {
        "call_id": inp.call_id,
        "session_id": inp.session_id,
        "last_utterances": [u.dict() for u in inp.last_utterances][-6:],
        "sop_snippets": [s.dict() for s in inp.sop_snippets][:2],
        "allowed_intents": inp.allowed_intents or DEFAULT_INTENTS,
        "scenario": {"level1": schema["level1"], "level2": schema["level2"]},
        "allowed_fields": schema["allowed_fields"],
        "agent_confirmed": [a.dict() for a in inp.agent_confirmed]
    }

############################################# Quality Summary ############################################

async def ensure_quality_table(db_sess) -> None:
    try:
        # Use explicit transaction so DDL commits reliably
        engine = get_engine()
        with engine.begin() as conn:
            conn.execute(text(
                """
                CREATE TABLE IF NOT EXISTS quality_summary (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  call_id VARCHAR(100) NOT NULL,
                  client_id VARCHAR(100) NULL,
                  summary_json LONGTEXT NOT NULL,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """
            ))
    except Exception as e:
        logger.error(f"ensure_quality_table error: {e}")

def build_quality_prompt(conversation: str) -> str:
    return f"""
Please analyze the following conversation between an agent and a customer. Classify the interaction using the dropdown lists for Scenario, Sub Scenario, Sub Scenario 2, and Sub Scenario 3. Ensure that each field's options logically depend on the previous selection.

CONVERSATION:
{conversation}

OUTPUT JSON FORMAT (return only valid JSON matching this exact structure, no extra commentary):
{{
    "classification": {{
        "scenario": "<Scenario>",
        "scenario1": "<Sub Scenario>",
        "scenario2": "<Sub Scenario 2>",
        "scenario3": "<Sub Scenario 3>",
        "Name": "Customer Name",
        "Number": "if customer tells his name then return caller name.",
        "Address": "Address of the Customer",
        "Select City": "<Specify city for example : Chandigarh, Dehradun, Delhi, Faridabad, Firozabad, Ghaziabad, Goa, Greater Noida, Gurugram, Jaipur, Manali, Mathura, Mohali, Muradabad, Noida, Other, Panchkula, Ram Nagar>",
        "Pin Code": "Pincode from the Address of the Customer",
        "Floor Number": "Customer Floor No. from Address",
        "Issue": "<please specify issue for example Cabin glass problem, Call command problem, COP/LOP Button, COP/LOP Display, COP/LOP Nut Loose, Doors banging, Doors lock problem, Doors not closing/opening properly, Fall ceiling loose, Fan light continues on/off, Fan light problem, Jerk in lift, Level issue, Lift not working, Lift overloaded, Lift working with some issue, Noise in doors, Noise in lift, Other, Smell in lift, Speed issue, UPS/Battery Backup, Voice announcement card, Water in pit>",
        "Remarks": "<Brief complete customer VOC in remarks>",
        "File No": "<File No>",
        "Select Construction": "<Selecte as per the VOC Existing construction or New Construction>",
        "Space": "Space is related to area available or not"
    }},
    "ranking": "Ranking based on percentage",
    "areas_for_improvement": [
        "List of parameters needing improvement with explanations"
    ],
    "sensitive_word": "< e.g. social media or Akash Anand or consumer court or legal case etc. >",
    "sensitive_word_context": "<This parameter provides a detailed explanation of how the sensitive word (in this case, consumer court) is used in the conversation. It helps in understanding the context of the words mention, allowing for better interpretation of the situation and the potential impact on the conversation.>",
    "quality_parameters": {{
        "Did the agent follow the correct opening?": "<1 or 0>",
        "Did the agent maintain professionalism without rude behavior?": "<1 or 0>",
        "Did the agent use phrases that provide assurance or express appreciation?": "<1 or 0>",
        "Did the agent express empathy using keywords?": "<1 or 0>",
        "Did the agent use correct pronunciation and maintain clarity?": "<1 or 0>",
        "Did the agent speak with appropriate enthusiasm without fumbling?": "<1 or 0>",
        "Was the agent polite and free of sarcasm?": "<1 or 0>",
        "Did the agent actively listen without unnecessary interruptions?": "<1 or 0>",
        "Did the agent use proper grammar?": "<1 or 0>",
        "Did the agent accurately probe to understand the issue?": "<1 or 0>",
        "Did the agent inform the customer before placing them on hold using appropriate phrases?": "<1 or 0>",
        "Did the agent thank the customer for being on line after retrieving the call?": "<1 or 0>",
        "Was the customer informed about the exact steps being taken?": "<1 or 0>",
        "Did the agent clearly state timelines for resolution?": "<1 or 0>",
        "Did the agent provide a proper closure, including asking if the customer has further concerns?": "<1 or 0>",
        "total_score": "<Sum of all scores>",
        "max_score": 15,
        "quality_percentage": "<Calculated Percentage>"
    }},
    "competitor_analysis": {{
        "Competitor Name": "<Extract the name of the competitor mentioned by the customer.>",
        "Positive Comparison": "<Describe positive aspects of the product compared to the competitor mentioned by the customer.>",
        "Reason for Positive Comparison": "<Explain why the customer feels positively about the product in comparison to the competitor.>",
        "Exact Positive Language": "<Provide the exact language from the customer that indicates a positive comparison.>"
    }},
    "fraud_metrics": {{
        "Data Theft or Misuse": "Yes or No",
        "Unprofessional Behavior": "Yes or No",
        "System Manipulation": "Yes or No",
        "Financial Fraud": "Yes or No",
        "Escalation Failure": "Yes or No",
        "Collusion": "Yes or No",
        "Policy Communication Failure": "Yes or No",
        "Areas for Improvement": "Yes or No"
    }},
    "fraud_metrics_conversation": {{
        "Data Theft or Misuse Text": "<text or empty>",
        "Unprofessional Behavior Text": "<text or empty>",
        "System Manipulation Text": "<text or empty>",
        "Financial Fraud Text": "<text or empty>",
        "Escalation Failure Text": "<text or empty>",
        "Collusion Text": "<text or empty>",
        "Policy Communication Failure Text": "<text or empty>"
    }},
    "sentiment_analysis": {{
        "top_positive_words": ["<list>"],
        "top_negative_words": ["<list>"],
        "top_positive_words_agent": ["<list>"],
        "top_negative_words_agent": ["<list>"],
        "cuss_words": {{
            "agent": {{"english": {{"list": [], "count": "<Count>"}}, "hindi": {{"list": [], "count": "<Count>"}}}},
            "customer": {{"english": {{"list": [], "count": "<Count>"}}, "hindi": {{"list": [], "count": "<Count>"}}}}
        }}
    }}
}}

INSTRUCTIONS:
- Follow scenario/sub-scenario dependencies exactly as specified.
- If any critical parameter scores 0, set overall quality_percentage to 0.
- If lift working with issue then stopped, classify as Complaint.
- TAT rules: Emergency Man Trap/Hospital Lift: 30 minutes; Working with issues: 24 working hours; Lift stopped: 3-4 working hours; If complaint raised before/after TAT then Escalation.
- Ensure address accuracy and set Issue when customer highlights an issue.
"""

async def generate_quality_summary_openai(transcript: str) -> dict:
    prompt = build_quality_prompt(transcript)
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a strict JSON generator. Always output valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=2000
        )
        content = response.choices[0].message.content
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            import re
            m = re.search(r"\{[\s\S]*\}", content)
            if m:
                return json.loads(m.group(0))
            raise
    except Exception as e:
        logger.error(f"OpenAI quality summary error: {e}")
        return {}

async def save_quality_summary_db(call_id: str, client_id: Optional[str], summary: dict) -> None:
    # Use engine connection for reliability
    engine = get_engine()
    try:
        await ensure_quality_table(None)
        with engine.begin() as conn:
            conn.execute(
                text("INSERT INTO quality_summary (call_id, client_id, summary_json) VALUES (:c, :cl, :j)"),
                {"c": call_id, "cl": client_id, "j": json.dumps(summary, ensure_ascii=False)}
            )
    except Exception as e:
        logger.error(f"save_quality_summary_db error: {e}")

async def save_quality_summary_file(call_id: str, summary: dict) -> None:
    try:
        await ensure_cards_directory()
        path = os.path.join(CARD_STORAGE_DIR, f"quality_{call_id}.json")
        async with aiofiles.open(path, 'w', encoding='utf-8') as f:
            await f.write(json.dumps(summary, ensure_ascii=False))
    except Exception as e:
        logger.error(f"save_quality_summary_file error: {e}")

async def generate_and_save_quality_summary(call_id: str, client_id: Optional[str], transcript: str) -> dict:
    summary = await generate_quality_summary_openai(transcript)
    if summary:
        await save_quality_summary_db(call_id, client_id, summary)
        await save_quality_summary_file(call_id, summary)
    return summary

@assist_router.post("/quality-summary")
async def quality_summary_endpoint(payload: dict):
    try:
        call_id = str(payload.get("call_id") or "")
        client_id = str(payload.get("client_id") or "default")
        transcript = str(payload.get("transcript") or "")
        if not call_id:
            raise HTTPException(status_code=400, detail="call_id is required")
        if not transcript and call_id in call_transcripts:
            transcript = " ".join(call_transcripts.get(call_id, []))
        if not transcript:
            raise HTTPException(status_code=400, detail="transcript is required")

        summary = await generate_and_save_quality_summary(call_id=call_id, client_id=client_id, transcript=transcript)
        return {"status": "success", "call_id": call_id, "summary": summary}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"/quality-summary error: {e}")
        raise HTTPException(status_code=500, detail=str(e))