import { useState } from 'react';

const CampaignListPage = () => {
  const [client, setClient] = useState('');
  const [listId, setListId] = useState('');
  const [search, setSearch] = useState('');

  const dummyData = [
    { id: 1, listId: '1005', clientId: 'Yamaha', createDate: '' },
    { id: 2, listId: '1002', clientId: 'Yamaha', createDate: '' },
    { id: 3, listId: '1001', clientId: 'Yamaha', createDate: '' },
    { id: 4, listId: '1000', clientId: 'Wheel India SCM Solutions Pvt Ltd', createDate: '' },
    { id: 5, listId: '1006', clientId: 'Yamaha', createDate: '' },
    { id: 6, listId: '10041', clientId: 'Yamaha Motor India', createDate: '' },
    { id: 7, listId: '1010', clientId: 'Yamaha', createDate: '' },
    { id: 8, listId: '1009', clientId: 'Yamaha', createDate: '' },
    { id: 9, listId: '1008', clientId: 'Yamaha', createDate: '' },
    { id: 10, listId: '1013', clientId: 'Yamaha', createDate: '09 Dec 2017' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submit logic here
    console.log({ client, listId });
  };

  const filteredData = dummyData.filter(
    item =>
      item.clientId.toLowerCase().includes(search.toLowerCase()) ||
      item.listId.includes(search)
  );

  return (
    <div className="row">
    <div className="col-12">
      {/* Add Campaign List ID Form */}
      <div className="card mb-4">
        <div className="card-header">
          <h6 className="mb-0">Add Campaign List ID</h6>
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
              <label className="form-label">List Id</label>
              <input
                type="text"
                className="form-control"
                placeholder="List Id"
                value={listId}
                onChange={(e) => setListId(e.target.value)}
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>

      {/* View Client Campaign List ID Table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0">View Client Campaign List ID</h6>
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
                <th>List ID</th>
                <th>Client ID</th>
                <th>Create Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.listId}</td>
                  <td>{item.clientId}</td>
                  <td>{item.createDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination - Example only */}
        <div className="card-footer d-flex justify-content-between align-items-center">
          <small>Showing 1 to 10 of 8,766 entries</small>
          <ul className="pagination pagination-sm mb-0">
            <li className="page-item disabled"><span className="page-link">Previous</span></li>
            {[1, 2, 3, 4, 5].map(num => (
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

export default CampaignListPage;
