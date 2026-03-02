import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getOBSharedCDRReport } from "../services/authService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../styles/loader.css";


const OBSharedCDRReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [cdrData, setCdrData] = useState([]);
  const [loading, setLoading] = useState(false);
  const companyId = localStorage.getItem("company_id");
  const [showTable, setShowTable] = useState(false);

  const handleView = async () => { // add 'async' here
        setLoading(true);
        try {
          const payload = {
            company_id: companyId,
            from_date: startDate.toISOString().split("T")[0],
            to_date: endDate.toISOString().split("T")[0],
          };

          const data = await getOBSharedCDRReport(payload);

          setCdrData(data);
          setShowTable(true);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
    };


  const handleExport = () => {
      if (cdrData.length === 0) {
        alert("No data to export.");
        return;
      }

      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(cdrData);

      // Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

      // Generate a buffer
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Save file
      const file = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(file, "ob_shared_cdr_report.xlsx");
  };

  return (
  <>
      {loading && (
        <div className="loader-overlay">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      )}

    <div className={`priority-wrapper ${loading ? "blurred" : ""}`}>
    <div className="row gy-4 gx-3">
      {/* OB Shared CDR Filter Section */}
      <div className="card p-4 mb-4">
        <h5 className="mb-3">OB SHARED CDR REPORT</h5>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Start Date"
            className="form-control"
            dateFormat="yyyy-MM-dd"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="End Date"
            className="form-control"
            dateFormat="yyyy-MM-dd"
          />
          <button className="btn btn-primary" onClick={handleExport}>
            EXPORT
          </button>
          <button className="btn btn-primary" onClick={handleView}>
            VIEW
          </button>
        </div>
      </div>

      {/* CDR Report Table */}
      {!loading && showTable && (
      <div className="card p-4">
        <h6 className="mb-3">VIEW OB SHARED CDR REPORT</h6>
        <div className="table-responsive" style={{ maxHeight: "500px", overflow: "auto" }}>
          <table className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              <th>Call Date</th>
              <th>Call Start Time</th>
              <th>Call End Time</th>
              <th>Customer Number</th>
              <th>Agent ID</th>
              <th>Agent Name</th>
              <th>Call Type</th>
              <th>System Disposition</th>
              <th>Dialing Mode</th>
              <th>Client Name</th>
              <th>Lead ID</th>
              <th>ACHT</th>
              <th>Talk Time</th>
              <th>Wait Time</th>
              <th>Dispose Time</th>
              <th>Disconnected by</th>
              <th>Scenario</th>
              <th>Sub Scenario 1</th>
              <th>Sub Scenario 2</th>
              <th>Sub Scenario 3</th>
              <th>Sub Scenario 4</th>
              <th>Recording</th>
            </tr>
          </thead>
          <tbody>
            {cdrData.length > 0 ? (
              cdrData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.CallDate || "-"}</td>
                  <td>{row.StartTime || "-"}</td>
                  <td>{row.Endtime || "-"}</td>
                  <td>{row.CustomerNumber || "-"}</td>
                  <td>{row.AgentID || "-"}</td>
                  <td>{row.AgentName || "-"}</td>
                  <td>{row.CallType || "-"}</td>
                  <td>{row.SystemDisposition || "-"}</td>
                  <td>{row.DialingMode || "-"}</td>
                  <td>{row.ClientName || "-"}</td>
                  <td>{row.LeadID || "-"}</td>
                  <td>{row.ACHT || "-"}</td>
                  <td>{row.TalkTime || "-"}</td>
                  <td>{row.WaitTime || "-"}</td>
                  <td>{row.DispoTime || "-"}</td>
                  <td>{row.DisconnectedBy || "-"}</td>
                  <td>{row.Scenario || "-"}</td>
                  <td>{row.SubScenario1 || "-"}</td>
                  <td>{row.SubScenario2 || "-"}</td>
                  <td>{row.SubScenario3 || "-"}</td>
                  <td>{row.SubScenario4 || "-"}</td>
                  <td>
                    {row.RecordingUrl ? (
                      <a href={row.RecordingUrl} download>
                        <i className="bi bi-download"></i>
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center">
                  No data available for selected date range.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        </div>
      </div>
      )}
    </div>
    </div>
    </>
  );
};

export default OBSharedCDRReport;
