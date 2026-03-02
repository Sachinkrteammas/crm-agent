import React, { useState } from "react";

const CampaignPage = () => {
  const [form, setForm] = useState({
    campaignName: "",
    groupId: "",
    cost: "",
    utilization: "",
  });

  const [campaigns, setCampaigns] = useState([
    {
      campaignName: "Test_Inbound",
      groupId: "Test_Inbound",
      cost: "",
      utilization: "",
    },
  ]);

  const handleUpdate = () => {
    if (!form.campaignName || !form.groupId) return;
    setCampaigns([...campaigns, form]);
    setForm({ campaignName: "", groupId: "", cost: "", utilization: "" });
  };

  return (
    <div className="row">
    <div className="col-12">
        <div className="mb-3">
          <h5>Add Campaign</h5>
          <select className="form-select w-auto">
            <option value="">Select Client</option>
            <option value="dialdesk">DIALDESK</option>
            <option value="another">Another Client</option>
            {/* Add more options dynamically if needed */}
          </select>
       </div>

      <div className="card p-4 mb-4">
          <h6 className="mb-3">ADD CAMPAIGN</h6>

          <div className="row">
            <div className="col-md-6">
              <label className="form-label text-muted">Campaign Name</label>
              <input
                className="form-control mb-3"
                placeholder="Campaign Name"
                value={form.campaignName}
                onChange={(e) =>
                  setForm({ ...form, campaignName: e.target.value })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label text-muted">Group Id</label>
              <input
                className="form-control mb-3"
                placeholder="Group Id"
                value={form.groupId}
                onChange={(e) =>
                  setForm({ ...form, groupId: e.target.value })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label text-muted">Cost</label>
              <select
                className="form-control mb-3"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
              >
                <option value="">Select Cost</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label text-muted">Utilization</label>
              <select
                className="form-control mb-3"
                value={form.utilization}
                onChange={(e) =>
                  setForm({ ...form, utilization: e.target.value })
                }
              >
                <option value="">Select Utilization</option>
                <option value="Full">Full</option>
                <option value="Partial">Partial</option>
                <option value="None">None</option>
              </select>
            </div>

            <div className="col-12">
              <button className="btn btn-primary" onClick={handleUpdate}>
                UPDATE
              </button>
            </div>
          </div>
        </div>


      <div className="card p-4">
        <h6 className="mb-3">VIEW CLIENT CAMPAIGN</h6>

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>CLIENT CAMPAIGN</th>
                <th>GROUP ID</th>
                <th>COST</th>
                <th>UTILIZATION</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c, idx) => (
                <tr key={idx}>
                  <td>{c.campaignName}</td>
                  <td>{c.groupId}</td>
                  <td>{c.cost}</td>
                  <td>{c.utilization}</td>
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

export default CampaignPage;
