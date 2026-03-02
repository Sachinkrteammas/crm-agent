import { useState } from 'react';

const ShopifyIntegrationPage = () => {
  const [form, setForm] = useState({
    client: '',
    domain: '',
    apiKey: '',
    token: '',
    listId: '',
    dialerIp: ''
  });

  const [search, setSearch] = useState('');

  const data = [
    {
      client: '',
      apiKey: '',
      token: '',
      domain: 'panchamrit-ghee',
      listId: '222222',
      dialerIp: '192.168.11.249',
      createDate: '21 Nov 2023',
    },
    {
      client: '',
      apiKey: '',
      token: '',
      domain: 'belora-te',
      listId: '333333',
      dialerIp: '192.168.11.249',
      createDate: '21 Nov 2023',
    },
    {
      client: '',
      apiKey: '',
      token: '',
      domain: 'thestruttstore',
      listId: '333333',
      dialerIp: '192.168.11.249',
      createDate: '21 Nov 2023',
    },
    {
      client: '',
      apiKey: '',
      token: '',
      domain: 'https://www.almowear.com',
      listId: '55555555',
      dialerIp: '192.168.11.249',
      createDate: '21 Nov 2023',
    },
    {
      client: '',
      apiKey: '',
      token: '',
      domain: 'ras-luxury-oils-123',
      listId: '7777777',
      dialerIp: '192.168.10.5',
      createDate: '21 Nov 2023',
    },
    {
      client: '',
      apiKey: '',
      token: '',
      domain: 'cool-beds',
      listId: '44444444',
      dialerIp: '192.168.11.249',
      createDate: '21 Nov 2023',
    },
    {
      client: '',
      apiKey: '',
      token: '',
      domain: 'just-herbs-india',
      listId: '',
      dialerIp: '',
      createDate: '21 Nov 2023',
    },
    {
      client: 'Neemans Private Limited',
      apiKey: '',
      token: '',
      domain: 'babymarketstore',
      listId: '99911122',
      dialerIp: '192.168.11.249',
      createDate: '21 May 2025',
    }
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    // Integrate with API here
  };

  const filteredData = data.filter((item) =>
    item.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="row">
    <div className="col-12">

      {/* Form Section */}
      <div className="card mb-4">
        <h6 className="card-header">SHOPIFY INTEGRATION</h6>
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-4">
              <label className="form-label">Client</label>
              <input
                className="form-control"
                name="client"
                value={form.client}
                onChange={handleChange}
                placeholder="Select Client"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Api Key</label>
              <input
                className="form-control"
                name="apiKey"
                value={form.apiKey}
                onChange={handleChange}
                placeholder="Api Key"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Token</label>
              <input
                className="form-control"
                name="token"
                value={form.token}
                onChange={handleChange}
                placeholder="Token"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Domain</label>
              <input
                className="form-control"
                name="domain"
                value={form.domain}
                onChange={handleChange}
                placeholder="Domain"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">List Id</label>
              <input
                className="form-control"
                name="listId"
                value={form.listId}
                onChange={handleChange}
                placeholder="List Id"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Dialer Ip</label>
              <input
                className="form-control"
                name="dialerIp"
                value={form.dialerIp}
                onChange={handleChange}
                placeholder="Dialer Ip"
              />
            </div>
            <div className="col-12 text-center mt-3">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>

      {/* Table Section */}
      <div className="card">
        <h6 className="card-header">VIEW SHOPIFY INTEGRATION</h6>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <select className="form-select form-select-sm w-auto">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                className="form-control form-control-sm"
                style={{ width: '200px' }}
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>CLIENT ID</th>
                  <th>API KEY</th>
                  <th>TOKEN</th>
                  <th>DOMAIN</th>
                  <th>LIST ID</th>
                  <th>DIALER IP</th>
                  <th>CREATE DATE</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length ? (
                  filteredData.map((row, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{row.client}</td>
                      <td>{row.apiKey}</td>
                      <td>{row.token}</td>
                      <td>{row.domain}</td>
                      <td>{row.listId}</td>
                      <td>{row.dialerIp}</td>
                      <td>{row.createDate}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="8" className="text-center">No entries found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination (static) */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <small>Showing 1 to {filteredData.length} of {data.length} entries</small>
            <ul className="pagination pagination-sm mb-0">
              <li className="page-item disabled"><span className="page-link">Previous</span></li>
              <li className="page-item active"><span className="page-link">1</span></li>
              <li className="page-item disabled"><span className="page-link">Next</span></li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ShopifyIntegrationPage;
