import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const AgentWiseCallTagging = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  const handleViewClick = async () => {
  };


  const handleExport = () => {
  };

  return (
    <div className="row">
    <div className="col-12">
        <div className="mb-3">
            <h4>AGENT WISE CALL TAGGING REPORT</h4>
        </div>
      {/* CDR REPORT CARD */}
      <div className="card p-4 mb-4">
      <div className="card-body">
        <div className="d-flex flex-wrap align-items-center gap-4">
          <DatePicker
          selected={startDate ? new Date(startDate) : null}
          onChange={(date) => setStartDate((date))}
          placeholderText="Start Date"
          className="form-control"
        />

        <DatePicker
          selected={endDate ? new Date(endDate) : null}
          onChange={(date) => setEndDate((date))}
          placeholderText="End Date"
          className="form-control"
        />
          <button className="btn btn-primary" onClick={handleExport}>EXPORT</button>
          <button className="btn btn-primary" onClick={handleViewClick}>
              VIEW
            </button>
        </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default AgentWiseCallTagging;
