import { useState, useEffect } from "react";
import api from "../api";

const CreateAgent = () => {
  const [clients, setClients] = useState([]);
  const [agents, setAgents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [viewingAgent, setViewingAgent] = useState(null);

  const [form, setForm] = useState({
    displayname: "",
    username: "",
    password: "",
    processname: "",
    workmode: "",
    dateOfBirth: "",
    dateofjoining: "",
    agentType: "",
    address: "",
    state: "",
    city: "",
    gender: "",
    versant: "",
    email: "",
    contactNo: "",
    languages: [],
    ClientRights: [],
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get("/agents/clients-rights"); // 👈 use api
        setClients(res.data);
      } catch (err) {
        console.error("Error fetching clients rights:", err);
      }
    };

    fetchClients();
  }, []);

  // fetch agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await api.get("/agents/list");
        setAgents(res.data);
      } catch (err) {
        console.error("Error fetching agents:", err);
      }
    };
    fetchAgents();
  }, []);


  const resetForm = () => {
    setForm({
      displayname: "",
      username: "",
      password: "",
      processname: "",
      workmode: "",
      dateOfBirth: "",
      dateofjoining: "",
      agentType: "",
      address: "",
      state: "",
      city: "",
      gender: "",
      versant: "",
      email: "",
      contactNo: "",
      languages: [],
      ClientRights: [],
    });
    setEditingAgent(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => {
      const languages = checked
        ? [...prev.languages, name]
        : prev.languages.filter((lang) => lang !== name);
      return { ...prev, languages };
    });
  };

  const handleClientRightsChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      const ClientRights = checked
        ? [...prev.ClientRights, value]
        : prev.ClientRights.filter((id) => id !== value);
      return { ...prev, ClientRights };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAgent) {
        await api.put(`/agents/${editingAgent.id}`, form);
        alert("Agent updated successfully!");
      } else {
        await api.post("/agents/save", form);
        alert("Agent created successfully!");
      }
      resetForm();
      setShowModal(false);
      const res = await api.get("/agents/list");
      setAgents(res.data);
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || "Failed to save agent"));
    }
  };


  const handleEdit = (agent) => {
    setForm({
      ...agent,
      languages: agent.languages?.split(",") || [],
      ClientRights: agent.ClientRights?.split(",") || [],
    });
    setEditingAgent(agent);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;
    try {
      await api.delete(`/agents/${id}`);
      setAgents((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to delete agent");
    }
  };

  return (
    <div className="row">
      <div className="col-12">

        {/* Form Card */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Agents</h3>
            <button
              className="btn btn-primary"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              + Add Agent
            </button>
          </div>

          {/* Agents Table */}
          <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
          <table className="table table-hover table-striped table-bordered align-middle shadow-sm">
            <thead className="table-dark sticky-top">
              <tr>
                <th>Display Name</th>
                <th>User ID</th>
                <th>Email</th>
                <th>Process</th>
                <th>Workmode</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id}>
                  <td>{agent.displayname}</td>
                  <td>{agent.username}</td>
                  <td>{agent.email}</td>
                  <td>{agent.processname}</td>
                  <td>{agent.workmode}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      onClick={() => setViewingAgent(agent)}
                    >
                      👁 View
                    </button>
                    <button
                      className="btn btn-sm btn-outline-warning me-2"
                      onClick={() => handleEdit(agent)}
                    >
                      ✏ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(agent.id)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
              {agents.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-3">
                    No agents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>

          {/* View Modal */}
          {viewingAgent && (
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog modal-xl">
              <div className="modal-content shadow-lg border-0">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">👤 Agent Details</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setViewingAgent(null)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="row g-4">
                    {/* Personal Info */}
                    <div className="col-md-12">
                      <div className="card shadow-sm border-0">
                        <div className="card-body">
                          <h6 className="text-primary mb-3">Personal Information</h6>
                          <div className="row g-3">
                            <div className="col-md-4"><strong>Name:</strong> {viewingAgent.displayname}</div>
                            <div className="col-md-4"><strong>User ID:</strong> {viewingAgent.username}</div>
                            <div className="col-md-4"><strong>Email:</strong> {viewingAgent.email}</div>
                            <div className="col-md-4"><strong>Contact:</strong> {viewingAgent.contactNo}</div>
                            <div className="col-md-4"><strong>Gender:</strong> {viewingAgent.gender}</div>
                            <div className="col-md-4"><strong>DOB:</strong> {viewingAgent.dateOfBirth}</div>
                            <div className="col-md-4"><strong>DOJ:</strong> {viewingAgent.dateofjoining}</div>
                            <div className="col-md-4"><strong>Agent Type:</strong> {viewingAgent.agentType}</div>
                            <div className="col-md-4"><strong>Versant:</strong> {viewingAgent.versant}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Work Info */}
                    <div className="col-md-12">
                      <div className="card shadow-sm border-0">
                        <div className="card-body">
                          <h6 className="text-primary mb-3">Work Information</h6>
                          <div className="row g-3">
                            <div className="col-md-4"><strong>Process:</strong> {viewingAgent.processname}</div>
                            <div className="col-md-4"><strong>Work Mode:</strong> {viewingAgent.workmode}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="col-md-12">
                      <div className="card shadow-sm border-0">
                        <div className="card-body">
                          <h6 className="text-primary mb-3">Address</h6>
                          <p className="mb-0">
                            {viewingAgent.address}, {viewingAgent.city}, {viewingAgent.state}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="col-md-12">
                      <div className="card shadow-sm border-0">
                        <div className="card-body">
                          <h6 className="text-primary mb-3">Languages Known</h6>
                          <p className="mb-0">
                            {Array.isArray(viewingAgent.languages)
                              ? viewingAgent.languages.join(", ")
                              : viewingAgent.languages}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Client Rights */}
                    <div className="col-md-12">
                      <div className="card shadow-sm border-0">
                        <div className="card-body">
                          <h6 className="text-primary mb-3">Client Rights</h6>
                          <p className="mb-0">
                            {(() => {
                              let rights = viewingAgent.ClientRights;

                              if (typeof rights === "string") {
                                rights = rights.split(",").map((r) => r.trim());
                              }
                              if (!Array.isArray(rights)) rights = [];

                              if (rights.length === 0) return "No Clients Assigned";

                              return rights
                                .map((id) => {
                                  const client = clients.find(
                                    (c) => c.company_id.toString() === id.toString()
                                  );
                                  return client ? client.company_name : `Unknown (${id})`;
                                })
                                .join(", ");
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        )}




          {/* Modal */}
          {showModal && (
            <div
              className="modal fade show"
              style={{ display: "block" }}
              tabIndex="-1"
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editingAgent ? "Edit Agent" : "Add Agent"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    {/* ✅ Reuse your form here */}
                    <form className="row g-3" onSubmit={handleSubmit}>
                      {/* Row 1 */}
                      <div className="col-md-4">
                        <label className="form-label">Agent Name *</label>
                        <input
                          name="displayname"
                          className="form-control"
                          placeholder="Agent Name"
                          value={form.displayname}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">User ID *</label>
                        <input
                          name="username"
                          className="form-control"
                          placeholder="User ID"
                          value={form.username}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Password *</label>
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          placeholder="Password"
                          value={form.password}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Row 2 */}
                      <div className="col-md-4">
                        <label className="form-label">Process Type *</label>
                        <select
                          name="processname"
                          className="form-control"
                          value={form.processname}
                          onChange={handleChange}
                        >
                          <option value="">Process Type</option>
                          <option value="C2P">C2P</option>
                          <option value="Dialdesk DSC">Dialdesk DSC</option>
                          <option value="IB Dedicated">IB Dedicated</option>
                          <option value="MAS/Others">MAS/Others</option>
                          <option value="OB Dedicated">OB Dedicated</option>
                          <option value="Others">Others</option>
                          <option value="Shared IB">Shared IB</option>
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Work Type *</label>
                        <select
                          name="workmode"
                          className="form-control"
                          value={form.workmode}
                          onChange={handleChange}
                        >
                          <option value="">Work Type</option>
                          <option value="Office">Office</option>
                          <option value="Work From Home">Work From Home</option>
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Date of Birth *</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          className="form-control"
                          value={form.dateOfBirth}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Row 3 */}
                      <div className="col-md-4">
                        <label className="form-label">Date of Joining *</label>
                        <input
                          type="date"
                          name="dateofjoining"
                          className="form-control"
                          value={form.dateofjoining}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Agent Type *</label>
                        <select
                          name="agentType"
                          className="form-control"
                          value={form.agentType}
                          onChange={handleChange}
                        >
                          <option value="">Agent Type</option>
                          <option value="Unit 1">Unit 1</option>
                          <option value="Unit 2">Unit 2</option>
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Enter Address *</label>
                        <input
                          name="address"
                          className="form-control"
                          placeholder="Address"
                          value={form.address}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Row 4 */}
                      <div className="col-md-4">
                      <label className="form-label">State *</label>
                      <select
                        name="state"
                        className="form-control"
                        value={form.state}
                        onChange={handleChange}
                      >
                        <option value="">Select State</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Dadra and Nagar Haveli and Daman and Diu">
                          Dadra and Nagar Haveli and Daman and Diu
                        </option>
                        <option value="Delhi">Delhi</option>
                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                        <option value="Ladakh">Ladakh</option>
                        <option value="Lakshadweep">Lakshadweep</option>
                        <option value="Puducherry">Puducherry</option>
                      </select>
                      </div>


                      <div className="col-md-4">
                        <label className="form-label">City *</label>
                        <input
                          name="city"
                          className="form-control"
                          placeholder="City"
                          value={form.city}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Gender *</label>
                        <select
                          name="gender"
                          className="form-control"
                          value={form.gender}
                          onChange={handleChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Row 5 */}
                      <div className="col-md-4">
                        <label className="form-label">Versant *</label>
                        <select
                          name="versant"
                          className="form-control"
                          value={form.versant}
                          onChange={handleChange}
                        >
                          <option value="">Versant</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Email"
                          value={form.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Contact No. *</label>
                        <input
                          type="tel"
                          name="contactNo"
                          className="form-control"
                          placeholder="Contact Number"
                          value={form.contactNo}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Languages */}
                      <div className="col-md-12">
                      <label className="form-label">Languages Known *</label>
                      <div className="d-flex gap-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="Avg English"
                            id="avgEnglish"
                            checked={form.languages.includes("Avg English")}
                            onChange={handleCheckboxChange}
                          />
                          <label className="form-check-label" htmlFor="avgEnglish">
                            Avg English
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="English"
                            id="english"
                            checked={form.languages.includes("English")}
                            onChange={handleCheckboxChange}
                          />
                          <label className="form-check-label" htmlFor="english">
                            English
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="Hindi"
                            id="hindi"
                            checked={form.languages.includes("Hindi")}
                            onChange={handleCheckboxChange}
                          />
                          <label className="form-check-label" htmlFor="hindi">
                            Hindi
                          </label>
                        </div>
                      </div>
                      </div>


                      {/* Clients Rights */}
                      <div className="col-md-12">
                      <label className="form-label">Clients Rights *</label>
                      <div
                        className="border p-2"
                        style={{ maxHeight: "200px", overflowY: "auto" }}
                      >
                        <div className="row">
                          {clients.map((client) => (
                            <div key={client.company_id} className="col-md-6">
                              <input
                                type="checkbox"
                                value={client.company_id}
                                checked={form.ClientRights.includes(client.company_id.toString())}
                                onChange={handleClientRightsChange}
                              />{" "}
                              {client.company_name}
                            </div>
                          ))}
                        </div>
                      </div>
                      </div>


                      {/* Submit */}
                      <div className="col-12">
                        <button type="submit" className="btn btn-primary">
                          {editingAgent ? "Update" : "Save"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal backdrop */}
          {showModal && <div className="modal-backdrop fade show"></div>}
          {viewingAgent && <div className="modal-backdrop fade show"></div>}
      </div>
    </div>
  );
};

export default CreateAgent;
