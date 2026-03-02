import React, { useState, useEffect } from "react";

const PlanApproval = () => {
  const [plans, setPlans] = useState([]);

  // Example static data (Replace with API call)
  useEffect(() => {
    setPlans([
        {
        srn: 1,
        plan: "BIGIES PLAN",
        rejectRemarks: "",
        setUpCost: "10000",
        rentalCost: "180000",
        balance: "120000",
        paymentTerms: "MONTH",
        sms: "0.20",
        email: "0.20",
        missCall: "0.00",
        vfo: "0.00",
        paymentGateway: "Not Specified",
        inboundCallDay: "5",
        pulseDay: "60",
        ratePulseDay: "5",
        inboundCallNight: "7",
        pulseNight: "60",
        ratePulseNight: "7",
        outboundCall: "7",
        pulse: "1",
        ratePerPulse: "0.11666666666666667	",
        ivrCharge: "",
        firstMinute: "Enable",
      },
      {
        srn: 2,
        plan: "BIGIES PLAN",
        rejectRemarks: "",
        setUpCost: "10000",
        rentalCost: "180000",
        balance: "120000",
        paymentTerms: "MONTH",
        sms: "0.20",
        email: "0.20",
        missCall: "0.00",
        vfo: "0.00",
        paymentGateway: "Not Specified",
        inboundCallDay: "5",
        pulseDay: "60",
        ratePulseDay: "5",
        inboundCallNight: "7",
        pulseNight: "60",
        ratePulseNight: "7",
        outboundCall: "7",
        pulse: "1",
        ratePerPulse: "0.11666666666666667	",
        ivrCharge: "",
        firstMinute: "Enable",
      },
      {
        srn: 3,
        plan: "BIGIES PLAN",
        rejectRemarks: "",
        setUpCost: "10000",
        rentalCost: "180000",
        balance: "120000",
        paymentTerms: "MONTH",
        sms: "0.20",
        email: "0.20",
        missCall: "0.00",
        vfo: "0.00",
        paymentGateway: "Not Specified",
        inboundCallDay: "5",
        pulseDay: "60",
        ratePulseDay: "5",
        inboundCallNight: "7",
        pulseNight: "60",
        ratePulseNight: "7",
        outboundCall: "7",
        pulse: "1",
        ratePerPulse: "0.11666666666666667	",
        ivrCharge: "",
        firstMinute: "Enable",
      },
      {
        srn: 4,
        plan: "BIGIES PLAN",
        rejectRemarks: "",
        setUpCost: "10000",
        rentalCost: "180000",
        balance: "120000",
        paymentTerms: "MONTH",
        sms: "0.20",
        email: "0.20",
        missCall: "0.00",
        vfo: "0.00",
        paymentGateway: "Not Specified",
        inboundCallDay: "5",
        pulseDay: "60",
        ratePulseDay: "5",
        inboundCallNight: "7",
        pulseNight: "60",
        ratePulseNight: "7",
        outboundCall: "7",
        pulse: "1",
        ratePerPulse: "0.11666666666666667	",
        ivrCharge: "",
        firstMinute: "Enable",
      },
      {
        srn: 5,
        plan: "BIGIES PLAN",
        rejectRemarks: "",
        setUpCost: "10000",
        rentalCost: "180000",
        balance: "120000",
        paymentTerms: "MONTH",
        sms: "0.20",
        email: "0.20",
        missCall: "0.00",
        vfo: "0.00",
        paymentGateway: "Not Specified",
        inboundCallDay: "5",
        pulseDay: "60",
        ratePulseDay: "5",
        inboundCallNight: "7",
        pulseNight: "60",
        ratePulseNight: "7",
        outboundCall: "7",
        pulse: "1",
        ratePerPulse: "0.11666666666666667	",
        ivrCharge: "",
        firstMinute: "Enable",
      },
    ]);
  }, []);

  return (
    <div className="row">
    <div className="col-12">

      <div className="card p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="m-0">PENDING PLAN</h6>
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
                <th>ACTION</th>
                <th>REJECT REMARKS</th>
                <th>PLAN</th>
                <th>SET-UP COST</th>
                <th>RENTAL COST</th>
                <th>BALANCE</th>
                <th>PAYMENT TERMS</th>
                <th>SMS</th>
                <th>EMAIL</th>
                <th>MISS CALL</th>
                <th>VFO</th>
                <th>PAYMENT GATEWAY</th>
                <th>INBOUND CALL CHARGE(DAY SHIFT)</th>
                <th>PULSE(DAY SHIFT)</th>
                <th>RATE PER PULSE(DAY SHIFT)</th>
                <th>INBOUND CALL CHARGE(NIGHT SHIFT)</th>
                <th>PULSE(NIGHT SHIFT)</th>
                <th>RATE PER PULSE(NIGHT SHIFT)</th>
                <th>OUTBOUND CALL CHARGE</th>
                <th>PULSE</th>
                <th>RATE PER PULSE</th>
                <th>IVR CHARGE</th>
                <th>FIRST MINUTE</th>

              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.srn}>
                  <td>{plan.srn}</td>
                  <td>
                    <button className="btn btn-sm btn-light">
                      Approve
                    </button>
                  </td>
                  <td>{plan.rejectRemarks}</td>
                  <td>{plan.plan}</td>
                  <td>{plan.setUpCost}</td>
                  <td>{plan.rentalCost}</td>
                  <td>{plan.balance}</td>
                  <td>{plan.paymentTerms}</td>
                  <td>{plan.sms}</td>
                  <td>{plan.email}</td>
                  <td>{plan.missCall}</td>
                  <td>{plan.vfo}</td>
                  <td>{plan.paymentGateway}</td>
                  <td>{plan.inboundCallDay}</td>
                  <td>{plan.pulseDay}</td>
                  <td>{plan.ratePulseDay}</td>
                  <td>{plan.inboundCallNight}</td>
                  <td>{plan.pulseNight}</td>
                  <td>{plan.ratePulseNight}</td>
                  <td>{plan.outboundCall}</td>
                  <td>{plan.pulse}</td>
                  <td>{plan.ratePerPulse}</td>
                  <td>{plan.ivrCharge}</td>
                  <td>{plan.firstMinute}</td>
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

export default PlanApproval;
