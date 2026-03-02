import { useState } from 'react';

const CampaignSubTypePage = () => {
  const [client, setClient] = useState('');
  const [campaignType, setCampaignType] = useState('');
  const [search, setSearch] = useState('');

  const dummyData = [
    { id: 1, campaignType: 'Ad-hoc calling', clientId: 'I2e1 New' },
    { id: 2, campaignType: 'B2C', clientId: 'I2e1 New' },
    { id: 3, campaignType: 'Retail', clientId: 'I2e1 New' },
    { id: 4, campaignType: 'Daily Outbound calling', clientId: 'I2e1 New' },
    { id: 5, campaignType: 'Others', clientId: 'I2e1 New' },
    { id: 6, campaignType: 'Daily Calling', clientId: 'Astute Outsourcing Services Pvt. ltd.' },
    { id: 7, campaignType: 'Daily Calling', clientId: 'GSM Outbound Calling' },
    { id: 8, campaignType: 'Daily Calling', clientId: 'Guru Harkrishan Enterprises (DH Discovery)' },
    { id: 9, campaignType: 'Manual Calling', clientId: 'Harvest Gold- Dealer Validation' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ client, campaignType });
  };

  const filteredData = dummyData.filter(
    (item) =>
      item.campaignType.toLowerCase().includes(search.toLowerCase()) ||
      item.clientId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="row">
    <div className="col-12">
      {/* Add Campaign Sub Type */}
      <div className="card mb-4">
        <div className="card-header">
          <h6 className="mb-0">Add Campaign Sub Type</h6>
        </div>
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label className="form-label">Select Client</label>
              <input
                type="text"
                className="form-control"
                placeholder="Select Client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Campaign Type</label>
              <input
                type="text"
                className="form-control"
                placeholder="Campaign Type"
                value={campaignType}
                onChange={(e) => setCampaignType(e.target.value)}
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>

      {/* View Client Campaign Table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0">View Client Campaign</h6>
          <div>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '200px' }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Campaign Type</th>
                <th>Client ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.campaignType}</td>
                    <td>{item.clientId}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card-footer d-flex justify-content-between align-items-center">
          <small>Showing 1 to 10 of 140 entries</small>
          <ul className="pagination pagination-sm mb-0">
            <li className="page-item disabled"><span className="page-link">Previous</span></li>
            {[1, 2, 3, 4, 5].map((num) => (
              <li key={num} className={`page-item ${num === 1 ? 'active' : ''}`}>
                <span className="page-link">{num}</span>
              </li>
            ))}
            <li className="page-item"><span className="page-link">Next</span></li>
          </ul>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CampaignSubTypePage;
