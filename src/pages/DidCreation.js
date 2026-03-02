import React, { useState, useEffect } from "react";

const DidCreation = () => {
  const [form, setForm] = useState({
    didNumber: "",
    customerCareNo: "",
  });

  const [viewClientDID, setViewClientDID] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Sample static data
    setForm({
      didNumber: "6670144",
      customerCareNo: "6670144",
    });

    setViewClientDID([
      {
        did: "6670144",
        cc: "6670144",
        createDate: "0000-00-00 00:00:00",
        updateDate: "2017-08-06 02:12:54",
      },
    ]);

    setHistory([
      {
        did: "0",
        cc: "6670144",
        createDate: "0000-00-00 00:00:00",
        updateDate: "2022-02-26 03:13:20",
      },
      {
        did: "1111111",
        cc: "0",
        createDate: "0000-00-00 00:00:00",
        updateDate: "2017-08-06 02:12:54",
      },
      {
        did: "4645651",
        cc: "6670144",
        createDate: "0000-00-00 00:00:00",
        updateDate: "2022-02-26 03:13:16",
      },
      {
        did: "6670144",
        cc: "6670144",
        createDate: "0000-00-00 00:00:00",
        updateDate: "2022-02-26 03:09:08",
      },
      {
        did: "61105555",
        cc: "0",
        createDate: "0000-00-00 00:00:00",
        updateDate: "2017-07-30 04:16:34",
      },
    ]);
  }, []);

  const handleUpdate = () => {
    // Handle update logic
    console.log("Updated form", form);
  };

  return (
    <div className="row">
    <div className="col-12">
      <div className="mb-3">
          <h5>DID Creation</h5>
          <select className="form-select w-auto">
            <option value="">Select Client</option>
            <option value="dialdesk">DIALDESK</option>
            <option value="another">Another Client</option>
            {/* Add more options dynamically if needed */}
          </select>
      </div>

      <div className="card p-4 mb-4">
        <h6 className="mb-3">DID CREATION</h6>
        <div className="col-md-6">
        <input
          className="form-control mb-3"
          placeholder="DID Number"
          value={form.didNumber}
          onChange={(e) =>
            setForm({ ...form, didNumber: e.target.value })
          }
        />
        </div>
        <div className="col-md-6">
        <input
          className="form-control mb-3"
          placeholder="Customer Care No"
          value={form.customerCareNo}
          onChange={(e) =>
            setForm({ ...form, customerCareNo: e.target.value })
          }
        />
        </div>
        <div className="col-12">
            <button className="btn btn-primary" onClick={handleUpdate}>
              Update
            </button>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <h6 className="mb-3">VIEW CLIENT DID</h6>
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>DID NUMBER</th>
                <th>CUSTOMER CARE NO</th>
                <th>CREATE DATE</th>
                <th>UPDATE DATE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {viewClientDID.map((d, idx) => (
                <tr key={idx}>
                  <td>{d.did}</td>
                  <td>{d.cc}</td>
                  <td>{d.createDate}</td>
                  <td>{d.updateDate}</td>
                  <td>
                    <button className="btn btn-sm btn-light">🗑️</button>
                    {/* Or: <button className="btn btn-sm btn-light">Delete</button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-4">
        <h6 className="mb-3">CLIENT DID HISTORY</h6>
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>DID NUMBER</th>
                <th>CUSTOMER CARE NO</th>
                <th>CREATE DATE</th>
                <th>UPDATE DATE</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, idx) => (
                <tr key={idx}>
                  <td>{h.did}</td>
                  <td>{h.cc}</td>
                  <td>{h.createDate}</td>
                  <td>{h.updateDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between mt-2">
          <div>Showing 1 to 5 of {history.length} entries</div>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className="page-item disabled">
                <button className="page-link">Previous</button>
              </li>
              <li className="page-item active">
                <button className="page-link">1</button>
              </li>
              <li className="page-item">
                <button className="page-link">Next</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      </div>
    </div>
  );
};

export default DidCreation;
