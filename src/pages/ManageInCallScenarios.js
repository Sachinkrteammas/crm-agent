import React, { useState } from "react";

const ManageInCallScenarios = () => {
  const [scenarios, setScenarios] = useState([]);
  const [newScenario, setNewScenario] = useState("");

  const handleAddScenario = () => {
    if (newScenario.trim() !== "") {
      setScenarios([...scenarios, { name: newScenario, subScenarios: [] }]);
      setNewScenario("");
    }
  };

  return (
    <div className="row">
      {/* Left Section */}
      <div className="col-md-6">
          <h4 className="mb-4 fw-bold">Manage In Call Scenarios</h4>

          <div className="accordion shadow-sm" id="scenarioAccordion">
            {/* Create Scenarios */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseScenario"
                >
                  Create Scenarios
                </button>
              </h2>
              <div
                id="collapseScenario"
                className="accordion-collapse collapse show"
                data-bs-parent="#scenarioAccordion"
              >
                <div className="accordion-body">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Scenario"
                      value={newScenario}
                      onChange={(e) => setNewScenario(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleAddScenario}
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Sub Scenarios */}
            {[1, 2, 3, 4].map((level) => (
              <div className="accordion-item" key={level}>
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapseSub${level}`}
                  >
                    Create Sub Scenarios {level}
                  </button>
                </h2>
                <div
                  id={`collapseSub${level}`}
                  className="accordion-collapse collapse"
                  data-bs-parent="#scenarioAccordion"
                >
                  <div className="accordion-body">
                    <div className="mb-3">
                      <label className="form-label">Select Scenario</label>
                      <select className="form-select">
                        <option>Select Scenario</option>
                        {scenarios.map((s, i) => (
                          <option key={i}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    {[...Array(level)].map((_, i) => (
                      <div className="mb-2" key={i}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`${
                            i < level - 1 ? "Select" : "Add"
                          } Sub Scenario ${i + 1}`}
                        />
                      </div>
                    ))}
                    <button className="btn btn-primary">ADD</button>
                  </div>
                </div>
              </div>
            ))}

            {/* Export */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseExport"
                >
                  Export Scenarios
                </button>
              </h2>
              <div
                id="collapseExport"
                className="accordion-collapse collapse"
                data-bs-parent="#scenarioAccordion"
              >
                <div className="accordion-body text-center">
                  <button className="btn btn-success">EXPORT</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Right Section */}
      <div className="col-md-6">
          <h4 className="mb-4 fw-bold">Call Scenario Tree</h4>

          <div className="accordion shadow-sm" id="treeAccordion">
            {/* Talked */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTalked"
                >
                  Talked
                </button>
              </h2>
              <div
                id="collapseTalked"
                className="accordion-collapse collapse"
                data-bs-parent="#treeAccordion"
              >
                <div className="accordion-body">
                  <button className="btn btn-sm btn-outline-secondary me-2">✎ Edit</button>
                  <button className="btn btn-sm btn-outline-danger">🗑 Delete</button>
                </div>
              </div>
            </div>

            {/* Callback */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseCallback"
                >
                  Call Back
                </button>
              </h2>
              <div
                id="collapseCallback"
                className="accordion-collapse collapse"
                data-bs-parent="#treeAccordion"
              >
                <div className="accordion-body">
                  <button className="btn btn-sm btn-outline-secondary me-2">✎ Edit</button>
                  <button className="btn btn-sm btn-outline-danger">🗑 Delete</button>
                </div>
              </div>
            </div>

            {/* Inbound */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseInbound"
                >
                  Inbound
                </button>
              </h2>
              <div
                id="collapseInbound"
                className="accordion-collapse collapse"
                data-bs-parent="#treeAccordion"
              >
                <div className="accordion-body">
                  <ul className="list-group">
                    {["Case closed", "Penalty", "Penalty NC", "Language Barrier"].map(
                      (sub, idx) => (
                        <li
                          className="list-group-item d-flex justify-content-between align-items-center"
                          key={idx}
                        >
                          {sub}
                          <span>
                            <button className="btn btn-sm btn-outline-secondary me-2">
                              ✎
                            </button>
                            <button className="btn btn-sm btn-outline-danger">🗑</button>
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* CCO */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseCCO"
                >
                  CCO
                </button>
              </h2>
              <div
                id="collapseCCO"
                className="accordion-collapse collapse"
                data-bs-parent="#treeAccordion"
              >
                <div className="accordion-body">
                  <ul className="list-group">
                    {[
                      "Call Back",
                      "Issue Resolved on Call",
                      "Issue will not Resolve",
                      "Spare part pending",
                      "Replacement pending",
                    ].map((sub, idx) => (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        key={idx}
                      >
                        {sub}
                        <span>
                          <button className="btn btn-sm btn-outline-secondary me-2">
                            ✎
                          </button>
                          <button className="btn btn-sm btn-outline-danger">🗑</button>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ManageInCallScenarios;
