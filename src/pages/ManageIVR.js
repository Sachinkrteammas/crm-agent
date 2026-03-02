import React, { useState } from "react";

const ManageIVR = () => {
  const [ivrFiles, setIvrFiles] = useState([]);

  const handleUpload = () => {
    alert("Upload IVR File clicked!");
    // TODO: Implement upload functionality
  };

  return (
    <div className="row">
      <div className="col-12">
        <h4 className="mb-4">Manage IVR</h4>

        {/* Manage IVR Section */}
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>MANAGE IVR</span>
            <button className="btn btn-link text-primary p-0" onClick={handleUpload}>
              UPLOAD IVR FILES
            </button>
          </div>
          <div className="card-body" style={{ minHeight: "300px" }}>
            {/* Sample IVR Node */}
            <div
              className="d-inline-block text-center p-2 rounded shadow"
              style={{
                background: "#f8f9fa",
                position: "relative",
                width: "120px",
              }}
            >
              <div className="d-flex justify-content-center gap-2 mb-2">
                <button className="btn btn-sm btn-light">+</button>
                <button className="btn btn-sm btn-light">✎</button>
                <button className="btn btn-sm btn-light">🗑</button>
              </div>
              <span className="fw-bold">Welcome</span>
            </div>
          </div>
        </div>

        {/* IVR File Table */}
        <div className="card">
          <div className="card-header">VIEW IVR FILE</div>
          <div className="card-body table-responsive">
            <div className="d-flex justify-content-between mb-2">
              <div>
                <select className="form-select form-select-sm w-auto">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>
              <input
                type="text"
                className="form-control form-control-sm w-auto"
                placeholder="Search..."
              />
            </div>
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>S.N</th>
                  <th>FILE NAME</th>
                  <th>DATE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {ivrFiles.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  ivrFiles.map((file, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{file.name}</td>
                      <td>{file.date}</td>
                      <td>
                        <button className="btn btn-sm btn-danger">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="d-flex justify-content-between align-items-center">
              <small>
                Showing {ivrFiles.length === 0 ? 0 : 1} to{" "}
                {ivrFiles.length} of {ivrFiles.length} entries
              </small>
              <div>
                <button className="btn btn-sm btn-light me-2">Previous</button>
                <button className="btn btn-sm btn-light">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageIVR;
