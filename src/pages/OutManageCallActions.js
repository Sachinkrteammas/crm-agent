import React, { useState } from "react";

const OutManageCallActions = () => {
  const [form, setForm] = useState({
    orderBy: false,
    scenario1: "",
    scenario2: "",
    scenario3: "",
    scenario4: "",
    actionType: "",
    actionLabel: "",
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
      <div className="mb-4">
          <h4>Manage Out Call Actions</h4>
          <select className="form-select w-auto">
            <option value="">Select Campaign</option>
          </select>
       </div>

      <div className="card">
        <div className="card-header">MANAGE OUT CALL ACTIONS</div>
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>

            {/* Scenario Inputs */}
            <div className="col-md-3">
              <label className="form-label">Select Scenario 1</label>
              <select
                name="scenario1"
                className="form-select"
                value={form.scenario1}
                onChange={handleChange}
              >
                <option value="">Select Scenario</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Select Scenario 2</label>
              <select
                name="scenario2"
                className="form-select"
                value={form.scenario2}
                onChange={handleChange}
              >
                <option value="">Select Scenario 2</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Select Scenario 3</label>
              <select
                name="scenario3"
                className="form-select"
                value={form.scenario3}
                onChange={handleChange}
              >
                <option value="">Select Scenario 3</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Select Scenario 4</label>
              <select
                name="scenario4"
                className="form-select"
                value={form.scenario4}
                onChange={handleChange}
              >
                <option value="">Select Scenario 4</option>
              </select>
            </div>

            {/* Action Type & Label */}
            <div className="col-md-3">
              <label className="form-label">Select Action Type</label>
              <select
                name="actionType"
                className="form-select"
                value={form.actionType}
                onChange={handleChange}
              >
                <option value="">Select Action Type</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Select Action Label</label>
               <select
                name="actionLabel"
                className="form-select"
                value={form.actionLabel}
                onChange={handleChange}
              >
                <option value="">Select Action Label</option>
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

export default OutManageCallActions;
