import { useState } from "react";

const PdCallAllocation = () => {
  const [form, setForm] = useState({
    selectClient: "",
    selectCampaign: "",
    selectAllocation: "",
    count: "",
    allocated: "",
    assignAllocation: [],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
      const { value, checked } = e.target;
      let updatedAllocations = form.assignAllocation || [];

      if (checked) {
        updatedAllocations = [...updatedAllocations, value];
      } else {
        updatedAllocations = updatedAllocations.filter((item) => item !== value);
      }

      setForm((prevForm) => ({
        ...prevForm,
        assignAllocation: updatedAllocations,
      }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form); // TODO: Hook up API call here
  };

  return (
    <div className="row">
    <div className="col-12">
      <div className="mb-3">
        <h4>PD Call Allocation</h4>
      </div>

      {/* Form Card */}
      <div className="card mb-4">
        <h6 className="card-header">PD CALL ALLOCATION</h6>
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-4">
              <label className="form-label">Select Client</label>
              <select
                name="selectClient"
                className="form-select"
                value={form.selectClient}
                onChange={handleChange}
              >
                <option>Select Client</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Select Campaign</label>
              <select
                name="selectCampaign"
                className="form-select"
                value={form.selectCampaign}
                onChange={handleChange}
              >
                <option>Select Campaign</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Select Allocation</label>
              <select
                name="selectAllocation"
                className="form-select"
                value={form.selectAllocation}
                onChange={handleChange}
              >
                <option>Select Allocation</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Count</label>
              <input
                name="count"
                className="form-control"
                placeholder="Count"
                value={form.count}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Allocated</label>
              <input
                type="number"
                name="allocated"
                className="form-control"
                placeholder="Allow Only Number"
                value={form.allocated}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Assign Allocation</label>
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "10px",
                  height: "200px",
                  overflowY: "scroll",
                }}
              >
                {[
                  "4570", "noi133", "SCOM4", "NOI126", "noi147", "noi151", "noi152",
                  "noi020", "noi203", "noi094", "noi180", "noi0130", "NOI208", "NOI209",
                  "NOI210", "noi213", "NOI218", "noi215", "noi222", "NOI1771",
                ].map((item) => (
                  <div key={item} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="assignAllocation"
                      value={item}
                      checked={form.assignAllocation?.includes(item)}
                      onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label">{item}</label>
                  </div>
                ))}
              </div>
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

export default PdCallAllocation;
