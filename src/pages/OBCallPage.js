import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/TaggingHistorySearchTabs.css";
import api from "../api";

export default function OBCallPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const urlClientId = searchParams.get("client_id");
  // Campaign may arrive as `campaignId` or `campaign` in the URL
  const urlCampaignId = searchParams.get("campaignId") || searchParams.get("campaign");
  const urlPhone = searchParams.get("phone_number");
  const urlSourceId = searchParams.get("source_id");

  // Dialed via URL (phone_number/source_id) — client, campaign and allocation
  // are resolved from the record itself, so the selectors must stay locked.
  const isUrlDriven = !!(urlPhone || urlSourceId);

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(() => {
    const stored = localStorage.getItem("company_id");
    return stored && stored !== "null" && stored !== "undefined" ? stored : "";
  });

  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");

  const [allocations, setAllocations] = useState([]);
  const [selectedAllocation, setSelectedAllocation] = useState("");

  const [dataRows, setDataRows] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});

  const [msisdn, setMsisdn] = useState("");

  const [targetDataId, setTargetDataId] = useState(null);
  const phoneResolved = useRef(false);
  const allocationKeyRef = useRef("");

  // Scenario cascade (Label 1 → 5)
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

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/agents/agent-clients-rights", {
        params: { agent_id: localStorage.getItem("id") },
      })
      .then((res) => {
        const list = (res.data || []).slice().sort((a, b) =>
          String(a.company_name || "").localeCompare(
            String(b.company_name || ""),
            "en",
            { sensitivity: "base" }
          )
        );
        setClients(list);
        if (urlClientId) {
          const match = list.find(
            (c) => String(c.company_id) === String(urlClientId)
          );
          if (match) {
            setSelectedClient(String(match.company_id));
            localStorage.setItem("company_id", String(match.company_id));
          }
        }
      })
      .catch((err) => console.error("Error fetching companies:", err));
  }, []);

  useEffect(() => {
    if (!selectedClient) {
      setCampaigns([]);
      setSelectedCampaign("");
      setAllocations([]);
      setSelectedAllocation("");
      resetDataRow();
      return;
    }
    api
      .get("/ob_tags/campaigns", { params: { CLIENT_ID: selectedClient } })
      .then((res) => {
        const list = res.data || [];
        setCampaigns(list);
        if (urlCampaignId) {
          const val = String(urlCampaignId).toLowerCase();
          const match = list.find(
            (c) =>
              String(c.campaign_id || "").toLowerCase() === val ||
              String(c.CampaignName || "").toLowerCase() === val ||
              String(c.Type || "").toLowerCase() === val
          );
          if (match) {
            // Keep any allocation/record already resolved for this campaign
            setSelectedCampaign(String(match.id));
            return;
          }
        }
        setSelectedCampaign("");
        setAllocations([]);
        setSelectedAllocation("");
        resetDataRow();
      })
      .catch((err) => {
        console.error("Error fetching campaigns:", err);
        setCampaigns([]);
      });
  }, [selectedClient]);

  useEffect(() => {
    if (!selectedClient || !selectedCampaign) {
      setAllocations([]);
      setSelectedAllocation("");
      allocationKeyRef.current = "";
      resetDataRow();
      return;
    }
    const allocationKey = `${selectedClient}:${selectedCampaign}`;

    api
      .get("/ob_tags/allocations", {
        params: { CLIENT_ID: selectedClient, campaign: selectedCampaign },
      })
      .then((res) => {
        setAllocations(res.data || []);
        // URL-driven: allocation comes from find_by_phone, never clear it
        if (isUrlDriven) return;
        // Already resolved from the URL for this client+campaign — keep it
        if (allocationKeyRef.current === allocationKey) return;
        allocationKeyRef.current = allocationKey;
        setSelectedAllocation("");
        resetDataRow();
      })
      .catch((err) => {
        console.error("Error fetching allocations:", err);
        setAllocations([]);
      });
  }, [selectedClient, selectedCampaign]);

  const claimData = (row) => {
    if (!row) return;
    api
      .post("/ob_tags/select_ob_campaign_data", {
        DataId: row.id,
        AgentId: localStorage.getItem("id"),
      })
      .catch((err) => console.error("Error claiming data:", err));
  };

  const fetchDataRows = () => {
    if (!selectedAllocation) {
      setDataRows([]);
      resetDataRow();
      return;
    }
    api
      .get("/ob_tags/ob_campaign_data", {
        params: {
          AllocationId: selectedAllocation,
          AgentId: localStorage.getItem("id"),
        },
      })
      .then((res) => {
        const rows = res.data || [];
        setDataRows(rows);
        if (rows.length === 0) {
          resetDataRow();
          return;
        }
        const row =
          rows.find((r) => String(r.id) === String(targetDataId)) ||
          rows.find(
            (r) => r.AgentId === null || r.AgentId === undefined
          ) ||
          rows[0];
        setSelectedData(row);
        claimData(row);
      })
      .catch((err) => {
        console.error("Error fetching campaign data:", err);
        setDataRows([]);
      });
  };

  // Resolve phone_number or source_id from URL to an allocation + record
  useEffect(() => {
    if (!(urlPhone || urlSourceId) || phoneResolved.current) return;

    // Campaign may arrive as an id or a CampaignName; backend resolves it
    const campaignRef = urlCampaignId || selectedCampaign;
    // source_id uniquely identifies the record — don't block the lookup on campaign
    if (!campaignRef && !urlSourceId) return;

    phoneResolved.current = true;
    api
      .get("/ob_tags/find_by_phone", {
        params: {
          ClientId: selectedClient || undefined,
          CampaignId: campaignRef || undefined,
          phone: urlPhone,
          source_id: urlSourceId,
          AgentId: localStorage.getItem("id"),
        },
      })
      .then((res) => {
        setTargetDataId(res.data.record ? res.data.record.id : null);
        if (res.data.AllocationId) {
          setSelectedAllocation(String(res.data.AllocationId));
          allocationKeyRef.current = `${res.data.ClientId || selectedClient}:${
            res.data.CampaignId
          }`;
        }
        // Resolve client + campaign together so the cascade effects don't clear the record
        if (res.data.CampaignId) {
          setSelectedCampaign(String(res.data.CampaignId));
        }
        if (!selectedClient && res.data.ClientId) {
          setSelectedClient(String(res.data.ClientId));
          localStorage.setItem("company_id", String(res.data.ClientId));
        }
      })
      .catch((err) => {
        console.error("Record not found:", err);
        setTargetDataId(null);
      });
  }, [selectedClient, selectedCampaign]);

  // Fetch data records once allocation is selected
  useEffect(() => {
    fetchDataRows();
  }, [selectedAllocation, targetDataId]);

  // Fetch dynamic fields + Level 1 scenarios once a data row is selected
  useEffect(() => {
    if (!selectedData) {
      setFields([]);
      setFormData({});
      resetScenarios();
      return;
    }
    fetchFields();
    fetchChildren(1, null, setScenarioList);
    setMsisdn(extractPhone(selectedData));
  }, [selectedData]);

  const resetDataRow = () => {
    setSelectedData(null);
    setDataRows([]);
    setFields([]);
    setFormData({});
    resetScenarios();
  };

  const resetScenarios = () => {
    setScenarioList([]);
    setScenario1List([]);
    setScenario2List([]);
    setScenario3List([]);
    setScenario4List([]);
    setSelectedScenario("");
    setSelectedScenario1("");
    setSelectedScenario2("");
    setSelectedScenario3("");
    setSelectedScenario4("");
    setSelectedScenarioLabel("");
    setSelectedScenario1Label("");
    setSelectedScenario2Label("");
    setSelectedScenario3Label("");
    setSelectedScenario4Label("");
  };

  const fetchFields = async () => {
    try {
      const res = await api.get("/ob_tags/obfield_master", {
        params: {
          ClientId: selectedClient,
          CampaignId: selectedCampaign,
        },
      });
      setFields(res.data || []);
      const initialData = {};
      (res.data || []).forEach((field) => {
        initialData[field.FieldName] = "";
      });
      setFormData(initialData);
    } catch (err) {
      console.error("Error fetching fields:", err);
      setFields([]);
    }
  };

  const fetchChildren = async (label, parentId, setter) => {
    try {
      const params = {
        Client: selectedClient,
        CampaignId: selectedCampaign,
      };
      if (parentId) params.parent_id = parentId;
      const res = await api.get(`/ob_tags/label${label}`, { params });
      setter(res.data || []);
    } catch (err) {
      console.error(`Error fetching label${label}:`, err);
      setter([]);
    }
  };

  const extractPhone = (row) => {
    if (!row) return "";
    let v = String(row.Field1 || "").replace(/\D/g, "");
    if (v.length > 10) v = v.slice(-10);
    return v;
  };

  const dataRowLabel = (row) => {
    const phone = extractPhone(row);
    const name = [3, 4, 5, 6]
      .map((n) => (row[`Field${n}`] ? String(row[`Field${n}`]).slice(0, 20) : ""))
      .find((v) => v && !/^\d+$/.test(v));
    return `#${row.id}${phone ? " - " + phone : ""}${name ? " - " + name : ""}`;
  };

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return words[0][0].toUpperCase() + words[1][0].toUpperCase();
  };

  const displayname = localStorage.getItem("displayname");
  const username = localStorage.getItem("username");

  const handleClientSelect = (e) => {
    const value = e.target.value;
    setSelectedClient(value);
    localStorage.setItem("company_id", value);
  };

  // Scenario dropdown handlers
  const changeScenario = (label, value, text) => {
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

  const changeScenario1 = (label, value, text) => {
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

  const changeScenario2 = (label, value, text) => {
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

  const changeScenario3 = (label, value, text) => {
    setSelectedScenario3(value);
    setSelectedScenario3Label(text);
    setScenario4List([]);
    setSelectedScenario4("");
    setSelectedScenario4Label("");
    if (value) fetchChildren(5, value, setScenario4List);
  };

  const changeScenario4 = (label, value, text) => {
    setSelectedScenario4(value);
    setSelectedScenario4Label(text);
  };

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const renderInput = (field) => {
    if (field.values && field.values.length > 0) {
      return (
        <select
          className="form-select"
          value={formData[field.FieldName] || ""}
          onChange={(e) => handleChange(field.FieldName, e.target.value)}
        >
          <option value="">Select {field.FieldName}</option>
          {field.values.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }
    const isDate = String(field.FieldName).toLowerCase().includes("date");
    return (
      <input
        type={isDate ? "date" : "text"}
        className="form-control"
        value={formData[field.FieldName] || ""}
        placeholder={`Enter ${field.FieldName}`}
        onChange={(e) => handleChange(field.FieldName, e.target.value)}
      />
    );
  };

  const handleSave = async () => {
    if (!selectedData) return;
    setSaving(true);
    try {
      const payload = {
        ...formData,
        TagType: urlPhone || urlSourceId ? "PD" : "Manual",
        AgentId: localStorage.getItem("id"),
        callcreated: "DialDesk - " + (localStorage.getItem("username") || ""),
        AllocationId: Number(selectedAllocation),
        DataId: selectedData.id,
        MSISDN: msisdn,
        Scenario: selectedScenarioLabel || "",
        SubScenario1: selectedScenario1Label || "",
        SubScenario2: selectedScenario2Label || "",
        SubScenario3: selectedScenario3Label || "",
        SubScenario4: selectedScenario4Label || "",
      };
      await api.post("/ob_tags/save-tagging", payload, {
        params: {
          ClientId: selectedClient,
          CampaignId: selectedCampaign,
        },
      });
      alert("Tagging saved successfully!");
      if (urlPhone || urlSourceId) {
        setSelectedCampaign("");
        setAllocations([]);
        setSelectedAllocation("");
        resetDataRow();
        navigate("/ob_call");
      } else {
        fetchDataRows();
      }
    } catch (err) {
      console.error("Error saving tagging:", err);
      alert("Error saving tagging");
    } finally {
      setSaving(false);
    }
  };

  const selectedClientName =
    clients.find((c) => String(c.company_id) === String(selectedClient))
      ?.company_name || "";

  const selectedCampaignFields =
    campaigns.find((c) => String(c.id) === String(selectedCampaign))
      ?.Fields || [];

  const visibleAllocations = isUrlDriven
    ? allocations.filter((a) => String(a.id) === String(selectedAllocation))
    : allocations;

  const fieldLabel = (key) => {
    const m = key.match(/^Field(\d+)$/);
    if (m) {
      const idx = parseInt(m[1], 10) - 1;
      if (selectedCampaignFields[idx]) return selectedCampaignFields[idx];
    }
    return key;
  };

  const renderScenarioSelect = (id, label, value, list, onChange) => (
    <div className="col-md-6">
      <label className="form-label fw-bold">{label}</label>
      <select
        className="form-select"
        value={value}
        onChange={(e) =>
          onChange(e.target.options[e.target.selectedIndex].text, e.target.value)
        }
      >
        <option value="">Select {label}</option>
        {list.map((item) => (
          <option key={item.id} value={item.id}>
            {item.ecrName}
          </option>
        ))}
      </select>
    </div>
  );

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
            <button className="btn primary">OB Call</button>

            <button className="btn outline mt-1" onClick={() => navigate("/tagging")}>
              Tagging
            </button>

            <label className="form-label fw-bold mt-2">Select Client</label>
            <select
              className="form-select"
              value={selectedClient}
              onChange={handleClientSelect}
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.company_id} value={client.company_id}>
                  {client.company_name}
                </option>
              ))}
            </select>

            <label className="form-label fw-bold mt-2">Select Campaign</label>
            <select
              className="form-select"
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              disabled={!selectedClient}
            >
              <option value="">Select Campaign</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.CampaignName}
                </option>
              ))}
            </select>

            <label className="form-label fw-bold mt-2">Select Allocation</label>
            <select
              className="form-select"
              value={selectedAllocation}
              onChange={(e) => setSelectedAllocation(e.target.value)}
              disabled={!selectedCampaign || isUrlDriven}
            >
              <option value="">
                {isUrlDriven
                  ? "Allocation resolved from call"
                  : "Select Allocation"}
              </option>
              {visibleAllocations.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Middle Column */}
      <div className="column">
        <div className="card_tagging">
          <div className="card-content">
            <h5 className="mb-3">OB Call Tagging</h5>

            {/* Step 1: Pick data record to tag */}
            <div>
              <label className="form-label fw-bold">Select Data to Tag</label>
              <select
                className="form-select"
                value={selectedData ? selectedData.id : ""}
                onChange={(e) => {
                  const row = dataRows.find(
                    (r) => String(r.id) === String(e.target.value)
                  );
                  setSelectedData(row || null);
                  claimData(row);
                }}
                disabled={!selectedAllocation || isUrlDriven}
              >
                <option value="">
                  {selectedAllocation
                    ? "Select Data Record"
                    : "Select allocation first"}
                </option>
                {dataRows.map((row) => (
                  <option key={row.id} value={row.id}>
                    {dataRowLabel(row)}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Tagging form appears after data selection */}
            {selectedData && (
              <div className="mt-4">
                {/* Selected data details from ob_campaign_data */}
                <div
                  className="card mb-3"
                  style={{ background: "#fff8e1", border: "1px solid #e0e0e0" }}
                >
                  <h6 className="card-header">Selected Data Details</h6>
                  <div
                    style={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      padding: "10px",
                    }}
                  >
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                      <tbody>
                        {Object.entries(selectedData)
                          .filter(([, val]) => val !== null && val !== undefined && val !== "")
                          .map(([key, val]) => (
                            <tr key={key} style={{ borderBottom: "1px solid #eee" }}>
                              <td style={{ padding: "6px 8px", fontWeight: 600, color: "#555", whiteSpace: "nowrap" }}>
                                {fieldLabel(key)}
                              </td>
                              <td style={{ padding: "6px 8px", color: "#333", wordBreak: "break-word" }}>
                                {String(val)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="row g-3">
                  {renderScenarioSelect(
                    "Scenario",
                    "Select Scenario",
                    selectedScenario,
                    scenarioList,
                    (text, value) => changeScenario(0, value, text)
                  )}
                  {renderScenarioSelect(
                    "Scenario1",
                    "Select Scenario1",
                    selectedScenario1,
                    scenario1List,
                    (text, value) => changeScenario1(0, value, text)
                  )}
                  {renderScenarioSelect(
                    "Scenario2",
                    "Select Scenario2",
                    selectedScenario2,
                    scenario2List,
                    (text, value) => changeScenario2(0, value, text)
                  )}
                  {renderScenarioSelect(
                    "Scenario3",
                    "Select Scenario3",
                    selectedScenario3,
                    scenario3List,
                    (text, value) => changeScenario3(0, value, text)
                  )}
                  {renderScenarioSelect(
                    "Scenario4",
                    "Select Scenario4",
                    selectedScenario4,
                    scenario4List,
                    (text, value) => changeScenario4(0, value, text)
                  )}

                  {/* Dynamic fields */}
                  {fields.length > 0 ? (
                    fields.map((field, idx) => (
                      <div key={field.id || idx} className="col-md-6">
                        <label className="form-label fw-bold">
                          {field.FieldName}
                        </label>
                        {renderInput(field)}
                      </div>
                    ))
                  ) : (
                    <span className="text-muted">No fields available</span>
                  )}
                </div>

                <div className="col-12 mt-3 text-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: "auto", background: "#db2777" }}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Tagging"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="column"></div>
    </div>
  );
}