import { useState, useEffect } from "react";

const BillSummaryMail = () => {
  const [agents, setAgents] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form); // TODO: Hook up API call here
  };


  // Example static data (Replace with API call)
  useEffect(() => {
    setAgents([
      {
        srn: 1,
        name: "Amit",
        email: "123@test.com",
      },
      {
        srn: 2,
        name: "Rahul",
        email: "345@test.com",
      },
      {
        srn: 3,
        name: "Saurabh",
        email: "456@test.com",
      },
      {
        srn: 4,
        name: "Sachin",
        email: "567@test.com",
      },
      {
        srn: 5,
        name: "Vishal",
        email: "678@test.com",
      },
    ]);
  }, []);

  return (
    <div className="row">
    <div className="col-12">

      {/* Form Card */}
      <div className="card mb-4">
        <h6 className="card-header">ADD BILL SUMMARY AUTO MAIL</h6>
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-4">
              <label className="form-label">Name</label>
              <input
                name="name"
                className="form-control"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Email</label>
              <input
                name="email"
                className="form-control"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="m-3">VIEW BILL SUMMARY AUTO MAIL</h6>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.srn}>
                  <td>{agent.name}</td>
                  <td>{agent.email}</td>
                  <td>
                    <button className="btn btn-sm btn-light">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
};

export default BillSummaryMail;
