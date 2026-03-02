import React, { useState } from "react";

const ManageAllocations = () => {
  const [form, setForm] = useState({
    type: "",
    campaignType: "",
    cost: "",
    utilization: "",
    campaignName: "",
    fieldName: "",
    file: null,
  });

  const handleSubmit = () => {

  };

  return (
    <div className="row">
    <div className="col-12">
        <div className="mb-4">
          <h4>Manage Allocations</h4>
       </div>

      <div className="card p-4 mb-4">
          <h6 className="mb-3">MANAGE ALLOCATIONS</h6>

          <div className="row">
            <div className="col-md-3">
              <label className="form-label text-muted">Select Campaign</label>
              <select
                className="form-control mb-3"
                value={form.campaignType}
                onChange={(e) =>
                  setForm({ ...form, campaignType: e.target.value })
                }
              >
                <option value="">Select Campaign</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label text-muted">Select Type</label>
              <select
                className="form-control mb-3"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="">Select Type</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label text-muted">Allocation Name</label>
              <input
                className="form-control mb-3"
                placeholder="Campaign Name"
                value={form.allocationName}
                onChange={(e) =>
                  setForm({ ...form, allocationName: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
                <label className="form-label text-muted">Upload Data</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".csv"
                  onChange={(e) => setForm({ ...form, file: e.target.value })}
                />
                <small className="text-muted d-block mb-3">
                    Note - (Upload only CSV file)
              </small>
            </div>

            <div className="col-12">
              <button className="btn btn-primary" onClick={handleSubmit}>
                SUBMIT
              </button>
            </div>
          </div>
        </div>


      <div className="card">
        <h6 className="card-header">VIEW ALLOCATIONS</h6>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <select className="form-select form-select-sm w-auto">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                className="form-control form-control-sm"
                style={{ width: '200px' }}
                placeholder="Search..."
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>S.N</th>
                  <th>CAMPAIGN NAME</th>
                  <th>ALLOCATION ID</th>
                  <th>ALLOCATION NAME</th>
                  <th>ALLOCATION TYPE</th>
                  <th>CREATE DATE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                  <tr>
                    <td colSpan="8" className="text-center">No data available in table</td>
                  </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination (static) */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <small>Showing 0 to 0 of 0 entries</small>
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

export default ManageAllocations;
