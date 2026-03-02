import { useState } from "react";

const EmailMapPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    inboxHost: "",
    inboxPort: "",
    sendHost: "",
    sendPort: "",
    status: "",
  });

  const [data] = useState([
    {
      email: "anil.goar@teammas.in",
      password: "••••••••",
      inboxHost: "{pop.teammas.in:110/pop3/novalidate-cert}INBOX",
      inboxPort: "123",
      sendHost: "smtp.teammas.in",
      sendPort: "587",
      status: "1",
    },
  ]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form); // TODO: Hook up API call here
  };

  return (
    <div className="row">
    <div className="col-12">
      {/* Page Title */}
      <div className="mb-3">
          <h5>Add/View Email Map</h5>
          <select className="form-select w-auto">
            <option value="">Select Client</option>
            <option value="dialdesk">DIALDESK</option>
            <option value="another">Another Client</option>
            {/* Add more options dynamically if needed */}
          </select>
      </div>

      {/* Form Card */}
      <div className="card mb-4">
        <h6 className="card-header">ADD EMAIL DETAILS</h6>
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-4">
              <label className="form-label">Email Id</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Email Id"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Login Password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Inbox Host Name</label>
              <input
                name="inboxHost"
                className="form-control"
                placeholder="Inbox Host Name"
                value={form.inboxHost}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Inbox Port</label>
              <input
                name="inboxPort"
                className="form-control"
                placeholder="Inbox Port"
                value={form.inboxPort}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Send Host Name</label>
              <input
                name="sendHost"
                className="form-control"
                placeholder="Send Host Name"
                value={form.sendHost}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Send Port</label>
              <input
                name="sendPort"
                className="form-control"
                placeholder="Send Port"
                value={form.sendPort}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Status</label>
              <input
                name="status"
                className="form-control"
                placeholder="Select Status"
                value={form.status}
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

      {/* Table Card */}
      <div className="card">
        <h6 className="card-header">VIEW EMAIL DETAILS</h6>
        <div className="card-body table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>EMAIL</th>
                <th>PASSWORD</th>
                <th>INBOX HOST NAME</th>
                <th>INBOX PORT</th>
                <th>SEND HOST NAME</th>
                <th>SEND PORT</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, idx) => (
                <tr key={idx}>
                  <td>{entry.email}</td>
                  <td>{entry.password}</td>
                  <td>{entry.inboxHost}</td>
                  <td>{entry.inboxPort}</td>
                  <td>{entry.sendHost}</td>
                  <td>{entry.sendPort}</td>
                  <td>{entry.status}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-secondary">
                      <i className="ti ti-edit"></i>
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

export default EmailMapPage;
