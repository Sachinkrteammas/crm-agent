import React, { useState, useEffect } from "react";

const ViewAgent = () => {
  const [agents, setAgents] = useState([]);

  // Example static data (Replace with API call)
  useEffect(() => {
    setAgents([
      {
        srn: 1,
        displayName: "Amit",
        loginId: "123",
        password: "test",
      },
      {
        srn: 2,
        displayName: "Rahul",
        loginId: "345",
        password: "test",
      },
      {
        srn: 3,
        displayName: "Saurabh",
        loginId: "456",
        password: "test",
      },
      {
        srn: 4,
        displayName: "Sachin",
        loginId: "567",
        password: "test",
      },
      {
        srn: 5,
        displayName: "Vishal",
        loginId: "678",
        password: "test",
      },
      {
        srn: 6,
        displayName: "Wasim",
        loginId: "789",
        password: "test",
      },
      {
        srn: 7,
        displayName: "Aquib",
        loginId: "891",
        password: "test",
      },
      {
        srn: 8,
        displayName: "Mohit",
        loginId: "910",
        password: "test",
      },
      {
        srn: 9,
        displayName: "Anand",
        loginId: "120",
        password: "test",
      },
      {
        srn: 10,
        displayName: "Sonu",
        loginId: "210",
        password: "test",
      },
    ]);
  }, []);

  return (
    <div className="row">
    <div className="col-12">
      <h4 className="mb-3">View Agent</h4>

      <div className="card p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="m-0">VIEW AGENT</h6>
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
                <th>DISPLAY NAME</th>
                <th>LOGIN ID</th>
                <th>PASSWORD</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.srn}>
                  <td>{agent.srn}</td>
                  <td>{agent.displayName}</td>
                  <td>{agent.loginId}</td>
                  <td>{agent.password}</td>
                  <td>
                    <button className="btn btn-sm btn-light">
                      🗑️
                    </button>
                    <button className="btn btn-sm btn-light ms-2">
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

export default ViewAgent;
