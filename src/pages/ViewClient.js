import React, { useState, useEffect } from "react";

const ViewClient = () => {
  const [clients, setClients] = useState([]);

  // Example static data (Replace with API call)
  useEffect(() => {
    setClients([
      {
        srn: 1,
        company: "21st Century",
        clientName: "MANOJ BARMAN",
        email: "manoj.barman@cucinelubeindia.in",
        phone: "9899360627",
        status: "Pending",
      },
      {
        srn: 2,
        company: "Aadil Qadri",
        clientName: "Adil Qadri",
        email: "info@adilqadri.com",
        phone: "8128613466",
        status: "Active",
      },
      {
        srn: 3,
        company: "abc",
        clientName: "www",
        email: "ravikiran.rangi.mca3@gmail.com",
        phone: "7799638292",
        status: "Pending",
      },
      // Add more clients...
    ]);
  }, []);

  return (
    <div className="row">
    <div className="col-12">
      <h4 className="mb-3">View Client</h4>

      <div className="card p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="m-0">VIEW CLIENT</h6>
          <div className="d-flex align-items-center gap-2">
            <select className="form-select form-select-sm w-auto">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <input
              type="search"
              className="form-control form-control-sm w-auto"
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>SRN.</th>
                <th>COMPANY NAME</th>
                <th>CLIENT NAME</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.srn}>
                  <td>{client.srn}</td>
                  <td>{client.company}</td>
                  <td>{client.clientName}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td
                    className={
                      client.status === "Active"
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {client.status}
                  </td>
                  <td>
                    <button className="btn btn-sm btn-light">
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination (Mocked) */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>Showing 1 to 10 of 235 entries</div>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className="page-item disabled">
                <button className="page-link">Previous</button>
              </li>
              {[1, 2, 3, 4, 5].map((num) => (
                <li
                  key={num}
                  className={`page-item ${num === 1 ? "active" : ""}`}
                >
                  <button className="page-link">{num}</button>
                </li>
              ))}
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

export default ViewClient;
