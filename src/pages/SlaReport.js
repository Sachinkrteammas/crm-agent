import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const SLAReport = () => {
  const [form, setForm] = useState({
    selectClient: "",
    startDate: null,
    endDate: null,
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
        <h6 className="card-header">SLA REPORTS</h6>
        <div className="card-body">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <form className="row g-3" onSubmit={handleSubmit}>

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
              <label className="form-label d-block">Start Date</label>
              <DatePicker
                selected={form.startDate}
                onChange={(date) => setForm({ ...form, startDate: date })}
                className="form-control"
                placeholderText="Start Date"
                dateFormat="dd-MM-yyyy"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label d-block">End Date</label>
              <DatePicker
                selected={form.endDate}
                onChange={(date) => setForm({ ...form, endDate: date })}
                className="form-control"
                placeholderText="End Date"
                dateFormat="dd-MM-yyyy"
              />
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                EXPORT
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default SLAReport;
