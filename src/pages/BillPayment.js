
const BillPayment = () => {

  return (
    <div className="row">
    <div className="col-12">

      {/* Table Section */}
      <div className="card">
        <h6 className="card-header">Payment Approval</h6>
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
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>COMPANY NAME</th>
                  <th>PLAN NAME</th>
                  <th>PLAN TYPE</th>
                  <th>PAYMENT TYPE</th>
                  <th>PAY AMOUNT</th>
                  <th>PAY DATE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                  <tr>
                    <td colSpan="8" className="text-center">No data available in table</td>
                  </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination (static) */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <small>Showing 0 to 0 of 0 entries</small>
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

export default BillPayment;
