import React, { useState } from "react";

const userRightsData = {
  "In Call Management": [
    "Manage IVR",
    "Manage In Call Scenarios",
    "Manage TAT",
    "Manage Required Fields",
    "Manage Alerts & Escalations",
    "Manage In Call Actions",
    "Upload Existing Customers",
    "Manage Training Docs",
    "Manage MIS & Reports",
    "Manage User Logins",
    "Manage Work Flow",
    "Manage In Call Actions Alert",
    "Manage Close Fields",
    "Transaction Manage Fields",
    "Manage Customized Report",
  ],
  "Out Call Management": [
    "Manage Campaigns",
    "Manage Allocations",
    "Manage Out Call Scenarios",
    "Manage Required Fields",
    "Manage Out Call Actions",
    "Manage Out Close Fields",
    "Manage Customized Report",
    "Manage Re Allocations",
  ],
  "In Call Operations": [
    "In Call Details",
    "Create Manual Call",
    "Update Ticket Status",
    "Search Recording",
  ],
  "Out Call Operations": [
    "Out Call Details",
    "Create Manual Call",
    "Out Call Attempt Wise",
  ],
  "MIS & Reports": [
    "Call MIS",
    "TAT MIS",
    "Tagging MIS",
    "Time Wise MIS",
    "Agent Wise MIS",
    "Abend Call MIS",
    "Answer Call MIS",
    "Call Scenarios Wise MIS",
    "Esclation Level MIS",
    "In Call Action MIS",
    "SLA Report Monthly",
    "SLA Report Hourly",
    "CDR Report",
    "OB CDR Report",
    "Customized In Call Report",
    "Customized Out Call Report",
    "Client Wise OB CDR Report",
    "Ivr Reports",
    "Lead Reports",
    "Export MIS Files",
  ],
  "Billing Statement": ["Statement"],
  "User Management": ["Manage User Logins", "Manage User Access"],
  "Social Media": ["Facebook Interactions", "Email Interactions", "Whatsapp Text"],
  "Help": [],
};

const ManageUserLogin = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    designation: "",
    rights: [],
  });

  const [search, setSearch] = useState("");
  const [data] = useState([{ name: "Abhishek Khanna", phone: "8700397513", email: "abhishek.khanna@teammas.in", designation: "Team leader" }]);

  const filteredData = data.filter(
    (d) => d.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      const rights = checked
        ? [...prev.rights, value]
        : prev.rights.filter((r) => r !== value);
      return { ...prev, rights };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
  <div className="row">
    <div className="col-12">
        <div className="mb-3">
            <h4>Manage User Logins</h4>
        </div>
      <div className="card mb-4">
        <h6 className="card-header">MANAGE USER LOGINS</h6>
      <div className="card-body">

      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <input type="text" name="name" className="form-control" placeholder="Name" value={form.name} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <input type="email" name="email" className="form-control" placeholder="Email Address" value={form.email} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <input type="password" name="password" className="form-control" placeholder="Password" value={form.password} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <input type="password" name="confirmPassword" className="form-control" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <input type="text" name="phone" className="form-control" placeholder="Phone No" value={form.phone} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <input type="text" name="designation" className="form-control" placeholder="Designation" value={form.designation} onChange={handleChange} />
        </div>

        <div className="col-12">
          <label>User Right</label>
          <div style={{ maxHeight: 250, overflowY: 'auto', border: '1px solid #ccc', padding: 10, borderRadius: 4 }}>
            {Object.entries(userRightsData).map(([category, rights]) => (
              <div key={category} className="mb-2">
                <strong>{category}</strong>
                <div className="row">
                  {rights.map((right) => (
                    <div className="col-md-4 form-check" key={right}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={right}
                        checked={form.rights.includes(right)}
                        onChange={handleCheckboxChange}
                      />
                      <label className="form-check-label">{right}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">SUBMIT</button>
        </div>
      </form>
      </div>
      </div>

      <div className="card mt-4">
        <h6 className="card-header">VIEW LOGIN</h6>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <select className="form-select form-select-sm w-auto">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                className="form-control form-control-sm"
                style={{ width: "200px" }}
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>NAME</th>
                  <th>PHONE NO</th>
                  <th>EMAIL</th>
                  <th>DESIGNATION</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length ? (
                  filteredData.map((row, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{row.name}</td>
                      <td>{row.phone}</td>
                      <td>{row.email}</td>
                      <td>{row.designation}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="text-center">No entries found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <small>Showing 1 to {filteredData.length} of {data.length} entries</small>
            <ul className="pagination pagination-sm mb-0">
              <li className="page-item disabled"><span className="page-link">Previous</span></li>
              <li className="page-item active"><span className="page-link">1</span></li>
              <li className="page-item disabled"><span className="page-link">Next</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ManageUserLogin;
