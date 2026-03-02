import React, { useState } from 'react';
import '../styles/TaggingHistorySearchTabs.css';
import DatePicker from "react-datepicker";

export default function CreateManualCall() {
  const [form, setForm] = useState({
    callFrom: "",
    scenario: "",
    complaintNumber: "",
    customerVoc: "",
    deviations: "",
    finalClosure: "",
    finalRemarks: "",
    campaign: "",
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Prompt data submitted:", form);
  };

  return (

    <div className="card mb-5 shadow-sm">
      {/* ——— Tabs Header ——— */}
      <div className="card-header bg-light border-0 pb-0">
        <ul className="nav nav-tabs custom-tabs" role="tablist">
          {['Tagging','History','Search'].map((t, i) => (
            <li className="nav-item" key={t}>
              <button
                className={`nav-link ${i===0?'active':''}`}
                data-bs-toggle="tab"
                data-bs-target={`#pane-${t.toLowerCase()}`}
                type="button"
                role="tab"
                aria-selected={i===0}
              >
                {t}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ——— Tabs Content ——— */}
      <div className="card-body pt-4">
        <div className="tab-content">

          {/* — Tagging — */}
          <div className="tab-pane fade show active" id="pane-tagging" role="tabpanel">
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="mb-0">Tagging Form</h6>
              </div>
              <div className="card-body">
                <form className="row g-4" onSubmit={handleSubmit}>
                    <div className="col-md-3">
                      <label className="form-label">Call From</label>
                      <input
                        name="callFrom"
                        className="form-control"
                        value={form.callFrom}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Scenario</label>
                      <select
                        name="scenario"
                        className="form-select"
                        value={form.scenario}
                        onChange={handleChange}
                      >
                        <option value="">Select Scenario</option>
                        <option value="Closed">Closed</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Complaint Number</label>
                      <input
                        name="complaintNumber"
                        className="form-control"
                        value={form.complaintNumber}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Customer VOC</label>
                      <input
                        name="customerVoc"
                        className="form-control"
                        value={form.customerVoc}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Select Deviations</label>
                      <select
                        name="deviations"
                        className="form-select"
                        value={form.deviations}
                        onChange={handleChange}
                      >
                        <option value="">Select Deviations</option>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Select Final Closure</label>
                      <select
                        name="finalClosure"
                        className="form-select"
                        value={form.finalClosure}
                        onChange={handleChange}
                      >
                        <option value="">Select Final Closure</option>
                        <option value="Closure 1">Closure 1</option>
                        <option value="Closure 2">Closure 2</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Final Remarks</label>
                      <input
                        name="finalRemarks"
                        className="form-control"
                        value={form.finalRemarks}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Select Campaign</label>
                      <select
                        name="campaign"
                        className="form-select"
                        value={form.campaign}
                        onChange={handleChange}
                      >
                        <option value="">Select Campaign</option>
                        <option value="Campaign 1">Campaign 1</option>
                        <option value="Campaign 2">Campaign 2</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary">
                        SUBMIT
                      </button>
                    </div>
                </form>
              </div>
            </div>
          </div>

          {/* — History — */}
          <div className="tab-pane fade" id="pane-history" role="tabpanel">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">History Log</h6>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        {[
                          'In Call ID','Call From','Scenarios',
                          'Sub Scenario 1','Complaint Number','Customer VOC','Deviations','Final Closure','Final Remarks',
                          'Campaign','Call Action','Call Sub Action','Calling Date'
                        ].map(h=> <th key={h}>{h}</th> )}
                      </tr>
                    </thead>
                    <tbody>
                      {/* TODO: render your real data here */}
                      <tr>
                        <td colSpan="12" className="text-center">No data available in table</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* — Search — */}
          <div className="tab-pane fade" id="pane-search" role="tabpanel">
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="mb-0">Advanced Search</h6>
              </div>
              <div className="card-body">
                <div className="row g-4 align-items-end">
                    <div className="col-md-3">
                      <label className="form-label">IN CALL ID</label>
                      <input
                        name="inCallId"
                        className="form-control"
                        value={form.inCallId}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Call From</label>
                      <input
                        name="callFrom"
                        className="form-control"
                        value={form.callFrom}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label d-block">Call Date</label>
                      <DatePicker
                        selected={form.startDate}
                        onChange={(date) => setForm({ ...form, startDate: date })}
                        className="form-control"
                        placeholderText="Call Date"
                        dateFormat="dd-MM-yyyy"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Scenario</label>
                      <select
                        name="scenario"
                        className="form-select"
                        value={form.scenario}
                        onChange={handleChange}
                      >
                        <option value="">Select Scenario</option>
                        <option value="Closed">Closed</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Scenario 1</label>
                      <select
                        name="subScenario1"
                        className="form-select"
                        value={form.scenario}
                        onChange={handleChange}
                      >
                        <option value="">Select Scenarios 1</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Complaint Number</label>
                      <input
                        name="complaintNumber"
                        className="form-control"
                        value={form.complaintNumber}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Customer VOC</label>
                      <input
                        name="customerVoc"
                        className="form-control"
                        value={form.customerVoc}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Select Deviations</label>
                      <select
                        name="deviations"
                        className="form-select"
                        value={form.deviations}
                        onChange={handleChange}
                      >
                        <option value="">Select Deviations</option>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Select Final Closure</label>
                      <select
                        name="finalClosure"
                        className="form-select"
                        value={form.finalClosure}
                        onChange={handleChange}
                      >
                        <option value="">Select Final Closure</option>
                        <option value="Closure 1">Closure 1</option>
                        <option value="Closure 2">Closure 2</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Final Remarks</label>
                      <input
                        name="finalRemarks"
                        className="form-control"
                        value={form.finalRemarks}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Select Campaign</label>
                      <select
                        name="campaign"
                        className="form-select"
                        value={form.campaign}
                        onChange={handleChange}
                      >
                        <option value="">Select Campaign</option>
                        <option value="Campaign 1">Campaign 1</option>
                        <option value="Campaign 2">Campaign 2</option>
                      </select>
                    </div>
                  <div className="col-12">
                    <button className="btn btn-primary">Search</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">Search Results</h6>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        {[
                          'In Call ID','Call From',' Calling Date','Scenarios','Sub Scenarios 1','Complaint Number',
                          'Customer VOC','Deviations','Final Closure','Final Remarks','Campaign'
                        ].map(h=> <th key={h}>{h}</th> )}
                      </tr>
                    </thead>
                    <tbody>
                      {/* TODO: map your results */}
                      <tr>
                        <td colSpan="12" className="text-center">No data available in table</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
