
const ClientBillSummary = () => {

  return (
    <div className="row">
    <div className="col-12">

      {/* Form Card */}
      <div className="card mb-4">
        <h6 className="card-header">CLIENT WISE BILL SUMMARY</h6>
        <div className="card-body">
          <div className="mb-3">
              <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-secondary">BILL SUMMARY</button>
                <button className="btn btn-secondary">BILL EXPORT</button>
                <button className="btn btn-secondary">BILL HISTORY</button>
                <button className="btn btn-secondary">RENEWAL HISTORY</button>
                <button className="btn btn-secondary">BALANCE HISTORY</button>
              </div>
          </div>

        </div>
      </div>

      <div className="card p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="m-3">DETAILS</h6>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>CLIENT</th>
                <th>PLAN</th>
                <th>TYPE</th>
                <th>RENT</th>
                <th>FREE VALUE</th>
                <th>START DATE</th>
                <th>END DATE</th>
                <th>BALANCE</th>
                <th>STATUS</th>
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
      </div>
      </div>
    </div>
  );
};

export default ClientBillSummary;
