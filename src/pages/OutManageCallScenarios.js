import React, { useState } from "react";

const OutManageCallScenarios = () => {
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
          <h4 className="mb-4 fw-bold">Manage Out Call Scenarios</h4>

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
                    <div className="mb-3">
                      <label className="form-label">Select Campaign</label>
                      <select className="form-select">
                        <option>Select Campaign</option>
                      </select>
                    </div>
                    <div className="mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Scenario"
                      value={newScenario}
                      onChange={(e) => setNewScenario(e.target.value)}
                    />
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={handleAddScenario}
                    >
                      ADD
                    </button>
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
                      <label className="form-label">Select Campaign</label>
                      <select className="form-select">
                        <option>Select Campaign</option>
                        {scenarios.map((s, i) => (
                          <option key={i}>{s.name}</option>
                        ))}
                      </select>
                    </div>

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
          </div>
        </div>

      {/* Right Section */}
      <div className="col-md-6">
          <h4 className="mb-4 fw-bold">Out Call Scenario Tree</h4>

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
                Out Call Scenario Tree
                </button>
              </h2>
              <div
                id="collapseTalked"
                className="accordion-collapse collapse"
                data-bs-parent="#treeAccordion"
              >
                <div className="accordion-body">
                  <div className="mb-3">
                      <label className="form-label">Select Campaign</label>
                      <select className="form-select">
                        <option>Select Campaign</option>
                        {scenarios.map((s, i) => (
                          <option key={i}>{s.name}</option>
                        ))}
                      </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default OutManageCallScenarios;
