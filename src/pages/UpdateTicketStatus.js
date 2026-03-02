import React, { useState } from "react";

const UpdateTicketStatus = () => {
  const [form, setForm] = useState({
    file: null,
  });

  const handleSubmit = () => {

  };

  return (
    <div className="row">
    <div className="col-12">
        <div className="mb-4">
          <h4>Update Ticket Status</h4>
       </div>

      <div className="card p-4 mb-4">
          <h6 className="mb-3">UPDATE TICKET STATUS</h6>

          <div className="row">

            <div className="col-md-4 mb-4">
                <label className="form-label text-muted">Upload Data</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".csv"
                  onChange={(e) => setForm({ ...form, file: e.target.value })}
                />
                <small className="text-muted d-block mb-3">
                    Note - (Only CSV file allowed)
              </small>
            </div>

            <div className="col-12">
              <button className="btn btn-primary" onClick={handleSubmit}>
                UPLOAD
              </button>
            </div>
          </div>
        </div>
    </div>
    </div>
  );
};

export default UpdateTicketStatus;
