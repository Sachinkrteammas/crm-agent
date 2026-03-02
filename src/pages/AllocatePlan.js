import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const AllocatePlan = () => {
  const [plans, setPlans] = useState([]);

  // Example static data (Replace with API call)
  useEffect(() => {
    setPlans([
        {
        srn: 1,
        client: "Harvest Gold- Dealer Validation",
        campaign: "Anand_Hearing",
        plan: "Ready Roti India Pvt. Ltd.",
        startDate: "01-Apr-2021",
        endDate: "31-Mar-2022",
        setUpCost: "0",
        rentalCost: "251000",
        balance: "120000",
        paymentTerms: "YEAR",
        ibCall: "6.00",
        ibCallNight: "0.00",
        obCall: "6.50",
        sms: "0.30",
        email: "0.25",
        missCall: "0.00",
        vfo: "0.00",
      },
      {
        srn: 2,
        client: "Harvest Gold- Dealer Validation",
        campaign: "Anand_Hearing",
        plan: "Ready Roti India Pvt. Ltd.",
        startDate: "01-Apr-2021",
        endDate: "31-Mar-2022",
        setUpCost: "0",
        rentalCost: "251000",
        balance: "120000",
        paymentTerms: "YEAR",
        ibCall: "6.00",
        ibCallNight: "0.00",
        obCall: "6.50",
        sms: "0.30",
        email: "0.25",
        missCall: "0.00",
        vfo: "0.00",
      },
      {
        srn: 3,
        client: "Harvest Gold- Dealer Validation",
        campaign: "Anand_Hearing",
        plan: "Ready Roti India Pvt. Ltd.",
        startDate: "01-Apr-2021",
        endDate: "31-Mar-2022",
        setUpCost: "0",
        rentalCost: "251000",
        balance: "120000",
        paymentTerms: "YEAR",
        ibCall: "6.00",
        ibCallNight: "0.00",
        obCall: "6.50",
        sms: "0.30",
        email: "0.25",
        missCall: "0.00",
        vfo: "0.00",
      },
      {
        srn: 4,
        client: "Harvest Gold- Dealer Validation",
        campaign: "Anand_Hearing",
        plan: "Ready Roti India Pvt. Ltd.",
        startDate: "01-Apr-2021",
        endDate: "31-Mar-2022",
        setUpCost: "0",
        rentalCost: "251000",
        balance: "120000",
        paymentTerms: "YEAR",
        ibCall: "6.00",
        ibCallNight: "0.00",
        obCall: "6.50",
        sms: "0.30",
        email: "0.25",
        missCall: "0.00",
        vfo: "0.00",
      },
      {
        srn: 5,
        client: "Harvest Gold- Dealer Validation",
        campaign: "Anand_Hearing",
        plan: "Ready Roti India Pvt. Ltd.",
        startDate: "01-Apr-2021",
        endDate: "31-Mar-2022",
        setUpCost: "0",
        rentalCost: "251000",
        balance: "120000",
        paymentTerms: "YEAR",
        ibCall: "6.00",
        ibCallNight: "0.00",
        obCall: "6.50",
        sms: "0.30",
        email: "0.25",
        missCall: "0.00",
        vfo: "0.00",
      },
    ]);
  }, []);

  const [form, setForm] = useState({
    selectPlan: "",
    selectClient: "",
    startDate: "",
  });

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

      {/* Form Card */}
      <div className="card mb-4">
        <h6 className="card-header">ALLOCATE PLAN</h6>
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-4">
              <label className="form-label">Plan</label>
              <select
                name="selectPlan"
                className="form-select"
                value={form.selectPlan}
                onChange={handleChange}
              >
                <option>Select Plan</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Client</label>
              <select
                name="selectClient"
                className="form-select"
                value={form.selectClient}
                onChange={handleChange}
              >
                <option>Select Client</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Start Date</label>
              <div className="w-100">
              <DatePicker
                selected={form.startDate}
                onChange={(date) => setForm({ ...form, startDate: date })}
                className="form-control w-100"
                placeholderText="Plan Start Date"
                dateFormat="dd-MM-yyyy"
              />
              </div>
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                ALLOCATE
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
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
                <th>CLIENT</th>
                <th>CAMPAIGN</th>
                <th>PLAN</th>
                <th>START DATE</th>
                <th>END DATE</th>
                <th>SET-UP COST</th>
                <th>RENTAL COST</th>
                <th>BALANCE</th>
                <th>PAYMENT TERMS</th>
                <th>IB CALL</th>
                <th>IB CALL NIGHT</th>
                <th>OB CALL</th>
                <th>SMS</th>
                <th>EMAIL</th>
                <th>MISS CALL</th>
                <th>VFO</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.srn}>
                  <td>{plan.srn}</td>
                  <td>{plan.client}</td>
                  <td>{plan.campaign}</td>
                  <td>{plan.plan}</td>
                  <td>{plan.startDate}</td>
                  <td>{plan.endDate}</td>
                  <td>{plan.setUpCost}</td>
                  <td>{plan.rentalCost}</td>
                  <td>{plan.balance}</td>
                  <td>{plan.paymentTerms}</td>
                  <td>{plan.ibCall}</td>
                  <td>{plan.ibCallNight}</td>
                  <td>{plan.obCall}</td>
                  <td>{plan.sms}</td>
                  <td>{plan.email}</td>
                  <td>{plan.missCall}</td>
                  <td>{plan.vfo}</td>
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

export default AllocatePlan;
