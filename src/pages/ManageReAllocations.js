import React, { useState } from "react";

const ManageInCallActions = () => {
  const [form, setForm] = useState({
    campaign: "",
    scenario: "",
    allocationType: "",
    allocation: "",
    agentType: "",
    agent: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", form);
  };

  return (
    <div className="row">
    <div className="col-12">
      <h4 className="mb-4">Manage Re Allocations</h4>

      <div className="card">
        <div className="card-header">MANAGE RE ALLOCATIONS</div>
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>

            {/* Scenario Inputs */}
            <div className="col-md-3">
              <label className="form-label">Select Campaign</label>
              <select
                name="campaign"
                className="form-select"
                value={form.campaign}
                onChange={handleChange}
              >
                <option value="">Select Campaign</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Select Scenario</label>
              <select
                name="scenario"
                className="form-select multiple"
                value={form.scenario}
                onChange={handleChange}
              >
                <option value="">Select Scenario</option>
                <option value="Scenario">Scenario</option>
                <option value="Sub Scenario 1">Sub Scenario 1</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Allocation Type</label>
              <select
                name="allocationType"
                className="form-select"
                value={form.allocationType}
                onChange={handleChange}
              >
                <option value="">Select Allocation Type</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Select Allocation</label>
              <select
                name="allocation"
                className="form-select"
                value={form.allocation}
                onChange={handleChange}
              >
                <option value="">Select Allocation</option>
              </select>
            </div>

            {/* Action Type & Label */}
            <div className="col-md-3">
              <label className="form-label">Agent Type</label>
              <select
                name="agentType"
                className="form-select"
                value={form.agentType}
                onChange={handleChange}
              >
                <option value="">Select Agent Type</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Select Agent</label>
               <select
                name="agent"
                className="form-select"
                value={form.agent}
                onChange={handleChange}
              >
                <option value="">Select Agent</option>
              </select>
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ManageInCallActions;
