import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const ReAllocatePlan = () => {
  const [form, setForm] = useState({
    selectPlan: "",
    selectClient: "",
    startDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form); // TODO: Hook up API call here
  };

  return (
    <div className="row">
    <div className="col-12">

      {/* Form Card */}
      <div className="card mb-4">
        <h6 className="card-header">RE-ALLOCATE PLAN</h6>
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-4">
              <label className="form-label">Plan</label>
              <select
                name="selectPlan"
                className="form-select"
                value={form.selectPlan}
                onChange={handleChange}
              >
                <option>Select Plan</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Client</label>
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
              <label className="form-label">Start Date</label>
              <div className="w-100">
              <DatePicker
                selected={form.startDate}
                onChange={(date) => setForm({ ...form, startDate: date })}
                className="form-control w-100"
                placeholderText="Plan Start Date"
                dateFormat="dd-MM-yyyy"
              />
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

export default ReAllocatePlan;
