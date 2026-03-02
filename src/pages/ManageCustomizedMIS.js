import { useState } from "react";

const ManageCustomizedMIS = () => {
    const [form, setForm] = useState({
      sheetName: "",
      sheetIndex: 0,
      selectedHeaders: [],
      headerIndexes: {},
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
      const { value, checked } = e.target;
      setForm((prev) => ({
        ...prev,
        selectedHeaders: checked
          ? [...(prev.selectedHeaders || []), value]
          : prev.selectedHeaders.filter((item) => item !== value),
      }));
    };

    const handleHeaderIndexChange = (header, value) => {
      setForm((prev) => ({
        ...prev,
        headerIndexes: { ...prev.headerIndexes, [header]: value },
      }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
    };


  return (
    <div className="row">
      <div className="col-12">
        <div className="mb-3">
          <h4>Manage Customized MIS</h4>
        </div>

        <div className="card mb-4">
          <h6 className="card-header">MANAGE CUSTOMIZED MIS</h6>
          <div className="card-body">
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-4">
                <label className="form-label">Select Sheet Name</label>
                <select
                name="sheetName"
                className="form-select"
                value={form.sheetName}
                onChange={handleChange}
              >
                <option value="">Select Sheet Name</option>
              </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">Sheet Index</label>
                <input
                  type="number"
                  name="sheetIndex"
                  className="form-control"
                  value={form.sheetIndex}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Select Header</label>
                <div
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "10px",
                    maxHeight: "300px",
                    overflowY: "scroll",
                  }}
                >
                  {[
                    "SrNo",
                    "MSISDN",
                    "CallDate",
                    "Scenario1",
                    "Scenario2",
                    "Customer VOC",
                    "Deviations",
                    "Final Closure",
                    "Final Remarks",
                    "Campaign",
                    "Complaint Number",
                    "Close Action Type",
                    "CloseLoopCate1",
                    "CloseLoopCate2",
                    "CloseLoopingDate",
                    "FollowupDate",
                    "closelooping_remarks",
                    "CloseLoopStatus",
                  ].map((header, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <input
                        type="checkbox"
                        name="selectedHeaders"
                        value={header}
                        checked={form.selectedHeaders?.includes(header)}
                        onChange={handleCheckboxChange}
                        className="form-check-input me-2"
                      />
                      <input
                        type="text"
                        value={form.headerIndexes?.[header] || "0"}
                        name={`index-${header}`}
                        onChange={(e) => handleHeaderIndexChange(header, e.target.value)}
                        className="form-control me-2"
                        style={{ width: "50px" }}
                      />
                      <input
                        type="text"
                        value={header}
                        readOnly
                        className="form-control"
                        style={{ width: "200px" }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-12 mt-3">
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

export default ManageCustomizedMIS;
