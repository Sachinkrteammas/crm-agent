import { useState } from "react";

const SocialMediaForm = () => {
  const [form, setForm] = useState({
    loginId: "",
    password: "",
    appId: "",
    appSecret: "",
    pageIds: ["", "", "", "", ""],
    pageNames: ["", "", "", "", ""],
    accessTokens: ["", "", "", "", ""],
  });

  const [data] = useState([
    {
      loginId: "fb_admin@xyz.com",
      password: "••••••",
      appId: "1234567890",
      appSecret: "abcd1234secret",
      pageIds: ["p1", "p2", "p3", "p4", "p5"],
      pageNames: ["Page 1", "Page 2", "Page 3", "Page 4", "Page 5"],
      accessTokens: ["token1", "token2", "token3", "token4", "token5"],
    },
  ]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (e, index, field) => {
    const updated = [...form[field]];
    updated[index] = e.target.value;
    setForm({ ...form, [field]: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", form);
  };

  return (
    <div className="row">
      <div className="col-12">
        {/* Page Title */}
        <div className="mb-3">
          <h5>Add/View Social Media</h5>
          <select className="form-select w-auto">
            <option value="">Select Client</option>
            <option value="dialdesk">DIALDESK</option>
            <option value="another">Another Client</option>
          </select>
        </div>

        {/* Form Card */}
        <div className="card mb-4">
          <h6 className="card-header">ADD FACEBOOK DETAILS</h6>
          <div className="card-body">
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-4">
                <label className="form-label">Login Id</label>
                <input
                  type="email"
                  name="loginId"
                  className="form-control"
                  placeholder="Login Id"
                  value={form.loginId}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">App Id</label>
                <input
                  name="appId"
                  className="form-control"
                  placeholder="App Id"
                  value={form.appId}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">App Secret</label>
                <input
                  name="appSecret"
                  className="form-control"
                  placeholder="App Secret"
                  value={form.appSecret}
                  onChange={handleChange}
                />
              </div>

              {/* Page Ids, Names, Tokens */}
              {form.pageIds.map((_, idx) => (
                <>
                  <div className="col-md-4" key={`pid-${idx}`}>
                    <label className="form-label">Page Id {idx + 1}</label>
                    <input
                      className="form-control"
                      value={form.pageIds[idx]}
                      onChange={(e) =>
                        handleArrayChange(e, idx, "pageIds")
                      }
                    />
                  </div>

                  <div className="col-md-4" key={`pname-${idx}`}>
                    <label className="form-label">Page Name {idx + 1}</label>
                    <input
                      className="form-control"
                      value={form.pageNames[idx]}
                      onChange={(e) =>
                        handleArrayChange(e, idx, "pageNames")
                      }
                    />
                  </div>

                  <div className="col-md-4" key={`token-${idx}`}>
                    <label className="form-label">
                      Access Token {idx + 1}
                    </label>
                    <input
                      className="form-control"
                      value={form.accessTokens[idx]}
                      onChange={(e) =>
                        handleArrayChange(e, idx, "accessTokens")
                      }
                    />
                  </div>
                </>
              ))}

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
          <h6 className="card-header">VIEW FACEBOOK DETAILS</h6>
          <div className="card-body table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>LOGIN ID</th>
                  <th>PASSWORD</th>
                  <th>APP ID</th>
                  <th>APP SECRET</th>
                  <th>PAGE IDS</th>
                  <th>PAGE NAMES</th>
                  <th>ACCESS TOKENS</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, idx) => (
                  <tr key={idx}>
                    <td>{entry.loginId}</td>
                    <td>{entry.password}</td>
                    <td>{entry.appId}</td>
                    <td>{entry.appSecret}</td>
                    <td>{entry.pageIds.join(", ")}</td>
                    <td>{entry.pageNames.join(", ")}</td>
                    <td>{entry.accessTokens.join(", ")}</td>
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

export default SocialMediaForm;
