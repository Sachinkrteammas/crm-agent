import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getOBCDRReport } from '../services/authService';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../styles/loader.css";


const OBCDRReport = () => {

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const companyId = localStorage.getItem("company_id");
  const [selectedClient, setSelectedClient] = useState(companyId);
  const [obCdrData, setObCdrData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const handleView = async () => {
      setLoading(true);
      try {
        const payload = {
          company_id: companyId,
          from_date: startDate.toISOString().split("T")[0],
          to_date: endDate.toISOString().split("T")[0],
        };

        const data = await getOBCDRReport(payload);

        // Optional: console.log(data, "OB CDR DATA==");
        setObCdrData(data);
        setShowTable(true);
      } catch (error) {
          console.error(error);
      } finally {
          setLoading(false);
      }
  };

  const handleExport = () => {
      if (obCdrData.length === 0) {
        alert("No data to export.");
        return;
      }

      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(obCdrData);

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
      saveAs(file, "ob_cdr_report.xlsx");
  };

  useEffect(() => {
  // If companyId is present, ensure it is set if user refreshes the page
  if (companyId) {
    setSelectedClient(companyId);
  }
}, [companyId]);

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
      {/* OB CDR REPORT CARD */}
      <div className="card p-4 mb-4">
        <h5 className="mb-3">OB CDR REPORT</h5>
        <div className="d-flex flex-wrap align-items-center gap-2">
          {/* <div style={{ minWidth: "200px" }}>
            <select
              className="form-select"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              <option value={companyId}>{companyId ? `Selected Client (${companyId})` : "Select Client"}</option>
            </select>
          </div> */}
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            placeholderText="Start Date"
            className="form-control"
          />
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            placeholderText="End Date"
            className="form-control"
          />
          <button className="btn btn-primary" onClick={handleExport}>
            EXPORT
          </button>
          <button className="btn btn-primary" onClick={handleView}>
            VIEW
          </button>
        </div>
      </div>

      {/* VIEW OB CDR REPORT TABLE */}
      {!loading && showTable && (
      <div className="card p-4">
        <h6 className="mb-3">VIEW OB CDR REPORT</h6>
        <div className="table-responsive" style={{ maxHeight: "500px", overflow: "auto" }}>
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>Agent</th>
                <th>Phone Number</th>
                <th>Call Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Call Duration</th>
                <th>Wrap Time</th>
                <th>Recording</th>
                <th>Scenario</th>
                <th>Sub Scenario 1</th>
                <th>Sub Scenario 2</th>
                <th>Sub Scenario 3</th>
                <th>Sub Scenario 4</th>
              </tr>
            </thead>
            <tbody>
              {obCdrData.length > 0 ? (
                obCdrData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.Agent || "-"}</td>
                  <td>{row.PhoneNumber || "-"}</td>
                  <td>{row.CallDate || "-"}</td>
                  <td>{row.StartTime ? row.StartTime.slice(0, 19).replace("T", " ") : "-"}</td>
                  <td>{row.Endtime ? row.Endtime.slice(0, 19).replace("T", " ") : "-"}</td>
                  <td>{row.CallDuration || "-"}</td>
                  <td>{row.WrapTime || "-"}</td>
                  <td>
                    {row.Recording ? (
                      <a href={row.Recording} className="text-primary">
                        <i className="ti ti-download"></i>
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{row.scenario || "-"}</td>
                  <td>{row.subScenario1 || "-"}</td>
                  <td>{row.subScenario2 || "-"}</td>
                  <td>{row.subScenario3 || "-"}</td>
                  <td>{row.subScenario4 || "-"}</td>
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

export default OBCDRReport;
