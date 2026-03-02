import React, { useState } from "react";

const ManageTAT = () => {
  const [tatData, setTatData] = useState({
    Talked: { hours: "", type: "" },
    Callback: { hours: "", type: "" },
    Inbound: {
      CaseClosed: { hours: "", type: "" },
      Penalty: { hours: "", type: "" },
      PenaltyNC: { hours: "", type: "" },
      LanguageBarrier: { hours: "", type: "" },
    },
    CCO: {
      Callback: { hours: "", type: "" },
      IssueResolved: { hours: "", type: "" },
      NotResolved: { hours: "", type: "" },
      SparePartPending: { hours: "", type: "" },
      ReplacementPending: { hours: "", type: "" },
    },
  });

  const handleChange = (section, sub, field, value) => {
    if (sub) {
      setTatData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [sub]: { ...prev[section][sub], [field]: value },
        },
      }));
    } else {
      setTatData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", tatData);
  };

  return (
    <div className="row">
      <div className="col-12">
      <h4 className="mb-4 fw-bold">Manage TAT</h4>
      <div className="card shadow-sm">
        <div className="card-header fw-semibold">MANAGE TAT</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <ul className="list-unstyled">
              {/* Talked */}
              <li className="mb-3">
                <strong>— Talked</strong>
                <div className="d-flex align-items-center gap-3 mt-2">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    style={{ width: "80px" }}
                    value={tatData.Talked.hours}
                    onChange={(e) =>
                      handleChange("Talked", null, "hours", e.target.value)
                    }
                    placeholder="Hours"
                  />
                  {["Clock Hours", "Custom Hours"].map((opt) => (
                    <div key={opt} className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="TalkedType"
                        value={opt}
                        checked={tatData.Talked.type === opt}
                        onChange={(e) =>
                          handleChange("Talked", null, "type", e.target.value)
                        }
                      />
                      <label className="form-check-label">{opt}</label>
                    </div>
                  ))}
                </div>
              </li>

              {/* Callback */}
              <li className="mb-3">
                <strong>— Call Back</strong>
                <div className="d-flex align-items-center gap-3 mt-2">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    style={{ width: "80px" }}
                    value={tatData.Callback.hours}
                    onChange={(e) =>
                      handleChange("Callback", null, "hours", e.target.value)
                    }
                    placeholder="Hours"
                  />
                  {["Clock Hours", "Custom Hours"].map((opt) => (
                    <div key={opt} className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="CallbackType"
                        value={opt}
                        checked={tatData.Callback.type === opt}
                        onChange={(e) =>
                          handleChange("Callback", null, "type", e.target.value)
                        }
                      />
                      <label className="form-check-label">{opt}</label>
                    </div>
                  ))}
                </div>
              </li>

              {/* INBOUND */}
              <li className="mb-3">
                <strong>— INBOUND</strong>
                <ul className="ms-4 mt-2">
                  {Object.keys(tatData.Inbound).map((key) => (
                    <li key={key} className="mb-3">
                      <span className="fw-normal">— {key.replace(/([A-Z])/g, " $1")}</span>
                      <div className="d-flex align-items-center gap-3 mt-2">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          style={{ width: "80px" }}
                          value={tatData.Inbound[key].hours}
                          onChange={(e) =>
                            handleChange("Inbound", key, "hours", e.target.value)
                          }
                          placeholder="Hours"
                        />
                        {["Clock Hours", "Custom Hours"].map((opt) => (
                          <div key={opt} className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name={`${key}Type`}
                              value={opt}
                              checked={tatData.Inbound[key].type === opt}
                              onChange={(e) =>
                                handleChange("Inbound", key, "type", e.target.value)
                              }
                            />
                            <label className="form-check-label">{opt}</label>
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </li>

              {/* CCO */}
              <li className="mb-3">
                <strong>— CCO</strong>
                <ul className="ms-4 mt-2">
                  {Object.keys(tatData.CCO).map((key) => (
                    <li key={key} className="mb-3">
                      <span className="fw-normal">— {key.replace(/([A-Z])/g, " $1")}</span>
                      <div className="d-flex align-items-center gap-3 mt-2">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          style={{ width: "80px" }}
                          value={tatData.CCO[key].hours}
                          onChange={(e) =>
                            handleChange("CCO", key, "hours", e.target.value)
                          }
                          placeholder="Hours"
                        />
                        {["Clock Hours", "Custom Hours"].map((opt) => (
                          <div key={opt} className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name={`${key}Type`}
                              value={opt}
                              checked={tatData.CCO[key].type === opt}
                              onChange={(e) =>
                                handleChange("CCO", key, "type", e.target.value)
                              }
                            />
                            <label className="form-check-label">{opt}</label>
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>

            <button type="submit" className="btn btn-primary mt-3">
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ManageTAT;
