import { useState } from "react";

export default function PromptCreationForm() {
  const [form, setForm] = useState({
    complaintNumber: "",
    customerVOC: "",
    finalClosure: "",
    finalRemarks: "",
    deviations: "",
    campaign: "",
    promptText: "",
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
    <div className="row">
      <div className="col-12">
      <h4 className="mb-4">Prompt Creations</h4>

      <div className="accordion" id="promptAccordion">
        {/* PROMPT CREATIONS */}
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
              PROMPT CREATIONS
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#promptAccordion"
          >
            <div className="accordion-body">
              <form className="row g-3" onSubmit={handleSubmit}>
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
                    name="customerVOC"
                    className="form-control"
                    value={form.customerVOC}
                    onChange={handleChange}
                  />
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
                    <option value="Closed">Closed</option>
                    <option value="Pending">Pending</option>
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
                  <label className="form-label">Select Deviations</label>
                  <select
                    name="deviations"
                    className="form-select"
                    value={form.deviations}
                    onChange={handleChange}
                  >
                    <option value="">Select Deviations</option>
                    <option value="INBOUND">INBOUND</option>
                    <option value="CCO">CCO</option>
                  </select>
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
              </form>
            </div>
          </div>
        </div>

        {/* CREATE PROMPT */}
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
              CREATE PROMPT
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#promptAccordion"
          >
            <div className="accordion-body">
              <div className="mb-3">
                <label className="form-label">Prompt</label>
                <textarea
                  name="promptText"
                  className="form-control"
                  rows="10"
                  value={form.promptText}
                  onChange={handleChange}
                  placeholder="Enter prompt instructions here..."
                ></textarea>
              </div>
              <button className="btn btn-primary" onClick={handleSubmit}>
                ADD
              </button>
            </div>
          </div>
        </div>

        {/* CALL SCENARIO TREE */}
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
              CALL SCENARIO TREE
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#promptAccordion"
          >
            <div className="accordion-body">
              <ul>
                <li>Talked</li>
                <li>Call back</li>
                <li>
                  INBOUND
                  <ul>
                    <li>Case closed</li>
                    <li>Penalty</li>
                    <li>Penalty NC</li>
                    <li>Language Barrier</li>
                  </ul>
                </li>
                <li>
                  CCO
                  <ul>
                    <li>Call Back</li>
                    <li>Issue Resolved on Call</li>
                    <li>Issue will not Resolve</li>
                    <li>Spare part pending</li>
                    <li>Replacement pending</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
