import React, { useState } from 'react';

const ManageMISReports = () => {
  const [formData, setFormData] = useState({
    userName: '',
    designation: '',
    mobile: '',
    email: '',
    report: '',
    reportType: ''
  });

  const [reports, setReports] = useState([]); // Table data

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("form submitted:", formData);
  };

  return (
    <div className="row">
      <div className="col-12">
      <h4 className="mb-4">Manage MIS & Reports</h4>

      <div className="card mb-4">
        <div className="card-header">MANAGE MIS & REPORTS</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <label className="form-label">User Name</label>
              <input
                type="text"
                className="form-control"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Designation</label>
              <input
                type="text"
                className="form-control"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Mobile</label>
              <input
                type="text"
                className="form-control"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Select Report</label>
              <select
                name="report"
                className="form-select"
                value={formData.report}
                onChange={handleChange}
              >
                <option value="">Select Report</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Report Type</label>
              <select
                name="reportType"
                className="form-select"
                value={formData.reportType}
                onChange={handleChange}
              >
                <option value="">Report Type</option>
              </select>
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary">SUBMIT</button>
            </div>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">VIEW REPORT MATRIX</div>
        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>S.N</th>
                <th>USER NAME</th>
                <th>DESIGNATION</th>
                <th>MOBILE</th>
                <th>EMAIL</th>
                <th>REPORT</th>
                <th>REPORT TYPE</th>
                <th>REPORT TIME</th>
                <th>SEND TYPE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center">No data available in table</td>
                </tr>
              ) : (
                reports.map((report, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{report.userName}</td>
                    <td>{report.designation}</td>
                    <td>{report.mobile}</td>
                    <td>{report.email}</td>
                    <td>{report.report}</td>
                    <td>{report.reportType}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ManageMISReports;
