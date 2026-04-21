import React, { useState, useEffect, useRef } from "react";
import "../styles/TaggingHistorySearchTabs.css";
import api from "../api";

export default function AgentDashboard() {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  console.log(formData,"formData===")
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [showUntaggedModal, setShowUntaggedModal] = useState(false);
  const [untaggedCalls, setUntaggedCalls] = useState([]);
  const [selectedCallId, setSelectedCallId] = useState("");
  const [selectedCallData, setSelectedCallData] = useState(null);
  const [callDate, setCallDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [performance, setPerformance] = useState({
    total_calls: 0,
    tagged_calls: 0,
    not_tagged_calls: 0
  });
  const [showTrainingHub, setShowTrainingHub] = useState(false);
  const [trainingFiles, setTrainingFiles] = useState([]);

  // Scenario states (Level 1 → 5)
  const [scenarioList, setScenarioList] = useState([]);
  const [scenario1List, setScenario1List] = useState([]);
  const [scenario2List, setScenario2List] = useState([]);
  const [scenario3List, setScenario3List] = useState([]);
  const [scenario4List, setScenario4List] = useState([]);

  const [selectedScenario, setSelectedScenario] = useState("");
  const [selectedScenario1, setSelectedScenario1] = useState("");
  const [selectedScenario2, setSelectedScenario2] = useState("");
  const [selectedScenario3, setSelectedScenario3] = useState("");
  const [selectedScenario4, setSelectedScenario4] = useState("");


  const [selectedScenarioLabel, setSelectedScenarioLabel] = useState("");
  const [selectedScenario1Label, setSelectedScenario1Label] = useState("");
  const [selectedScenario2Label, setSelectedScenario2Label] = useState("");
  const [selectedScenario3Label, setSelectedScenario3Label] = useState("");
  const [selectedScenario4Label, setSelectedScenario4Label] = useState("");


  const [companyId, setCompanyId] = useState(null);
  const [authPerson, setAuthPerson] = useState("");
  const searchParams = new URLSearchParams(window.location.search);
  const vendor_id = searchParams.get("vendor_id");
  //const phone = searchParams.get("phone_number");
  const [phone, setPhone] = useState("");

  const callId = searchParams.get("uniqueid");
  const epochStr = searchParams.get("epoch");
  const epoch = Number(epochStr);
  const lead_id = searchParams.get("lead_id");


  const displayname = localStorage.getItem("displayname");
  const username = localStorage.getItem("username");
  const agent_id = localStorage.getItem("id");
  const [resolutionHtml, setResolutionHtml] = useState("");
  const isFirstLoad = useRef(true);


  const [processUpdates, setProcessUpdates] = useState([]);
  const [loadingUpdates, setLoadingUpdates] = useState(false);

  const [showHistory, setShowHistory] = useState(false);
  const [callHistory, setCallHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const rawPhone = searchParams.get("phone_number");
  const msisdn = rawPhone
  ? rawPhone.replace(/\D/g, "").slice(-10)
  : null;


  const thStyle = {
  textAlign: "left",
  padding: "10px",
  fontWeight: 600,
  color: "#555",
  borderBottom: "1px solid #ddd"
};

const tdStyle = {
  padding: "15px",
  color: "#333",
  verticalAlign: "top"
};


  const fetchProcessUpdates = async () => {
  setLoadingUpdates(true);
  try {
    const res = await api.get("/call/process-update", {
      params: { client_id: companyId }
    });
    setProcessUpdates(res.data.data || []);
  } catch (err) {
    console.error("Process update error:", err);
  }
  setLoadingUpdates(false);
};

useEffect(() => {
  if (!companyId) return;
  fetchProcessUpdates();
}, [companyId]);


const handleReadClick = async (process_id) => {
  try {
    await api.post("/call/process-read", {
      agent_id: agent_id,
      process_id: process_id
    });
  } catch (err) {
    console.error(err);
  }

};



const now = Math.floor(Date.now() / 1000);

let diffSeconds = epoch - now;

if (diffSeconds <= 0) {
  console.log("Expired"); // Already passed
} else {
  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;
  console.log(`Duration: ${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
}



  // AI Co-pilot state - start with empty cards
  const [aiCards, setAiCards] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsReconnectAttempts, setWsReconnectAttempts] = useState(0);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const ENABLE_WS = false; // disable WS for finalize endpoint
  const ASSIST_BASE = process.env.REACT_APP_ASSIST_BASE || "http://172.12.13.118:8010";
  const USE_CHUNK_POLL = true; // poll transcript chunk cards instead of finalize


    const fetchCallHistory = async () => {
      if (!companyId || companyId === "null") {
        alert("Please Select Client.");
        return;
      }
      try {
        setShowHistory(true)
        setLoading(true);
        const res = await api.post(
          "/call/call-history",
          {},
          {
            params: {
              clientId: companyId, // companyId → clientId
              agent_id: agent_id
            }
          }
        );
        setCallHistory(res.data.data || []);
      } catch (err) {
        console.error("Call history error:", err);
      } finally {
        setLoading(false);
      }
    };


    const fetchTrainingHub = async () => {
      if (!companyId || companyId === "null") {
        alert("Select Client");
        return;
        }

        setShowTrainingHub(true);
        
          try {
            setLoading(true);
    
            const res = await api.post("/call/trainning_hub", {
              client_id: companyId
            });
    
            setTrainingFiles(res.data.data || []);
          } catch (err) {
            console.error("Training hub error:", err);
          } finally {
            setLoading(false);
          }
        };


useEffect(() => {
  if (showHistory) {
    fetchCallHistory();
  }
}, [showHistory]);

useEffect(() => {
  if (showTrainingHub) {
    fetchTrainingHub();
  }
}, [showTrainingHub]);


useEffect(() => {
  const fetchClients = async () => {
    try {
      const res = await api.get("/agents/agent-clients-rights", {
        params: {
          agent_id: agent_id
        }
      });

      const sortedClients = res.data.sort((a, b) =>
        a.company_name.localeCompare(b.company_name, "en", {
          sensitivity: "base",
        })
      );

      setClients(sortedClients);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  fetchClients();
}, []);


  useEffect(() => {
    const fetchUntaggedCalls = async () => {
      if (!selectedClient || !agent_id) return;

      try {

        const res = await api.get("/report/untagged-calls", {
          params: {
            client_id: selectedClient,
            agent_id: agent_id,
            call_date: callDate,
          },
        });

        setUntaggedCalls(res.data.data || []);
      } catch (err) {
        console.error("Error fetching untagged calls:", err);
      }
    };

    fetchUntaggedCalls();
  }, [selectedClient]);


  useEffect(() => {
    if (!showUntaggedModal) return;

    const fetchUntaggedCalls = async () => {
      if (!selectedClient || !agent_id || !callDate) return;

      try {
        const res = await api.get("/report/untagged-calls", {
          params: {
            client_id: selectedClient,
            agent_id: agent_id,
            call_date: callDate,
          },
        });

        setUntaggedCalls(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUntaggedCalls();
  }, [showUntaggedModal, selectedClient, callDate]);



  // Fetch fields for the call
  useEffect(() => {
  if (!selectedClient) return;

  // selectedClient IS the client_id
  setCompanyId(selectedClient);

  api
    .get(`/call/fields/${selectedClient}`)
    .then((res) => {
      setFields(res.data);

      // Initialize formData
      const initialData = {};
      res.data.forEach((field) => {
        initialData[field.FieldName] = "";
      });
      setFormData(initialData);
    })
    .catch((err) =>
      console.error("Error fetching fields:", err)
    );
}, [selectedClient]);



  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const agent_id = localStorage.getItem("id");

        const res = await api.post("/report/agent_call_summary", {
          date: callDate,
          agent_id: agent_id
        });

        setPerformance(res.data);
      } catch (err) {
        console.error("Performance API error:", err);
      }
    };

    fetchPerformance();
  }, [callDate]);



  // Fetch Level 1 scenarios
  useEffect(() => {
    if (!companyId) return;

    api
      .get(`/core_api/categories/level1?client_id=${companyId}`)
      .then((res) => setScenarioList(res.data))
      .catch((err) => console.error("Error fetching level1 scenarios:", err));
  }, [companyId]);

useEffect(() => {
  if (!companyId) return;

  api
    .get(`/auth/auth-person?client_id=${companyId}`)
    .then((res) => setAuthPerson(res.data.auth_person))
    .catch((err) => console.error("Error fetching auth person:", err));
}, [companyId]);


  // Generic fetch for children scenarios
  const fetchChildren = async (level, parentId, setter) => {
    if (!parentId) return;
    try {
      const res = await api.get(
        `/core_api/categories/level${level}/${parentId}?client_id=${companyId}`
      );
      setter(res.data);
    } catch (err) {
      console.error(`Error fetching level${level} scenarios:`, err);
    }
  };

  const fetchResolution = async () => {
  try {
    const res = await api.post("/call/get-fetch_resolution", {
      client_id: companyId,
      language: "En",
      scenario1: selectedScenarioLabel || "",
      scenario2: selectedScenario1Label || "",
      scenario3: selectedScenario2Label || "",
      scenario4: selectedScenario3Label || "",
      scenario5: selectedScenario4Label || "",
    });

    setResolutionHtml(res.data.resolution || "");
  } catch (err) {
    console.error("Resolution fetch failed", err);
  }
};

useEffect(() => {
  if (!companyId) return;
  if (isFirstLoad.current) {
    fetchResolution();
    isFirstLoad.current = false;
    return;
  }

  if (
    selectedScenarioLabel ||
    selectedScenario1Label ||
    selectedScenario2Label ||
    selectedScenario3Label ||
    selectedScenario4Label
  ) {
    fetchResolution();
  }
}, [
  companyId,
  selectedScenarioLabel,
  selectedScenario1Label,
  selectedScenario2Label,
  selectedScenario3Label,
  selectedScenario4Label,
]);



  // Handlers for scenario dropdown changes
  const handleScenarioChange = (e) => {
    const value = e.target.value;
    const text  = e.target.options[e.target.selectedIndex].text;

    setSelectedScenario(value);
    setSelectedScenarioLabel(text);

    setScenario1List([]);
    setScenario2List([]);
    setScenario3List([]);
    setScenario4List([]);
    setSelectedScenario1("");
    setSelectedScenario2("");
    setSelectedScenario3("");
    setSelectedScenario4("");
    setSelectedScenario1Label("");
    setSelectedScenario2Label("");
    setSelectedScenario3Label("");
    setSelectedScenario4Label("");

    if (value) fetchChildren(2, value, setScenario1List);
  };

  const handleScenario1Change = (e) => {
    const value = e.target.value;
    const text  = e.target.options[e.target.selectedIndex].text;

    setSelectedScenario1(value);
    setSelectedScenario1Label(text);

    setScenario2List([]);
    setScenario3List([]);
    setScenario4List([]);
    setSelectedScenario2("");
    setSelectedScenario3("");
    setSelectedScenario4("");
    setSelectedScenario2Label("");
    setSelectedScenario3Label("");
    setSelectedScenario4Label("");

    if (value) fetchChildren(3, value, setScenario2List);
  };

  const handleScenario2Change = (e) => {
    const value = e.target.value;
    const text  = e.target.options[e.target.selectedIndex].text;
    setSelectedScenario2(value);
    setSelectedScenario2Label(text);

    setScenario3List([]);
    setScenario4List([]);
    setSelectedScenario3("");
    setSelectedScenario4("");
    setSelectedScenario3Label("");
    setSelectedScenario4Label("");


    if (value) fetchChildren(4, value, setScenario3List);
  };

  const handleScenario3Change = (e) => {
    const value = e.target.value;
    const text  = e.target.options[e.target.selectedIndex].text;
    setSelectedScenario3(value);
    setSelectedScenario3Label(text);

    setScenario4List([]);
    setSelectedScenario4("");
    setSelectedScenario4Label("");


    if (value) fetchChildren(5, value, setScenario4List);
  };

  const handleScenario4Change = (e) => {
  const value = e.target.value;
  const text  = e.target.options[e.target.selectedIndex].text;

  setSelectedScenario4(value);
  setSelectedScenario4Label(text);
};


  // ✅ Handle input change for fields
  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // ✅ Render input for dynamic fields
  const renderInput = (field) => {
    const typeMap = {
      email: "email",
      mobile: "tel",
      single_line: "text",
      time: "time",
      date: "date",
    };
    const inputType = typeMap[field.DefinedField] || "text";

    if (field.FieldType === "TextBox") {
      return (
        <input
          type={inputType}
          className="form-control"
          value={formData[field.FieldName] || ""}
          placeholder={`Enter ${field.FieldName}`}
          onChange={(e) => handleChange(field.FieldName, e.target.value)}
        />
      );
    }

    if (field.FieldType === "TextArea") {
      return (
        <textarea
          className="form-control"
          rows="3"
          value={formData[field.FieldName] || ""}
          placeholder={`Enter ${field.FieldName}`}
          onChange={(e) => handleChange(field.FieldName, e.target.value)}
        />
      );
    }

    if (field.FieldType === "Select") {
      return (
        <select
          className="form-select"
          value={formData[field.FieldName] || ""}
          onChange={(e) => handleChange(field.FieldName, e.target.value)}
        >
          <option value="">Select {field.FieldName}</option>
          {field.Options?.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    if (field.FieldType?.toLowerCase() === "dropdown") {
      return (
        <select
          className="form-select"
          value={formData[field.FieldName] || ""}
          onChange={(e) => handleChange(field.FieldName, e.target.value)}
        >
          <option value="">Select {field.FieldName}</option>
          {field.options?.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }


    return (
      <input
        type="text"
        className="form-control"
        value={formData[field.FieldName] || ""}
        onChange={(e) => handleChange(field.FieldName, e.target.value)}
      />
    );
  };

  const customColStyle = { marginBottom: "15px" };

  // Generate coaching cards based on transcript content
  const generateCardsFromTranscript = (transcript) => {
    const transcriptLower = transcript.toLowerCase();
    const cards = [];

    // Greeting detection (English, Hindi, mixed)
    if (transcriptLower.includes('hello') || transcriptLower.includes('hi') ||
        transcriptLower.includes('ji') || transcriptLower.includes('namaste') ||
        transcriptLower.includes('kaise') || transcriptLower.includes('haal')) {
      cards.push({
        id: Date.now() + Math.random(),
        type: "say this",
        title: "Greeting Response",
        content: "Hello! Thank you for calling. How can I assist you today?",
        priority: "high",
        timestamp: new Date()
      });

      cards.push({
        id: Date.now() + Math.random() + 1,
        type: "ask this",
        title: "Identify Customer Needs",
        content: "What can I help you with today?",
        priority: "normal",
        timestamp: new Date()
      });
    }

    // Phone/Product related cards
    if (transcriptLower.includes('iphone') || transcriptLower.includes('oppo') ||
        transcriptLower.includes('samsung') || transcriptLower.includes('phone') ||
        transcriptLower.includes('mobile') || transcriptLower.includes('handset')) {

      let phoneType = "phone";
      if (transcriptLower.includes('iphone')) phoneType = "iPhone";
      else if (transcriptLower.includes('oppo')) phoneType = "Oppo";
      else if (transcriptLower.includes('samsung')) phoneType = "Samsung";

      cards.push({
        id: Date.now() + Math.random() + 2,
        type: "kb",
        title: `${phoneType} Product Information`,
        content: `Customer is asking about ${phoneType}. Provide current models, pricing, and availability information.`,
        priority: "high",
        timestamp: new Date()
      });
    }

    // Price related cards
    if (transcriptLower.includes('price') || transcriptLower.includes('cost') ||
        transcriptLower.includes('kitna') || transcriptLower.includes('rate') ||
        transcriptLower.includes('15000') || transcriptLower.includes('budget') ||
        /\d+/.test(transcriptLower)) {

      // Extract budget if mentioned
      const budgetMatch = transcriptLower.match(/(\d+)/);
      const budget = budgetMatch ? budgetMatch[1] : "";

      cards.push({
        id: Date.now() + Math.random() + 3,
        type: "say this",
        title: "Pricing Response",
        content: budget ? `I understand your budget is around ₹${budget}. Let me show you the best options in that range.` : "Let me get you the most current pricing information for our products.",
        priority: "high",
        timestamp: new Date()
      });
    }

    // Purchase/Buy related cards
    if (transcriptLower.includes('buy') || transcriptLower.includes('purchase') ||
        transcriptLower.includes('khareed') || transcriptLower.includes('lena')) {
      cards.push({
        id: Date.now() + Math.random() + 4,
        type: "ask this",
        title: "Purchase Intent",
        content: "Are you looking to purchase today, or would you like to explore your options first?",
        priority: "normal",
        timestamp: new Date()
      });
    }

    // How to buy process
    if (transcriptLower.includes('how to buy') || transcriptLower.includes('how to purchase') ||
        transcriptLower.includes('kaise kharide') || transcriptLower.includes('process')) {
      cards.push({
        id: Date.now() + Math.random() + 5,
        type: "kb",
        title: "Purchase Process",
        content: "Guide customer through our purchase process: model selection, payment options, and delivery.",
        priority: "normal",
        timestamp: new Date()
      });
    }

    // Additional conversation patterns
    if (transcriptLower.includes('help') || transcriptLower.includes('madad') || transcriptLower.includes('sahayata')) {
      cards.push({
        id: Date.now() + Math.random() + 10,
        type: "say this",
        title: "Help Response",
        content: "I'm here to help you. What specific assistance do you need?",
        priority: "normal",
        timestamp: new Date()
      });
    }

    if (transcriptLower.includes('thank') || transcriptLower.includes('dhanyawad') || transcriptLower.includes('shukriya')) {
      cards.push({
        id: Date.now() + Math.random() + 11,
        type: "say this",
        title: "Thank You Response",
        content: "You're welcome! Is there anything else I can help you with?",
        priority: "normal",
        timestamp: new Date()
      });
    }

    // If no specific cards generated, add general ones
    if (cards.length === 0) {
      cards.push(
        {
          id: Date.now() + Math.random(),
          type: "ask this",
          title: "Clarify Customer Needs",
          content: "Can you tell me more about what you're looking for?",
          priority: "normal",
          timestamp: new Date()
        },
        {
          id: Date.now() + Math.random() + 1,
          type: "say this",
          title: "Active Listening",
          content: "I understand you're interested in our products. Let me help you find the right solution.",
          priority: "normal",
          timestamp: new Date()
        }
      );
    }

    return cards;
  };

  // Generate coaching cards based on API metrics
  const generateCardsFromMetrics = (metrics) => {
    const cards = [];

    // Call duration analysis
    if (metrics.start_time && metrics.end_time) {
      const startTime = new Date(metrics.start_time);
      const endTime = new Date(metrics.end_time);
      const duration = Math.round((endTime - startTime) / 1000 / 60); // minutes

      if (duration > 10) {
        cards.push({
          id: Date.now() + Math.random(),
          type: "alert",
          title: "Long Call Duration",
          content: `Call lasted ${duration} minutes. Consider summarizing key points and checking customer satisfaction.`,
          priority: "normal",
          timestamp: new Date()
        });
      }
    }

    // Transcript chunks analysis
    if (metrics.transcript_chunks) {
      cards.push({
        id: Date.now() + Math.random() + 1,
        type: "kb",
        title: "Call Analysis",
        content: `Call processed ${metrics.transcript_chunks} transcript chunks. Review conversation flow and key topics discussed.`,
        priority: "normal",
        timestamp: new Date()
      });
    }

    // Coaching cards generated
    if (metrics.coaching_cards_generated) {
      cards.push({
        id: Date.now() + Math.random() + 2,
        type: "say this",
        title: "Coaching Summary",
        content: `${metrics.coaching_cards_generated} coaching suggestions were provided during this call.`,
        priority: "normal",
        timestamp: new Date()
      });
    }

    // Customer sentiment
    if (metrics.customer_sentiment) {
      const sentiment = metrics.customer_sentiment;
      let sentimentCard = {
        id: Date.now() + Math.random() + 3,
        type: "alert",
        title: "Customer Sentiment",
        content: `Customer sentiment: ${sentiment}`,
        priority: sentiment === "positive" ? "normal" : "high",
        timestamp: new Date()
      };

      if (sentiment === "negative") {
        sentimentCard.content = "Customer sentiment is negative. Consider follow-up actions and escalation if needed.";
      } else if (sentiment === "positive") {
        sentimentCard.content = "Customer sentiment is positive. Great job! Consider upselling opportunities.";
      }

      cards.push(sentimentCard);
    }

    // Call category
    if (metrics.call_category) {
      cards.push({
        id: Date.now() + Math.random() + 4,
        type: "kb",
        title: "Call Category",
        content: `Call categorized as: ${metrics.call_category}. Use appropriate scripts and knowledge base.`,
        priority: "normal",
        timestamp: new Date()
      });
    }

    // Resolution status
    if (metrics.resolution_status) {
      const status = metrics.resolution_status;
      let resolutionCard = {
        id: Date.now() + Math.random() + 5,
        type: status === "resolved" ? "say this" : "alert",
        title: "Resolution Status",
        content: `Call status: ${status}`,
        priority: status === "resolved" ? "normal" : "high",
        timestamp: new Date()
      };

      if (status === "resolved") {
        resolutionCard.content = "Call successfully resolved. Document key points and follow-up actions.";
      } else if (status === "ongoing") {
        resolutionCard.content = "Call still ongoing. Continue providing assistance and monitor progress.";
      } else if (status === "escalated") {
        resolutionCard.content = "Call has been escalated. Ensure proper handoff and documentation.";
      }

      cards.push(resolutionCard);
    }

    return cards;
  };

  // Generate coaching cards from call data when metrics is empty
  const generateCardsFromCallData = (data, callId) => {
    const cards = [];

    // Call finalized successfully
    if (data.status === "success") {
      cards.push({
        id: Date.now() + Math.random(),
        type: "say this",
        title: "Call Finalized",
        content: `Call ${callId} has been successfully finalized. Review the conversation and document key points.`,
        priority: "normal",
        timestamp: new Date()
      });
    }

    // Call ID information
    if (callId) {
      cards.push({
        id: Date.now() + Math.random() + 1,
        type: "kb",
        title: "Call Information",
        content: `Call ID: ${callId}. Use this reference for follow-up actions and documentation.`,
        priority: "normal",
        timestamp: new Date()
      });
    }

    // API message
    if (data.message) {
      cards.push({
        id: Date.now() + Math.random() + 2,
        type: "alert",
        title: "System Message",
        content: data.message,
        priority: "normal",
        timestamp: new Date()
      });
    }

    // General coaching suggestions
    cards.push({
      id: Date.now() + Math.random() + 3,
      type: "ask this",
      title: "Customer Follow-up",
      content: "How was the customer's experience? Any follow-up actions needed?",
      priority: "normal",
      timestamp: new Date()
    });

    cards.push({
      id: Date.now() + Math.random() + 4,
      type: "say this",
      title: "Documentation",
      content: "Ensure all call details are properly documented for future reference.",
      priority: "normal",
      timestamp: new Date()
    });

    return cards;
  };

  // Helper function to get card styling based on type
  const getCardStyle = (cardType, priority) => {
    const baseStyle = {
      border: "1px solid #e0e0e0",
      borderRadius: "10px",
      padding: "20px",
      marginBottom: "12px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    };

    const typeStyles = {
      kb: { borderLeft: "4px solid #3498db", backgroundColor: "#f8f9fa" },
      alert: { borderLeft: "4px solid #e74c3c", backgroundColor: "#fdf2f2" },
      "ask this": { borderLeft: "4px solid #f39c12", backgroundColor: "#fff8e1" },
      "say this": { borderLeft: "4px solid #27ae60", backgroundColor: "#f0f9f0" }
    };

    const priorityStyles = {
      high: { borderColor: "#e74c3c", boxShadow: "0 2px 8px rgba(231,76,60,0.2)" },
      normal: { borderColor: "#e0e0e0" },
      low: { borderColor: "#bdc3c7", opacity: 0.8 }
    };

    return {
      ...baseStyle,
      ...typeStyles[cardType] || typeStyles.kb,
      ...priorityStyles[priority] || priorityStyles.normal
    };
  };

  // ---------------- AI Co-pilot: Static WebSocket (only changes with transcript) ----------------
  const connectWebSocket = () => {
    if (!ENABLE_WS) return; // WS disabled
    if (!callId) return;

    const wsUrl = `ws://localhost:8010/finalize/${callId}`;

    try {
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
        console.log("WebSocket connected successfully to:", wsUrl);
        setWsConnected(true);
        setWsReconnectAttempts(0);

      // Request current context + replay recent cards
        try {
      ws.send(JSON.stringify({ type: "request_context" }));
          console.log("Sent request_context message");
        } catch (sendError) {
          console.error("Error sending initial message:", sendError);
        }
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
          console.log("Received WebSocket message:", msg);

          // Handle transcript data and generate coaching cards
          if (msg.transcript && msg.call_id) {
            console.log("Processing transcript:", msg.transcript);

            // Generate coaching cards based on transcript content
            const transcriptCards = generateCardsFromTranscript(msg.transcript);
            console.log("Generated cards:", transcriptCards);
            setAiCards(transcriptCards);

          } else if (msg.type === "coaching_card" && msg.data && msg.data.content) {
            console.log("Processing coaching card:", msg.data);
          const card = {
            ...msg.data,
            id: Date.now() + Math.random(),
            timestamp: new Date(msg.data?.timestamp || new Date()),
          };
          setAiCards((prev) => [card, ...prev].slice(0, 10));
          } else if (msg.type === "final_summary" && msg.data && msg.data.content) {
            console.log("Processing final summary:", msg.data);
          const card = {
            ...msg.data,
            id: Date.now() + Math.random(),
            timestamp: new Date(msg.data?.timestamp || new Date()),
          };
          setAiCards((prev) => [card, ...prev].slice(0, 10));
          } else if (msg.transcript) {
            // Fallback: if transcript exists but no call_id
            console.log("Processing transcript (fallback):", msg.transcript);
            const transcriptCards = generateCardsFromTranscript(msg.transcript);
            console.log("Generated cards (fallback):", transcriptCards);
            setAiCards(transcriptCards);
          } else if (msg.text || msg.content) {
            // Another fallback: if message has text/content field
            const text = msg.text || msg.content;
            console.log("Processing text content:", text);
            const transcriptCards = generateCardsFromTranscript(text);
            console.log("Generated cards from text:", transcriptCards);
            setAiCards(transcriptCards);
          } else {
            console.log("Unknown message format:", msg);
            console.log("Message keys:", Object.keys(msg));
        }
      } catch (e) {
        console.error("WS parse error", e);
          console.error("Raw message:", event.data);
      }
    };

    ws.onerror = (e) => {
        console.error("WebSocket error:", e);
        setWsConnected(false);
      };

      ws.onclose = (e) => {
        console.log("WebSocket closed", e.code, e.reason);
        setWsConnected(false);

        // Don't auto-reconnect if it's a server configuration issue
        if (e.code === 1006 || e.code === 1011) {
          console.log("Server configuration issue detected. Cards remain static.");
          return;
        }

        // Auto-reconnect with exponential backoff for other errors
        if (wsReconnectAttempts < 3) {
          const delay = Math.min(2000 * Math.pow(2, wsReconnectAttempts), 10000);
          console.log(`Attempting to reconnect in ${delay}ms... (attempt ${wsReconnectAttempts + 1}/3)`);

          reconnectTimeoutRef.current = setTimeout(() => {
            setWsReconnectAttempts(prev => prev + 1);
            connectWebSocket();
          }, delay);
        } else {
          console.log("Max reconnection attempts reached. Cards remain static.");
        }
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setWsConnected(false);
    }
  };

  // Fetch coaching cards from HTTP API
  const fetchCoachingCards = async () => {
    try {
      if (!callId) {
        console.warn("No callId available for fetching coaching cards");
        return;
      }
      const url = `${ASSIST_BASE}/finalize/${callId}`;
      console.log("Fetching coaching cards for call:", callId);
      console.log("API URL:", url);

      // Always POST (server does not allow GET)
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Finalize API error:", response.status, errorText);
        setAiCards([]);
        return;
      }

      const data = await response.json();
      console.log("Finalize API Response:", data);

      const rawCards = data?.coaching_cards || [];
      const metricsCards = data?.metrics?.coaching_cards || [];
      const sourceCards = rawCards.length ? rawCards : metricsCards;

      if (!Array.isArray(sourceCards) || sourceCards.length === 0) {
        console.log("No coaching_cards present in finalize response.");
        setAiCards([]);
        return;
      }

      const normalizePriority = (p) => {
        if (!p) return "normal";
        const v = String(p).toLowerCase();
        if (v === "urgent") return "high";
        if (["high","normal","low"].includes(v)) return v;
        return "normal";
      };

      const normalizeType = (t) => {
        if (!t) return "kb";
        const v = String(t).toLowerCase();
        if (v === "say_this") return "say this";
        if (v === "ask_this") return "ask this";
        return v;
      };

      const cards = sourceCards.map((c) => ({
        id: Date.now() + Math.random(),
        type: normalizeType(c.type),
        title: c.title || "",
        content: c.content || "",
        priority: normalizePriority(c.priority),
        timestamp: new Date()
      }));

      setAiCards(cards);
      console.log("Set dynamic coaching cards (finalize):", cards);
    } catch (error) {
      console.error("Error fetching coaching cards (finalize):", error);
      setAiCards([]);
    }
  };

  // Poll latest cards from transcript chunk storage
  const fetchCardsFromChunk = async () => {
    try {
      if (!callId) return;

      const candidates = [
        `${ASSIST_BASE}/cards/${callId}`,
        `${ASSIST_BASE}/transcript-chunk/${callId}`,
        `${ASSIST_BASE}/coaching-cards/${callId}`
      ];

      let data = null;
      for (const url of candidates) {
        try {
          console.log("Polling cards from:", url);
          const resp = await fetch(url, { method: 'GET', headers: { 'accept': 'application/json' } });
          if (resp.ok) {
            data = await resp.json();
            break;
          }
        } catch (e) {
          // try next candidate
        }
      }

      if (!data) {
        console.log("No chunk endpoint responded OK.");
        return;
      }

      const sourceCards = Array.isArray(data) ? data : (data.coaching_cards || []);
      if (!Array.isArray(sourceCards) || sourceCards.length === 0) {
        console.log("Chunk polling returned no cards.");
        return;
      }

      const normalizePriority = (p) => {
        if (!p) return "normal";
        const v = String(p).toLowerCase();
        if (v === "urgent") return "high";
        if (["high","normal","low"].includes(v)) return v;
        return "normal";
      };

      const normalizeType = (t) => {
        if (!t) return "kb";
        const v = String(t).toLowerCase();
        if (v === "say_this") return "say this";
        if (v === "ask_this") return "ask this";
        return v;
      };

      const cards = sourceCards.map((c) => ({
        id: Date.now() + Math.random(),
        type: normalizeType(c.type),
        title: c.title || "",
        content: c.content || "",
        priority: normalizePriority(c.priority),
        timestamp: new Date()
      }));

      setAiCards(cards);
      console.log("Set dynamic coaching cards (chunk):", cards);
    } catch (err) {
      console.error("Chunk polling error:", err);
    }
  };


//  card_api comment card reopen then uncomment

//  useEffect(() => {
//    if (ENABLE_WS) {
//      connectWebSocket();
//    }
//
//    // Prefer chunk polling; fallback to finalize fetch once on mount
//    let pollTimer = null;
//    if (USE_CHUNK_POLL) {
//      // initial fetch
//      fetchCardsFromChunk();
//      pollTimer = setInterval(fetchCardsFromChunk, 3000);
//    } else {
//      fetchCoachingCards();
//    }
//
//    return () => {
//      if (pollTimer) clearInterval(pollTimer);
//      if (reconnectTimeoutRef.current) {
//        clearTimeout(reconnectTimeoutRef.current);
//      }
//      if (wsRef.current) {
//        try {
//          wsRef.current.close();
//        } catch {}
//      wsRef.current = null;
//      }
//    };
//    // eslint-disable-next-line react-hooks/exhaustive-deps
//  }, [callId]);




const handleSaveMechanism = () => {
  const formattedPhone = phone.length > 10 ? phone.slice(-10) : phone;

  api.post(`/call/alert_mechanisms/${companyId}/${formattedPhone}`, {})
    .then((res) => {
      console.log("Alert Saved:", res.data);
    })
    .catch((err) => {
      console.error("Error:", err);
    });
};


const handleSave = async () => {
  if (!selectedCallData?.Id) {
    alert("Please select an untagged call first");
    return;
  }
  try {
    const payload = {
      ...formData,
      Id: selectedCallData?.Id || null,
      Scenario: selectedScenarioLabel || null,
      Scenario1: selectedScenario1Label || null,
      Scenario2: selectedScenario2Label || null,
      Scenario3: selectedScenario3Label || null,
      Scenario4: selectedScenario4Label || null,

      // LeadId: lead_id || null,
      // AgentId: username || null,
      CallType: "Offline Tagging",
      // CallDate: new Date().toISOString().slice(0, 19).replace("T", " "),
      // MSISDN: phone.length > 10 ? phone.slice(-10) : phone,
      callcreated: "DialDesk - "+ username
    };

    await api.post(`/call/call_tag/${companyId}`, payload);
    handleSaveMechanism();
    alert("Data saved successfully!");

    // Reset form
    const resetData = {};
    fields.forEach((field) => {
      resetData[field.FieldName] = "";
    });
    setFormData(resetData);
    setSelectedScenarioLabel("");
    setSelectedScenario1Label("");
    setSelectedScenario2Label("");
    setSelectedScenario3Label("");
    setSelectedScenario4Label("");
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error saving data");
  }
};


    const getInitials = (name) => {
      if (!name) return "";
      const words = name.trim().split(" ");
      if (words.length === 1) return words[0][0].toUpperCase();
      return words[0][0].toUpperCase() + words[1][0].toUpperCase();
    };

  // Show only one AI Co-pilot card of type "ask this"
  const filteredAiCards = aiCards
    .filter((c) => String(c.type || "").toLowerCase() === "ask this")
    .slice(0, 1);

  // Remember last processed AI signature to avoid repeated auto-select
  const lastProcessedSignatureRef = useRef("");
  const wasAutoScenarioRef = useRef(false);

  // Build combined text from cards for detection/parsing (prefer ask_this, then others)
  const getCombinedCardText = () => {
    if (!Array.isArray(aiCards) || aiCards.length === 0) return "";
    const joinText = (c) => `${c.title || ""} ${c.content || ""}`.trim();
    const ask = aiCards.filter((c) => String(c.type || "").toLowerCase() === "ask this").map(joinText).join(". ");
    const rest = aiCards.filter((c) => String(c.type || "").toLowerCase() !== "ask this").map(joinText).join(". ");
    return `${ask} ${rest}`.trim();
  };

  // Helper: find option id whose name appears in text, with basic keyword support
  const findMatchingOptionId = (options, text) => {
    if (!Array.isArray(options) || !text) return null;
    const t = String(text).toLowerCase();
    // 1) Direct name match
    const byName = options.find((o) => t.includes(String(o.ecrName || "").toLowerCase()));
    if (byName) return byName.id;
    // 2) Common keyword aliases → try to map to option containing that alias
    const keywordAliases = [
      "complaint",
      "complain",
      "purchase",
      "buy",
      "sales",
      "billing",
      "payment",
      "refund",
      "technical",
      "support"
    ];
    const hit = keywordAliases.find((k) => t.includes(k));
    if (hit) {
      const byAlias = options.find((o) => String(o.ecrName || "").toLowerCase().includes(hit));
      if (byAlias) return byAlias.id;
    }
    return null;
  };

  // Prefer explicit keyword mapping (with word boundaries) for top-level Scenario
  const deriveScenarioIdFromText = (scenarioOptions, text) => {
    if (!Array.isArray(scenarioOptions) || !text) return null;
    const lowered = text.toLowerCase();

    const exists = (id) => scenarioOptions.some((o) => String(o.id) === String(id));

    // Priority order: Complaint > Enquiry > Request > Escalation
    const rules = [
      { id: "30349", patterns: [/\bcomplaint\b/, /\bcomplain\b/] },
      { id: "30347", patterns: [/\benquiry\b/, /\benquire\b/] },
      { id: "30348", patterns: [/\brequest\b/] },
      { id: "30372", patterns: [/\bescalation\b/, /\bescalate\b/] },
    ];

    for (const rule of rules) {
      if (!exists(rule.id)) continue;
      if (rule.patterns.some((re) => re.test(lowered))) return rule.id;
    }

    // Fallback: name contains match
    return findMatchingOptionId(scenarioOptions, text);
  };

  // Auto-select scenarios from AI card content/title
  useEffect(() => {
    const text = getCombinedCardText();
    if (!text) return;
    if (lastProcessedSignatureRef.current === text) return;

    // Level 1
    if (scenarioList.length > 0) {
      const desiredId = deriveScenarioIdFromText(scenarioList, text);
      if (desiredId && String(selectedScenario) !== String(desiredId)) {
        // Allow correction if either not set or previously auto-set
        if (!selectedScenario || wasAutoScenarioRef.current) {
          setSelectedScenario(desiredId);
          wasAutoScenarioRef.current = true;
          setScenario1List([]);
          setScenario2List([]);
          setScenario3List([]);
          setScenario4List([]);
          setSelectedScenario1("");
          setSelectedScenario2("");
          setSelectedScenario3("");
          setSelectedScenario4("");
          fetchChildren(2, desiredId, setScenario1List);
        }
      }
    }

    lastProcessedSignatureRef.current = text;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiCards, scenarioList]);

  // Level 2 auto-select based on same card text
  useEffect(() => {
    const text = getCombinedCardText();
    if (!text) return;
    if (!selectedScenario) return;
    if (selectedScenario1) return;
    if (scenario1List.length === 0) return;
    let id = findMatchingOptionId(scenario1List, text);
    // Fallback mapping by known Scenario → Scenario1 IDs
    if (!id) {
      const lowered = text.toLowerCase();
      const scenarioIdStr = String(selectedScenario);
      // Known top-level IDs
      const TOP = {
        complaint: "30349",
        enquiry: "30347",
        request: "30348",
      };
      const S1_MAP = {
        complaint: [
          { ids: ["30359"], kw: ["damaged", "broken", "defect", "defective"] },
          { ids: ["30361"], kw: ["delay", "late"] },
          { ids: ["30360"], kw: ["missing", "not received", "short"] },
          { ids: ["30362"], kw: ["money deducted", "amount deducted", "charged", "payment deducted", "order not placed"] },
          { ids: ["30363"], kw: ["cancel", "cancellation"] },
          { ids: ["30364"], kw: ["refund", "refund related"] },
          { ids: ["30365"], kw: ["return", "return issue"] },
          { ids: ["30367"], kw: ["other"] },
        ],
        enquiry: [
          { ids: ["30368"], kw: ["offer", "discount", "promo", "promotion"] },
          { ids: ["30353"], kw: ["office location", "office", "head office"] },
          { ids: ["30352"], kw: ["shop address", "store address", "shop", "store"] },
          { ids: ["30351"], kw: ["price", "cost", "rate", "budget"] },
          { ids: ["30350"], kw: ["product", "spec", "model"] },
          { ids: ["30354"], kw: ["other"] },
        ],
        request: [
          { ids: ["30356"], kw: ["dealership", "dealer"] },
          { ids: ["30357"], kw: ["distributor", "distributorship"] },
          { ids: ["30355"], kw: ["order request", "order"] },
          { ids: ["30358"], kw: ["product related request", "product request", "product"] },
          { ids: ["30366"], kw: ["other"] },
        ],
      };
      const ensureExists = (candidateId) =>
        scenario1List.some((o) => String(o.id) === String(candidateId));

      const tryMatch = (group) => {
        for (const rule of group) {
          if (rule.kw.some((k) => lowered.includes(k))) {
            const candidate = rule.ids.find((x) => ensureExists(x));
            if (candidate) return candidate;
          }
        }
        return null;
      };

      if (scenarioIdStr === TOP.complaint) {
        id = tryMatch(S1_MAP.complaint);
      } else if (scenarioIdStr === TOP.enquiry) {
        id = tryMatch(S1_MAP.enquiry);
      } else if (scenarioIdStr === TOP.request) {
        id = tryMatch(S1_MAP.request);
      }
    }
    if (id) {
      setSelectedScenario1(id);
      setScenario2List([]);
      setScenario3List([]);
      setScenario4List([]);
      setSelectedScenario2("");
      setSelectedScenario3("");
      setSelectedScenario4("");
      fetchChildren(3, id, setScenario2List);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario1List, selectedScenario, aiCards]);

  // Level 3 auto-select
  useEffect(() => {
    const text = getCombinedCardText();
    if (!text) return;
    if (!selectedScenario1) return;
    if (selectedScenario2) return;
    if (scenario2List.length === 0) return;
    const id = findMatchingOptionId(scenario2List, text);
    if (id) {
      setSelectedScenario2(id);
      setScenario3List([]);
      setScenario4List([]);
      setSelectedScenario3("");
      setSelectedScenario4("");
      fetchChildren(4, id, setScenario3List);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario2List, selectedScenario1, aiCards]);

  // Level 4 auto-select
  useEffect(() => {
    const text = getCombinedCardText();
    if (!text) return;
    if (!selectedScenario2) return;
    if (selectedScenario3) return;
    if (scenario3List.length === 0) return;
    const id = findMatchingOptionId(scenario3List, text);
    if (id) {
      setSelectedScenario3(id);
      setScenario4List([]);
      setSelectedScenario4("");
      fetchChildren(5, id, setScenario4List);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario3List, selectedScenario2, aiCards]);

  // Level 5 auto-select
  useEffect(() => {
    const text = getCombinedCardText();
    if (!text) return;
    if (!selectedScenario3) return;
    if (selectedScenario4) return;
    if (scenario4List.length === 0) return;
    const id = findMatchingOptionId(scenario4List, text);
    if (id) {
      setSelectedScenario4(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario4List, selectedScenario3, aiCards]);

  // ---------------- Auto-fill dynamic fields from AI card content ----------------
  const findFieldByNames = (names) => {
    if (!Array.isArray(fields) || fields.length === 0) return null;
    const lowerNames = names.map((n) => String(n).toLowerCase());
    // exact case-insensitive match first
    let match = fields.find((f) => lowerNames.includes(String(f.FieldName || "").toLowerCase()));
    if (match) return match.FieldName;
    // then contains
    match = fields.find((f) => {
      const fn = String(f.FieldName || "").toLowerCase();
      return lowerNames.some((n) => fn.includes(n));
    });
    return match ? match.FieldName : null;
  };

  const parseValuesFromText = (text) => {
    const result = {};
    const t = String(text || "");

    // Contact Number: prefer 10-digit Indian mobile
    const phoneMatch = t.match(/(?:\b|\D)([6-9]\d{9})(?:\b|\D)/);
    if (phoneMatch) result.contactNumber = phoneMatch[1];

    // Email
    const emailMatch = t.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    if (emailMatch) result.email = emailMatch[0];

    // Pin Code (India 6-digit, not starting with 0)
    const pinMatch = t.match(/(?:\b|\D)([1-9]\d{5})(?:\b|\D)/);
    if (pinMatch) result.pinCode = pinMatch[1];

    // Order No (loose alphanumeric token with letters+digits, length 6-20)
    const orderNoMatch = t.match(/\b([A-Z0-9][A-Z0-9\-]{4,18}[A-Z0-9])\b/i);
    if (orderNoMatch) result.orderNo = orderNoMatch[1];

    // Order Date (common formats: DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY)
    const dateMatch = t.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4}|\d{4}[\-]\d{2}[\-]\d{2})\b/);
    if (dateMatch) result.orderDate = dateMatch[1];

    // City and State via explicit labels if present
    const cityMatch = t.match(/city\s*[:\-]\s*([A-Za-z ]{2,50})/i);
    if (cityMatch) result.city = cityMatch[1].trim();
    const stateMatch = t.match(/state\s*[:\-]\s*([A-Za-z ]{2,50})/i);
    if (stateMatch) result.state = stateMatch[1].trim();

    // Name via explicit label
    const nameMatch = t.match(/name\s*[:\-]\s*([A-Za-z][A-Za-z .'\-]{1,60})/i);
    if (nameMatch) result.name = nameMatch[1].trim();
    // Name via acknowledgment phrase: "Thank you ..., Sachin Kumar."
    if (!result.name) {
      const tyMatch = t.match(/thank you[^,]*,\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/i);
      if (tyMatch) result.name = tyMatch[1].trim();
    }
    // Name via "my name is ..."
    if (!result.name) {
      const myNameMatch = t.match(/\bmy name is\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\b/i);
      if (myNameMatch) result.name = myNameMatch[1].trim();
    }

    return result;
  };

  const scenarioToQueryStatus = () => {
    const idStr = String(selectedScenario || "");
    if (idStr === "30349") return "Complaint";
    if (idStr === "30347") return "Enquiry";
    if (idStr === "30348") return "Request";
    return "";
  };

  useEffect(() => {
    const text = getCombinedCardText();
    if (!text) return;

    const parsed = parseValuesFromText(text);

    const updates = {};
    // Map parsed values to actual field names if present and empty
    const applyIfEmpty = (fieldKey, value) => {
      if (!fieldKey) return;
      if (!value) return;
      const current = formData[fieldKey];
      if (!current) updates[fieldKey] = value;
    };

    applyIfEmpty(findFieldByNames(["Contact Number", "Mobile", "Phone", "mobile number", "contact"]), parsed.contactNumber);
    applyIfEmpty(findFieldByNames(["Email", "email id", "mail", "e-mail"]), parsed.email);
    applyIfEmpty(findFieldByNames(["Pin Code", "pincode", "zip", "postal code"]), parsed.pinCode);
    applyIfEmpty(findFieldByNames(["Order No", "Order Number", "order#", "order id"]), parsed.orderNo);
    applyIfEmpty(findFieldByNames(["Order Date", "order date", "date"]), parsed.orderDate);
    applyIfEmpty(findFieldByNames(["City"]), parsed.city);
    applyIfEmpty(findFieldByNames(["State"]), parsed.state);
    applyIfEmpty(findFieldByNames(["Name", "Customer Name", "Full Name"]), parsed.name);

    // Remarks: summarize from card content if field exists
    const remarksKey = findFieldByNames(["Remarks", "Comment", "Notes"]);
    if (remarksKey && !formData[remarksKey]) {
      const snippet = text.toString().slice(0, 200);
      if (snippet) updates[remarksKey] = snippet;
    }

    // Query Status from selected Scenario if field exists
    const qs = scenarioToQueryStatus();
    if (qs) applyIfEmpty(findFieldByNames(["Query Status", "Status", "Type"]), qs);

    if (Object.keys(updates).length > 0) {
      setFormData((prev) => ({ ...prev, ...updates }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiCards, fields, selectedScenario]);
  return (
    <div className="dashboard_tagging">
      {/* Left Column */}
      <div className="column">
        {/* Agent Profile */}
        <div className="card_tagging">
          <div className="card-content center">
            <div className="avatar_tagging">{getInitials(displayname)}</div>
            <h4>{displayname}</h4>
            <p>Agent ID: {username}</p>
            <span className="badge success">Active</span>
          </div>
        </div>

        {/* Sidebar Menu */}
        <div className="card_tagging">
          <div className="card-content vertical">
            <button className="btn primary">Offline Call Tagging</button>
            <button className="btn outline" onClick={fetchCallHistory}>
              Call History
            </button>

            <button className="btn outline">Lead Generation</button>
            <button
              className="btn outline"
              onClick={fetchTrainingHub}
            >
              Training Docs
            </button>


            

          </div>
        </div>

        <div className="col-md-12 text-center">
                <label className="form-label fw-semibold">
                  Select Client
                </label>

                <select
                  className="form-select"
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                >
                  <option value="">-- Select Client --</option>

                  {clients.map((client) => (
                    <option
                      key={client.company_id}
                      value={String(client.company_id)}
                    >
                      {client.company_name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={callDate}
                  onChange={(e) => setCallDate(e.target.value)}
                  className="form-control mt-2"
                />
                <button
                  className="btn outline mt-2"
                  onClick={() => setShowUntaggedModal(true)}
                  disabled={!selectedClient}
                >
                  View Untagged Calls
                </button>
              </div>

        {showUntaggedModal && (
        <div className="modal-overlay">
          <div className="modal-xl">
            <div className="modal-header">
              <h3>Untagged Calls</h3>
              <button onClick={() => setShowUntaggedModal(false)}>Close</button>
            </div>

            <div className="modal-body">
              {untaggedCalls.length === 0 ? (
                <p>No untagged calls found</p>
              ) : (
                <table className="table table-bordered table-sm">
                  <thead>
                    <tr>
                      <th>Call ID</th>
                      <th>Lead ID</th>
                      <th>Phone</th>
                      <th>Date</th>
                      <th>Recording</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {untaggedCalls.map((call) => (
                      <tr key={call.Id}>
                        <td>{call.Id}</td>
                        <td>{call.LeadId}</td>
                        <td>{call.MSISDN}</td>
                        <td>
                          {new Date(call.CallDate).toLocaleString()}
                        </td>

                        <td>
                          <a
                            href={call.recording}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Play
                          </a>
                        </td>

                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              setSelectedCallId(call.Id);
                              setSelectedCallData(call);
                              setPhone(String(call.MSISDN || ""));

                              // close modal
                              setShowUntaggedModal(false);
                            }}
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

        {/* Analytics Row */}
        {/* <div className="card_tagging">
          <div className="card-content">
            <h4>Call Quality Analytics</h4>
            <p className="muted">
              Current call with Number Masking • Duration: 8:45
            </p>



            
            <div className="analytics-col">
              <div className="analytics-item">
                <p>
                  Clarity <b>95%</b>
                </p>
                <div className="progress">
                  <div style={{ width: "30%" }}></div>
                </div>
              </div>
              <div className="analytics-item">
                <p>
                  Engagement <b>88%</b>
                </p>
                <div className="progress">
                  <div style={{ width: "88%" }}></div>
                </div>
              </div>
              <div className="analytics-item">
                <p>
                  Professionalism <b>92%</b>
                </p>
                <div className="progress">
                  <div style={{ width: "92%" }}></div>
                </div>
              </div>
              <div className="overall-score">
                <span className="grade">A+</span>
                <span className="badge success">Overall Score</span>
              </div>
            </div>
          </div>
        </div> */}

        {/* Performance */}
        <div className="card_tagging">
          <div className="card-content">
            <h4>
              Performance On{" "}
              {new Date(callDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </h4>

            <p>
              Calls Handled: <b>{performance.total_calls}</b>
            </p>

            <p>
              Tagged Calls: <b>{performance.tagged_calls}</b>
            </p>

            <p>
              Not Tagged: <b>{performance.not_tagged_calls}</b>
            </p>

            <p>
              Success Rate:{" "}
              <b className="success-text">
                {performance.total_calls > 0
                  ? Math.round(
                      (performance.tagged_calls / performance.total_calls) * 100
                    )
                  : 0}
                %
              </b>
            </p>
          </div>
        </div>
      </div>

      {/* Middle Column */}
      <div className="column">
        {/* Call Analysis */}


        {/* Call Tags */}
        <div className="card card_tagging mt-4 shadow-sm">
          <div
            className="card-content p-3"
            style={{ height: "835px", overflowX: "auto" }}
          >
            <h5 className="mb-3">{authPerson}   {phone} Tags & Classification</h5>

            {/* Render Select Untagged Call  */}
            {selectedCallData && (
            <div
              style={{
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                background: "#f9f9f9"
              }}
            >
              <b>Selected Call:</b> {selectedCallData.LeadId} | {selectedCallData.MSISDN}

              <br />

              {/* <audio
                controls
                src={selectedCallData.recording}
                style={{ width: "100%", marginTop: "5px" }}
              /> */}
            </div>
          )}

            {selectedCallData && (
            <>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Call From
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>


            </div>



            <div className="row g-3">
              {/* Scenario Dropdowns */}
              <div style={customColStyle} className="col-md-6 col-sm-12">
                <label className="form-label">Select Scenario</label>
                <select
                  className="form-select"
                  value={selectedScenario}
                  onChange={handleScenarioChange}
                >
                  <option value="">Select Scenario</option>
                  {scenarioList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.ecrName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={customColStyle} className="col-md-6 col-sm-12">
                <label className="form-label">Select Scenario1</label>
                <select
                  className="form-select"
                  value={selectedScenario1}
                  onChange={handleScenario1Change}
                >
                  <option value="">Select Scenario1</option>
                  {scenario1List.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.ecrName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={customColStyle} className="col-md-6 col-sm-12">
                <label className="form-label">Select Scenario2</label>
                <select
                  className="form-select"
                  value={selectedScenario2}
                  onChange={handleScenario2Change}
                >
                  <option value="">Select Scenario2</option>
                  {scenario2List.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.ecrName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={customColStyle} className="col-md-6 col-sm-12">
                <label className="form-label">Select Scenario3</label>
                <select
                  className="form-select"
                  value={selectedScenario3}
                  onChange={handleScenario3Change}
                >
                  <option value="">All</option>
                  {scenario3List.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.ecrName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={customColStyle} className="col-md-6 col-sm-12">
                <label className="form-label">Select Scenario4</label>
                <select
                  className="form-select"
                  value={selectedScenario4}
                  onChange={handleScenario4Change}
                >
                  <option value="">All</option>
                  {scenario4List.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.ecrName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic fields */}
              {fields.length > 0 ? (
                fields.map((field, idx) => (
                  <div key={idx} className="col-md-6">
                    <label className="form-label fw-bold">
                      {field.FieldName}{" "}
                      {field.RequiredCheck === "1" && (
                        <span className="text-danger">*</span>
                      )}
                    </label>
                    {renderInput(field, idx)}
                  </div>
                ))
              ) : (
                <span className="text-muted">No fields available</span>
              )}

              <div className="col-12 mt-3 text-end">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: "auto", background: "#db2777" }}
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
            </>
            )}
          </div>
        </div>
      </div>


      {showHistory && (
  <div className="modal-overlay">
    <div className="modal-xl">
      <div className="modal-header">
        <h3>Call History</h3>
        <button onClick={() => setShowHistory(false)}>Close</button>
      </div>

      <div className="modal-body">
        {loading ? (
          <p>Loading...</p>
        ) : callHistory.length === 0 ? (
          <p>No records found</p>
        ) : (
          <table className="table table-bordered table-sm">
            <thead>
              <tr>
                {Object.keys(callHistory[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {callHistory.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, idx) => (
                    <td key={idx}>{val ?? "-"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </div>
)}

{showTrainingHub && (
  <div className="modal-overlay">
    <div className="modal-lg" style={{ borderRadius: "12px", overflow: "hidden" }}>

      {/* Header */}
      <div
        className="modal-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          background: "#f8f9fa",
          borderBottom: "1px solid #ddd",
          gap: "20px"
        }}
      >
        <h3 style={{ margin: 0 }}>Training Docs</h3>
        <button
          onClick={() => setShowTrainingHub(false)}
          style={{
            border: "none",
            background: "#e0e0e0",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Close
        </button>
      </div>

      {/* Body */}
      <div className="modal-body" style={{ padding: "10px 0", background: "#ffffff"  }}>
        {loading ? (
          <p style={{ padding: "20px" }}>Loading...</p>
        ) : trainingFiles.length === 0 ? (
          <p style={{ padding: "20px" }}>No files found</p>
        ) : (
          <div>
            {trainingFiles.map((file, index) => (
              <div
                key={index}
                onClick={() => window.open(file.file_url, "_blank")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 20px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  color: "white",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f5f7fa")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "white")
                }
              >
                {/* Index */}
                <div style={{ width: "30px", color: "#888" }}>
                  {index + 1}
                </div>

                {/* File Icon */}
                <div style={{ marginRight: "10px", fontSize: "18px" }}>
                  📄
                </div>

                {/* File Name */}
                <div
                  style={{
                    color: "#007bff",
                    textDecoration: "underline",
                    flex: 1,
                    wordBreak: "break-all"
                  }}
                >
                  {file.file_name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
)}


      {/* Right Column */}
      <div className="column">
        {/* AI Co-pilot */}
        {/*
        <div className="card_tagging">
          <div className="card-content" style={{ height: "630px"}}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h4>DialDesk Co-Pilot</h4>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: wsConnected ? "#27ae60" : "#e74c3c",
                    animation: wsConnected ? "none" : "pulse 2s infinite"
                  }}
                ></div>
                <span style={{ fontSize: "12px", color: wsConnected ? "#27ae60" : "#e74c3c" }}>
                  {wsConnected ? "Live" : "Dynamic"}
                </span>
                <button
                  onClick={fetchCoachingCards}
                  style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    backgroundColor: "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Refresh
                </button>
              </div>
            </div>
            <p className="muted">Live Suggestions ({filteredAiCards.length} card)</p>

            <div style={{ maxHeight: "520px", overflowY: "auto", paddingRight: "6px" }}>
              {filteredAiCards.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#666",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  border: "1px dashed #ddd"
                }}>
                  <p style={{ margin: 0, fontSize: "14px" }}>
                    {wsConnected ? "Waiting for coaching suggestions..." : "AI Co-pilot ready. Cards will appear when transcript data is received."}
                  </p>
                </div>
              ) : (
                filteredAiCards.map((card) => (
                  <div key={card.id} className="coaching-card" style={getCardStyle(card.type, card.priority)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{
                        fontSize: "12px",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        color: "#666",
                        letterSpacing: "0.5px"
                      }}>
                        {String(card.type || "note").replace("_", " ")}
                      </span>
                      <span style={{
                        fontSize: "11px",
                        background: card.priority === "high" ? "#e74c3c" : card.priority === "normal" ? "#3498db" : "#95a5a6",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "14px",
                        fontWeight: 500
                      }}>
                        {card.priority || "normal"}
                      </span>
                    </div>
                    <h6 style={{
                      margin: "0 0 8px 0",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#2c3e50"
                    }}>
                      {card.title}
                    </h6>
                    <p style={{
                      margin: "0 0 10px 0",
                      fontSize: "14px",
                      lineHeight: "1.55",
                      color: "#34495e"
                    }}>
                      {card.content}
                    </p>
                    <div style={{
                      textAlign: "right",
                      fontSize: "11px",
                      color: "#7f8c8d",
                      fontStyle: "italic"
                    }}>
                      {new Date(card.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        */}


{resolutionHtml && (
  <div
    style={{
      background: "#f9f9f9",
      border: "1px solid #dbe7ff",
      padding: "14px 18px",
      borderRadius: "8px",
      marginBottom: "12px",
      fontSize: "14px",
      color: "#333",
      maxHeight: "400px",
      width: "420px",
      overflowY: "auto",
      overflowX: "auto",

    }}
    dangerouslySetInnerHTML={{ __html: resolutionHtml }}
  />
)}


        {/* Body */}
<div style={{ maxHeight: "520px", overflowY: "auto" }}>
  {processUpdates.length === 0 ? (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        color: "#666",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        border: "1px dashed #ddd"
      }}
    >
      No process updates found
    </div>
  ) : (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "13px"
      }}
    >
      <thead>
        <tr style={{ background: "#f5f7fa" }}>
          <th style={thStyle}>Date</th>
          <th style={thStyle}>Client</th>
          <th style={thStyle}>Remarks</th>
          <th style={thStyle}>Type</th>
          <th style={thStyle}>Status</th>
        </tr>
      </thead>

      <tbody>
        {processUpdates.map((row) => (
          <tr key={row.id} style={{ borderBottom: "1px solid #eee" }}>
            <td style={tdStyle}>
              {new Date(row.date).toLocaleString()}
            </td>

            <td style={tdStyle}>
              {row.client}
            </td>

            <td style={{ ...tdStyle, maxWidth: "260px" }}>
              {row.remarks}
            </td>

            <td style={tdStyle}>
              {row.type}
            </td>

            <td style={tdStyle}>
              <span
                style={{ cursor: "pointer", color: "#007bff", textDecoration: "underline" }}
                onClick={() => handleReadClick(row.id)}
              >
                Read
              </span>
            </td>


          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

        {/* Customer Sentiment */}
        {/*
        <div className="card_tagging">
          <div className="card-content">
            <h4>Customer Sentiment</h4>
            <p>
              Overall Mood: <b className="success-text">Positive</b>
            </p>
            <p>
              Confidence Level: <b>78%</b>
            </p>
            <ul>
              <li>Interested in product</li>
              <li>Concerned about price</li>
              <li>Trusts recommendation</li>
            </ul>
          </div>
        </div>
        */}
      </div>

    </div>
  );
}
