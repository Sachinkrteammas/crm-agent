import React, { useState } from "react";

const ManageInCallActionAlerts = () => {
  const [alertForm, setAlertForm] = useState({
    callActionType: "",
    callActionSubType: "",
    name: "",
    designation: "",
    mobile: "",
    email: "",
    alertOn: ""
  });

  const [smsForm, setSmsForm] = useState({
    callActionType: "",
    callActionSubType: "",
    senderId: "",
    smsText: ""
  });

  const handleAlertChange = (e) => {
    setAlertForm({ ...alertForm, [e.target.name]: e.target.value });
  };

  const handleSmsChange = (e) => {
    setSmsForm({ ...smsForm, [e.target.name]: e.target.value });
  };

  const handleAlertSubmit = (e) => {
    e.preventDefault();
    console.log("Alert form submitted:", alertForm);
  };

  const handleSmsSubmit = (e) => {
    e.preventDefault();
    console.log("SMS form submitted:", smsForm);
  };

  return (
    <div className="row">
    <div className="col-12">
      <h4 className="mb-4">Manage In Call Action Alerts</h4>

      <div className="accordion" id="alertAccordion">

        {/* DEFINE ALERTS Accordion */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingAlert">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseAlert"
              aria-expanded="true"
              aria-controls="collapseAlert"
            >
              DEFINE ALERTS
            </button>
          </h2>
          <div
            id="collapseAlert"
            className="accordion-collapse collapse show"
            aria-labelledby="headingAlert"
            data-bs-parent="#alertAccordion"
          >
            <div className="accordion-body">
              <form className="row g-3" onSubmit={handleAlertSubmit}>
                <div className="col-md-3">
                  <label className="form-label">Call Action Type</label>
                  <select
                    name="callActionType"
                    className="form-select"
                    value={alertForm.callActionType}
                    onChange={handleAlertChange}
                  >
                    <option value="">Call Action Type</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Call Action Sub Type</label>
                  <select
                    name="callActionSubType"
                    className="form-select"
                    value={alertForm.callActionSubType}
                    onChange={handleAlertChange}
                  >
                    <option value="">Call Action Sub Type</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={alertForm.name}
                    onChange={handleAlertChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    className="form-control"
                    value={alertForm.designation}
                    onChange={handleAlertChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Mobile No.</label>
                  <input
                    type="text"
                    name="mobile"
                    className="form-control"
                    value={alertForm.mobile}
                    onChange={handleAlertChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={alertForm.email}
                    onChange={handleAlertChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Alert On</label>
                  <select
                    name="alertOn"
                    className="form-select"
                    value={alertForm.alertOn}
                    onChange={handleAlertChange}
                  >
                    <option value="">Select</option>
                    <option value="SMS">SMS</option>
                    <option value="Email">Email</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                <div className="col-md-12 d-flex justify-content-end gap-2">
                  <button className="btn btn-primary" type="submit">ADD</button>
                  <button className="btn btn-secondary" type="reset">RESET</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* DEFINE SMS TO CALLER Accordion */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingSMS">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseSMS"
              aria-expanded="false"
              aria-controls="collapseSMS"
            >
              DEFINE SMS TO CALLER
            </button>
          </h2>
          <div
            id="collapseSMS"
            className="accordion-collapse collapse"
            aria-labelledby="headingSMS"
            data-bs-parent="#alertAccordion"
          >
            <div className="accordion-body">
              <form className="row g-3" onSubmit={handleSmsSubmit}>
                <div className="col-md-3">
                  <label className="form-label">Call Action Type</label>
                  <select
                    name="callActionType"
                    className="form-select"
                    value={smsForm.callActionType}
                    onChange={handleSmsChange}
                  >
                    <option value="">Call Action Type</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Call Action Sub Type</label>
                  <select
                    name="callActionSubType"
                    className="form-select"
                    value={smsForm.callActionSubType}
                    onChange={handleSmsChange}
                  >
                    <option value="">Call Action Sub Type</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Sender ID</label>
                  <input
                    type="text"
                    name="senderId"
                    className="form-control"
                    value={smsForm.senderId}
                    onChange={handleSmsChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">SMS Text</label>
                  <textarea
                    name="smsText"
                    rows="3"
                    className="form-control"
                    placeholder="Validated SMS Text Otherwise message will be failed"
                    value={smsForm.smsText}
                    onChange={handleSmsChange}
                  ></textarea>
                </div>

                <div className="col-md-12 d-flex justify-content-end gap-2">
                  <button className="btn btn-primary" type="submit">ADD</button>
                  <button className="btn btn-secondary" type="reset">RESET</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ManageInCallActionAlerts;
