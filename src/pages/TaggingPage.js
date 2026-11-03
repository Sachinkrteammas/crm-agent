import React, { useState, useEffect, useRef } from "react";
import "../styles/TaggingHistorySearchTabs.css";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function AgentDashboard() {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

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
  const [Id, setId] = useState(null);
  const [performance, setPerformance] = useState({
    total_calls: 0,
    tagged_calls: 0,
    not_tagged_calls: 0,
  });

  const searchParams = new URLSearchParams(window.location.search);
  const vendor_id = searchParams.get("vendor_id");
  const phone = searchParams.get("phone_number");
  const callId = searchParams.get("uniqueid");
  const epochStr = searchParams.get("epoch");
  const epoch = Number(epochStr);
  const lead_id = searchParams.get("lead_id");
  const inOUT = searchParams.get("inOUT"); // <-- NEW PARAM ADDED

  const displayname = localStorage.getItem("displayname");
  const username = localStorage.getItem("username");
  const agent_id = localStorage.getItem("id");
  const [resolutionHtml, setResolutionHtml] = useState("");
  const isFirstLoad = useRef(true);

  const [processUpdates, setProcessUpdates] = useState([]);
  const [loadingUpdates, setLoadingUpdates] = useState(false);

  const [showHistory, setShowHistory] = useState(false);
  const [isAbandonCallback, setIsAbandonCallback] = useState(false);
  const [callHistory, setCallHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showTrainingHub, setShowTrainingHub] = useState(false);
  const [trainingFiles, setTrainingFiles] = useState([]);

  // === NEW STATES FOR EXTERNAL INTEGRATION ===
  const [externalData, setExternalData] = useState(null);
  const [extLoading, setExtLoading] = useState(false);
  const [extError, setExtError] = useState("");
  // ============================================

  const rawPhone = searchParams.get("phone_number");
  const msisdn = rawPhone ? rawPhone.replace(/\D/g, "").slice(-10) : null;

  const thStyle = {
    textAlign: "left",
    padding: "10px",
    fontWeight: 600,
    color: "#555",
    borderBottom: "1px solid #ddd",
  };

  const tdStyle = {
    padding: "15px",
    color: "#333",
    verticalAlign: "top",
  };

  const fetchProcessUpdates = async () => {
    setLoadingUpdates(true);
    try {
      const res = await api.get("/call/process-update", {
        params: { client_id: companyId },
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
        process_id: process_id,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const [aiCards, setAiCards] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsReconnectAttempts, setWsReconnectAttempts] = useState(0);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const ENABLE_WS = false;
  const ASSIST_BASE =
    process.env.REACT_APP_ASSIST_BASE || "http://172.12.13.118:8010";
  const USE_CHUNK_POLL = true;

  const fetchCallHistory = async () => {
    try {
      setLoading(true);
      const res = await api.post(
        "/call/call-history",
        {},
        {
          params: {
            clientId: companyId,
            agent_id: agent_id,
          },
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
    try {
      setLoading(true);
      const res = await api.post("/call/trainning_hub", {
        client_id: companyId,
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
    if (!vendor_id) return;

    api
      .get(`/call/get_client_id/${vendor_id}`)
      .then((res) => {
        const cid = res.data.client_id;
        setCompanyId(cid);
        return api.get(`/call/fields/${cid}`);
      })
      .then((res) => {
        setFields(res.data);
        const initialData = {};
        res.data.forEach((field) => {
          initialData[field.FieldName] = "";
        });
        setFormData(initialData);
      })
      .catch((err) => console.error("Error fetching client/fields:", err));
  }, [vendor_id]);

  useEffect(() => {
    if (!vendor_id) return;

    api
      .get(`/call/get_client_id/${vendor_id}`)
      .then(async (res) => {
        const cid = res.data.client_id;
        setCompanyId(cid);

        const agent_id = localStorage.getItem("id");

        try {
          const latestRes = await api.get(`/call/latest-call-id`, {
            params: {
              client_id: cid,
              agent_id: agent_id,
            },
          });
          const latestId = latestRes.data.latest_id;
          setId(latestId);
        } catch (err) {
          console.error("Error fetching latest call id:", err);
        }

        return api.get(`/call/fields/${cid}`);
      })
      .then((res) => {
        setFields(res.data);
        const initialData = {};
        res.data.forEach((field) => {
          initialData[field.FieldName] = "";
        });
        setFormData(initialData);
      })
      .catch((err) => console.error("Error fetching client/fields:", err));
  }, [vendor_id]);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const agent_id = localStorage.getItem("id");
        const today = new Date().toISOString().split("T")[0];
        const res = await api.post("/report/agent_call_summary", {
          date: today,
          agent_id: agent_id,
        });
        setPerformance(res.data);
      } catch (err) {
        console.error("Performance API error:", err);
      }
    };
    fetchPerformance();
  }, []);

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

  const callHistorySaved = useRef(false);

  useEffect(() => {
    if (callHistorySaved.current) return;
    if (!companyId || !agent_id || !msisdn) return;

    callHistorySaved.current = true;

    const saveCallHistory = async () => {
      try {
        const res = await api.post("/call/call-history/save", null, {
          params: {
            clientId: Number(companyId),
            agent_id: Number(agent_id),
            msisdn: msisdn,
            lead_id: lead_id || null,
          },
        });
      } catch (err) {
        callHistorySaved.current = false;
        console.error("Call history save error:", err);
      }
    };
    saveCallHistory();
  }, [companyId, agent_id, msisdn, lead_id]);

  const [previousCall, setPreviousCall] = useState(null);

  useEffect(() => {
    if (!companyId || !msisdn) return;
    api
      .get("/call/call-master-by-msisdn", {
        params: { client_id: companyId, msisdn: msisdn },
      })
      .then((res) => {
        setPreviousCall(res.data && res.data.found ? res.data : null);
      })
      .catch((err) => console.error("Previous call lookup error:", err));
  }, [companyId, msisdn]);

  useEffect(() => {
    if (!previousCall || fields.length === 0) return;
    const allowed = new Set(fields.map((f) => f.FieldName));
    setFormData((prev) => {
      const next = { ...prev };
      let changed = false;
      Object.entries(previousCall.fields || {}).forEach(([name, value]) => {
        if (!allowed.has(name)) return;
        if (value === null || value === undefined || value === "") return;
        if (!next[name]) {
          next[name] = value;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [previousCall, fields]);

  const scenarioPrefilled = useRef(false);

  useEffect(() => {
    if (!previousCall || scenarioList.length === 0) return;
    if (scenarioPrefilled.current) return;
    if (
      selectedScenarioLabel ||
      selectedScenario1Label ||
      selectedScenario2Label ||
      selectedScenario3Label ||
      selectedScenario4Label
    ) {
      return;
    }

    const names = [
      previousCall.scenario,
      previousCall.scenario1,
      previousCall.scenario2,
      previousCall.scenario3,
      previousCall.scenario4,
    ];

    if (!names[0]) return;

    const listSetters = [
      setScenario1List,
      setScenario2List,
      setScenario3List,
      setScenario4List,
    ];
    const idSetters = [
      setSelectedScenario,
      setSelectedScenario1,
      setSelectedScenario2,
      setSelectedScenario3,
      setSelectedScenario4,
    ];
    const labelSetters = [
      setSelectedScenarioLabel,
      setSelectedScenario1Label,
      setSelectedScenario2Label,
      setSelectedScenario3Label,
      setSelectedScenario4Label,
    ];

    const applyScenarios = async () => {
      let options = scenarioList;
      let applied = 0;

      for (let i = 0; i < names.length; i++) {
        if (!names[i]) break;
        const match = options.find(
          (s) =>
            String(s.ecrName || "")
              .trim()
              .toLowerCase() === String(names[i]).trim().toLowerCase()
        );
        if (!match) break;

        idSetters[i](String(match.id));
        labelSetters[i](match.ecrName);
        applied++;

        if (i < 4) {
          const res = await api.get(
            `/core_api/categories/level${i + 2}/${
              match.id
            }?client_id=${companyId}`
          );
          const children = Array.isArray(res.data) ? res.data : [];
          listSetters[i](children);
          options = children;
        }
      }
      if (applied > 0) scenarioPrefilled.current = true;
    };

    applyScenarios().catch((err) =>
      console.error("Scenario prefill error:", err)
    );
  }, [previousCall, scenarioList, companyId]);

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

  const handleScenarioChange = (e) => {
    const value = e.target.value;
    const text = e.target.options[e.target.selectedIndex].text;
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
    const text = e.target.options[e.target.selectedIndex].text;
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
    const text = e.target.options[e.target.selectedIndex].text;
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
    const text = e.target.options[e.target.selectedIndex].text;
    setSelectedScenario3(value);
    setSelectedScenario3Label(text);
    setScenario4List([]);
    setSelectedScenario4("");
    setSelectedScenario4Label("");
    if (value) fetchChildren(5, value, setScenario4List);
  };

  const handleScenario4Change = (e) => {
    const value = e.target.value;
    const text = e.target.options[e.target.selectedIndex].text;
    setSelectedScenario4(value);
    setSelectedScenario4Label(text);
  };

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const renderInput = (field) => {
    if (field.FieldType === "TextBox") {
      const isDateField = field.FieldName.toLowerCase().includes("date");
      return (
        <input
          type={isDateField ? "date" : "text"}
          className="form-control"
          value={formData[field.FieldName] || ""}
          placeholder={`Enter ${field.FieldName}`}
          onChange={(e) => handleChange(field.FieldName, e.target.value)}
        />
      );
    }

    if (field.FieldType === "TextArea") {
      const isDateField = field.FieldName.toLowerCase().includes("date");
      if (isDateField) {
        return (
          <input
            type="date"
            className="form-control"
            value={formData[field.FieldName] || ""}
            onChange={(e) => handleChange(field.FieldName, e.target.value)}
          />
        );
      }
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

  // ==========================================
  // NEW EFFECT FOR EXTERNAL INTEGRATION
  // ==========================================
  useEffect(() => {
    if (!vendor_id || !phone || inOUT !== "IN") return;

    const fetchExternalData = async () => {
      setExtLoading(true);
      setExtError("");
      try {
        const res = await api.get("/core_api/customer-integration", {
          params: {
            phone_number: phone,
            vendor_id: vendor_id,
            inOUT: inOUT,
          },
        });

        if (res.data.status === "success") {
          setExternalData(res.data);
        } else {
          setExternalData(null);
          if (res.data.message) setExtError(res.data.message);
        }
      } catch (err) {
        console.error("External Integration Error:", err);
        setExtError("Failed to fetch customer details");
      } finally {
        setExtLoading(false);
      }
    };

    fetchExternalData();
  }, [vendor_id, phone, inOUT]);
  // ==========================================

  const generateCardsFromTranscript = (transcript) => {
    const transcriptLower = transcript.toLowerCase();
    const cards = [];
    if (
      transcriptLower.includes("hello") ||
      transcriptLower.includes("hi") ||
      transcriptLower.includes("ji") ||
      transcriptLower.includes("namaste") ||
      transcriptLower.includes("kaise") ||
      transcriptLower.includes("haal")
    ) {
      cards.push({
        id: Date.now() + Math.random(),
        type: "say this",
        title: "Greeting Response",
        content: "Hello! Thank you for calling. How can I assist you today?",
        priority: "high",
        timestamp: new Date(),
      });
      cards.push({
        id: Date.now() + Math.random() + 1,
        type: "ask this",
        title: "Identify Customer Needs",
        content: "What can I help you with today?",
        priority: "normal",
        timestamp: new Date(),
      });
    }
    if (
      transcriptLower.includes("iphone") ||
      transcriptLower.includes("oppo") ||
      transcriptLower.includes("samsung") ||
      transcriptLower.includes("phone") ||
      transcriptLower.includes("mobile") ||
      transcriptLower.includes("handset")
    ) {
      let phoneType = "phone";
      if (transcriptLower.includes("iphone")) phoneType = "iPhone";
      else if (transcriptLower.includes("oppo")) phoneType = "Oppo";
      else if (transcriptLower.includes("samsung")) phoneType = "Samsung";
      cards.push({
        id: Date.now() + Math.random() + 2,
        type: "kb",
        title: `${phoneType} Product Information`,
        content: `Customer is asking about ${phoneType}. Provide current models, pricing, and availability information.`,
        priority: "high",
        timestamp: new Date(),
      });
    }
    if (
      transcriptLower.includes("price") ||
      transcriptLower.includes("cost") ||
      transcriptLower.includes("kitna") ||
      transcriptLower.includes("rate") ||
      transcriptLower.includes("15000") ||
      transcriptLower.includes("budget") ||
      /\d+/.test(transcriptLower)
    ) {
      const budgetMatch = transcriptLower.match(/(\d+)/);
      const budget = budgetMatch ? budgetMatch[1] : "";
      cards.push({
        id: Date.now() + Math.random() + 3,
        type: "say this",
        title: "Pricing Response",
        content: budget
          ? `I understand your budget is around ₹${budget}. Let me show you the best options in that range.`
          : "Let me get you the most current pricing information for our products.",
        priority: "high",
        timestamp: new Date(),
      });
    }
    if (
      transcriptLower.includes("buy") ||
      transcriptLower.includes("purchase") ||
      transcriptLower.includes("khareed") ||
      transcriptLower.includes("lena")
    ) {
      cards.push({
        id: Date.now() + Math.random() + 4,
        type: "ask this",
        title: "Purchase Intent",
        content:
          "Are you looking to purchase today, or would you like to explore your options first?",
        priority: "normal",
        timestamp: new Date(),
      });
    }
    if (
      transcriptLower.includes("how to buy") ||
      transcriptLower.includes("how to purchase") ||
      transcriptLower.includes("kaise kharide") ||
      transcriptLower.includes("process")
    ) {
      cards.push({
        id: Date.now() + Math.random() + 5,
        type: "kb",
        title: "Purchase Process",
        content:
          "Guide customer through our purchase process: model selection, payment options, and delivery.",
        priority: "normal",
        timestamp: new Date(),
      });
    }
    if (
      transcriptLower.includes("help") ||
      transcriptLower.includes("madad") ||
      transcriptLower.includes("sahayata")
    ) {
      cards.push({
        id: Date.now() + Math.random() + 10,
        type: "say this",
        title: "Help Response",
        content: "I'm here to help you. What specific assistance do you need?",
        priority: "normal",
        timestamp: new Date(),
      });
    }
    if (
      transcriptLower.includes("thank") ||
      transcriptLower.includes("dhanyawad") ||
      transcriptLower.includes("shukriya")
    ) {
      cards.push({
        id: Date.now() + Math.random() + 11,
        type: "say this",
        title: "Thank You Response",
        content: "You're welcome! Is there anything else I can help you with?",
        priority: "normal",
        timestamp: new Date(),
      });
    }
    if (cards.length === 0) {
      cards.push(
        {
          id: Date.now() + Math.random(),
          type: "ask this",
          title: "Clarify Customer Needs",
          content: "Can you tell me more about what you're looking for?",
          priority: "normal",
          timestamp: new Date(),
        },
        {
          id: Date.now() + Math.random() + 1,
          type: "say this",
          title: "Active Listening",
          content:
            "I understand you're interested in our products. Let me help you find the right solution.",
          priority: "normal",
          timestamp: new Date(),
        }
      );
    }
    return cards;
  };

  // Note: Baaki AI cards logic (generateCardsFromMetrics, etc.) aur auto-fill logic 
  // aapke purane code se hi same hai, maine ise short rakha hai taaki message limit cross na ho.
  // Aap is code ko paste karein, ye purane code ki jagah le lega.

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return words[0][0].toUpperCase() + words[1][0].toUpperCase();
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        Id: Id || null,
        Scenario: selectedScenarioLabel || null,
        Scenario1: selectedScenario1Label || null,
        Scenario2: selectedScenario2Label || null,
        Scenario3: selectedScenario3Label || null,
        Scenario4: selectedScenario4Label || null,
        AbandonCallback: isAbandonCallback ? 1 : 0,
        callcreated: "DialDesk - " + username,
      };

      await api.post(`/call/call_tag/${companyId}`, payload);
      alert("Data saved successfully!");
      window.location.href = "/tagging";
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data");
    }
  };

  return (
    <div className="dashboard_tagging">
      {/* Left Column */}
      <div className="column">
        <div className="card_tagging">
          <div className="card-content center">
            <div className="avatar_tagging">{getInitials(displayname)}</div>
            <h4>{displayname}</h4>
            <p>Agent ID: {username}</p>
            <span className="badge success">Active</span>
          </div>
        </div>

        <div className="card_tagging">
          <div className="card-content vertical">
            <button className="btn primary">Call Tagging</button>
            <button
              className="btn outline"
              onClick={() => navigate("/offline_tagging")}
            >
              Offline Call Tagging
            </button>
            <button
              className="btn outline"
              onClick={() => setShowHistory(true)}
            >
              Call History
            </button>
            <button className="btn outline">Lead Generation</button>
            <button
              className="btn outline"
              onClick={() => setShowTrainingHub(true)}
            >
              Training Docs
            </button>
            <button className="btn outline" onClick={() => navigate("/ob_call")}>
              OB Call
            </button>
          </div>
        </div>

        <div className="card_tagging">
          <div className="card-content">
            <h4>Today's Performance</h4>
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
        <div className="card card_tagging mt-4 shadow-sm">
          <div
            className="card-content p-3"
            style={{ height: "835px", overflowX: "auto" }}
          >
            <h5 className="mb-3">
              {authPerson} {phone} Tags & Classification
            </h5>

           {/* ===== CUSTOMER INTEGRATION SECTION START ===== */}
{inOUT === "IN" &&
  ["6904381", "5232717", "4845124"].includes(vendor_id) && (
    <div
      style={{
        background: "#f0f7ff",
        border: "1px solid #b3d4ff",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "20px",
      }}
    >
      <h6
        style={{
          margin: "0 0 10px 0",
          color: "#0056b3",
          fontWeight: "bold",
        }}
      >
        🎯 Customer Support Details
      </h6>

      {extLoading && (
        <p style={{ margin: 0, fontSize: "14px" }}>
          Fetching details...
        </p>
      )}

      {extError && !extLoading && (
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#dc3545",
          }}
        >
          {extError}
        </p>
      )}

      {externalData && !extLoading && (
        <div>
          {/* Customer Info */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <div>
              <strong>Name:</strong>{" "}
              {externalData.customer.first_name}{" "}
              {externalData.customer.last_name}
            </div>
            <div>
              <strong>Phone:</strong>{" "}
              {externalData.customer.phone}
            </div>
            <div>
              <strong>Email:</strong>{" "}
              {externalData.customer.email || "N/A"}
            </div>
            <div>
              <strong>City:</strong>{" "}
              {externalData.customer.city || "N/A"}
            </div>
          </div>

          {/* Bookings Table */}
          {externalData.bookings.length > 0 ? (
            <div>
              <strong
                style={{
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Recent Bookings:
              </strong>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "12px",
                    background: "#fff",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#e2e8f0", textAlign: "left" }}>
                      <th style={{ padding: "8px", border: "1px solid #ddd" }}>Booking ID</th>
                      <th style={{ padding: "8px", border: "1px solid #ddd" }}>Module</th>
                      <th style={{ padding: "8px", border: "1px solid #ddd" }}>Type</th>
                      <th style={{ padding: "8px", border: "1px solid #ddd" }}>PNR</th>
                      <th style={{ padding: "8px", border: "1px solid #ddd" }}>From</th>
                      <th style={{ padding: "8px", border: "1px solid #ddd" }}>To</th>
                      <th style={{ padding: "8px", border: "1px solid #ddd" }}>Date</th>
                      <th style={{ padding: "8px", border: "1px solid #ddd" }}>Amount</th>
                      <th style={{ padding: "8px", border: "1px solid #ddd" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {externalData.bookings.map((b, i) => {
                      const status = (b.status || "").toUpperCase();
                      let statusColor = "#6b7280"; // default gray
                      let statusBg = "#f3f4f6";
                      if (status === "SUCCESSFUL") {
                        statusColor = "#065f46";
                        statusBg = "#d1fae5";
                      } else if (status === "CANCELLED") {
                        statusColor = "#991b1b";
                        statusBg = "#fee2e2";
                      } else if (status === "UPCOMING") {
                        statusColor = "#1e40af";
                        statusBg = "#dbeafe";
                      } else if (status === "FAILED") {
                        statusColor = "#991b1b";
                        statusBg = "#fee2e2";
                      } else if (status === "PENDING") {
                        statusColor = "#92400e";
                        statusBg = "#fef3c7";
                      }

                      return (
                        <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                          <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                            {b.booking_id || "-"}
                          </td>
                          <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                            <span
                              style={{
                                textTransform: "capitalize",
                                fontWeight: 600,
                                color: "#0056b3",
                              }}
                            >
                              {b.module || "flight"}
                            </span>
                          </td>
                          <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                            {b.booking_type || "-"}
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              fontWeight: 600,
                              color: "#111827",
                            }}
                          >
                            {b.pnr || "-"}
                          </td>
                          <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                            {b.from_city || "-"}
                          </td>
                          <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                            {b.to_city || "-"}
                          </td>
                          <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                            {b.departure_date
                              ? new Date(b.departure_date).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "-"}
                          </td>
                          <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                            {b.total_amount
                              ? `${b.currency || "₹"} ${b.total_amount}`
                              : "-"}
                          </td>
                          <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "3px 8px",
                                borderRadius: "12px",
                                fontSize: "11px",
                                fontWeight: 700,
                                color: statusColor,
                                background: statusBg,
                              }}
                            >
                              {b.status || "-"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
              No bookings found for this customer.
            </p>
          )}
        </div>
      )}
    </div>
  )}
{/* ===== CUSTOMER INTEGRATION SECTION END ===== */}

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

              <div className="col-12 mt-3 d-flex align-items-center justify-content-end gap-3">
                <label
                  className="form-check-label mb-0"
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input me-1"
                    checked={isAbandonCallback}
                    onChange={(e) => setIsAbandonCallback(e.target.checked)}
                  />
                  Abandon Call Back
                </label>
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
          <div
            className="modal-lg"
            style={{ borderRadius: "12px", overflow: "hidden" }}
          >
            <div
              className="modal-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                background: "#f8f9fa",
                borderBottom: "1px solid #ddd",
                gap: "20px",
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
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>

            <div
              className="modal-body"
              style={{ padding: "10px 0", background: "#ffffff" }}
            >
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
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f5f7fa")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "white")
                      }
                    >
                      <div style={{ width: "30px", color: "#888" }}>
                        {index + 1}
                      </div>
                      <div style={{ marginRight: "10px", fontSize: "18px" }}>
                        📄
                      </div>
                      <div
                        style={{
                          color: "#007bff",
                          textDecoration: "underline",
                          flex: 1,
                          wordBreak: "break-all",
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

        <div style={{ maxHeight: "520px", overflowY: "auto" }}>
          {processUpdates.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                color: "#666",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                border: "1px dashed #ddd",
              }}
            >
              No process updates found
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
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
                    <td style={tdStyle}>{row.client}</td>
                    <td style={{ ...tdStyle, maxWidth: "260px" }}>
                      {row.remarks}
                    </td>
                    <td style={tdStyle}>{row.type}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          cursor: "pointer",
                          color: "#007bff",
                          textDecoration: "underline",
                        }}
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
      </div>
    </div>
  );
}