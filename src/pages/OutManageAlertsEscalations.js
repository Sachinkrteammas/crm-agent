import React from "react";

export default function OutManageAlertsEscalations() {
  return (
    <div className="row">
      <div className="col-12">
      <h3 className="mb-3">Manage Alerts & Escalations</h3>

      <div className="accordion" id="alertsAccordion">
        {/* Define Alerts */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              DEFINE ALERTS
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#alertsAccordion"
          >
            <div className="accordion-body">
              <form className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Campaign</label>
                  <select className="form-select">
                    <option>Select</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" placeholder="Person Name" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Designation</label>
                  <input type="text" className="form-control" placeholder="Designation" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Mobile No.</label>
                  <input type="text" className="form-control" placeholder="Mobile No." />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" placeholder="Email"></input>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Alert On</label>
                  <select className="form-select">
                    <option>Select</option>
                  </select>
                </div>
                <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                  <button type="button" className="btn btn-primary">ADD</button>
                  <button type="reset" className="btn btn-secondary">RESET</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Define SMS to Caller */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              DEFINE SMS TO CALLER
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#alertsAccordion"
          >
            <div className="accordion-body">
              <form className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Campaign</label>
                  <select className="form-select">
                    <option>Select</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Sender ID</label>
                  <input type="text" className="form-control" placeholder="Sender ID" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">SMS Text</label>
                  <textarea
                    className="form-control"
                    placeholder="Validated SMS Text Otherwise message will be failed"
                    rows="2"
                  ></textarea>
                </div>
                <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                  <button type="button" className="btn btn-primary">ADD</button>
                  <button type="reset" className="btn btn-secondary">RESET</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Define Internal Communications */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              DEFINE INTERNAL COMMUNICATIONS
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#alertsAccordion"
          >
            <div className="accordion-body">
              <form className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Alert Type</label>
                  <select className="form-select"><option>Select</option></select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Campaign</label>
                  <select className="form-select"><option>Select</option></select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Select Fields</label>
                  <select className="form-select" multiple>
                    <option>Customer VOC</option>
                    <option>Deviations</option>
                    <option>Final Closure</option>
                    <option>Final Remarks</option>
                    <option>Campaign</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Select Scenario</label>
                  <select className="form-select" multiple>
                    <option>Scenario</option>
                    <option>Sub Scenario 1</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">SMS Text</label>
                  <textarea
                    className="form-control"
                    placeholder="Validated SMS Text Otherwise message will be failed"
                    rows="2"
                  ></textarea>
                </div>
                <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                  <button type="button" className="btn btn-primary">ADD</button>
                  <button type="reset" className="btn btn-secondary">RESET</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Define Escalation Matrix */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingFour">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFour"
              aria-expanded="false"
              aria-controls="collapseFour"
            >
              DEFINE ESCALATION MATRIX
            </button>
          </h2>
          <div
            id="collapseFour"
            className="accordion-collapse collapse"
            aria-labelledby="headingFour"
            data-bs-parent="#alertsAccordion"
          >
            <div className="accordion-body">
              <form className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Alert Type</label>
                  <select className="form-select"><option>Select</option></select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Campaign</label>
                  <select className="form-select"><option>Select</option></select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">TAT</label>
                  <input type="text" className="form-control" placeholder="TAT" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Alert On</label>
                  <select className="form-select"><option>Select</option></select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" placeholder="Person Name" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Mobile No.</label>
                  <input type="text" className="form-control" placeholder="Mobile No." />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Designation</label>
                  <input type="text" className="form-control" placeholder="Designation" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" placeholder="Email" />
                </div>
                <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                  <button type="button" className="btn btn-primary">ADD</button>
                  <button type="reset" className="btn btn-secondary">RESET</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
