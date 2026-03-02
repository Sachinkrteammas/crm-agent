import React, { useState } from 'react';

const ManageRiskExposure = () => {
  const [client, setClient] = useState('');
  const [rows, setRows] = useState([
    { percent: '', action: '', emailTo: '', emailCc: '', remarks: '' }
  ]);

  const clientOptions = [
    { id: 1, name: 'Client A' },
    { id: 2, name: 'Client B' },
    { id: 3, name: 'Client C' },
  ];

  const actionOptions = [
    '', 'Approve', 'Reject', 'Escalate'
  ];

  const handleRowChange = (idx, field, value) => {
    const updated = [...rows];
    updated[idx][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, { percent: '', action: '', emailTo: '', emailCc: '', remarks: '' }]);
  };

  return (
    <div className="row">
      <div className="col-12">
        {/* Client Selection */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Risk Exposure</h5>
          </div>
          <div className="card-body">
            <form>
              <div className="row align-items-end">
                <div className="col-md-4 mb-3">
                  <label htmlFor="clientSelect" className="form-label">Client</label>
                  <select
                    id="clientSelect"
                    className="form-select"
                    value={client}
                    onChange={e => setClient(e.target.value)}
                  >
                    <option value="">Select Client</option>
                    {clientOptions.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Email Details */}
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Email Details</h6>
          </div>
          <div className="card-body">
            {rows.map((row, idx) => (
              <div key={idx} className="row gy-3 align-items-end">
                <div className="col-auto">
                  <label className="form-label">Percent</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      style={{ width: '80px' }}
                      value={row.percent}
                      onChange={e => handleRowChange(idx, 'percent', e.target.value)}
                    />
                    <span className="input-group-text">%</span>
                  </div>
                </div>

                <div className="col-md-2">
                  <label className="form-label">Action</label>
                  <select
                    className="form-select"
                    value={row.action}
                    onChange={e => handleRowChange(idx, 'action', e.target.value)}
                  >
                    {actionOptions.map(opt => (
                      <option key={opt} value={opt}>{opt || 'Select'}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Email To</label>
                  <textarea
                    className="form-control"
                    rows={1}
                    placeholder="Email"
                    value={row.emailTo}
                    onChange={e => handleRowChange(idx, 'emailTo', e.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Email CC</label>
                  <textarea
                    className="form-control"
                    rows={1}
                    placeholder="Email Cc"
                    value={row.emailCc}
                    onChange={e => handleRowChange(idx, 'emailCc', e.target.value)}
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Remarks</label>
                  <textarea
                    className="form-control"
                    rows={1}
                    placeholder="Remarks"
                    value={row.remarks}
                    onChange={e => handleRowChange(idx, 'remarks', e.target.value)}
                  />
                </div>

                <div className="col-auto">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={addRow}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRiskExposure;
