import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchCDRReport } from '../services/authService';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../styles/loader.css";


const CDRReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const companyId = localStorage.getItem("company_id");
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);

  const [sampleData, setSampleData] = useState([]);



    const formatDate = (date) => {
      if (!date) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

const handleStartDateChange = (date) => {
  setStartDate(formatDate(date));
};

const handleEndDateChange = (date) => {
  setEndDate(formatDate(date));
};

  const handleViewClick = async () => {
        setLoading(true);
        try {
            const payload = {
                from_date: startDate,
                to_date: endDate,
                company_id: companyId,
            };

            const response = await fetchCDRReport(payload);

            const formatted = response.map((row) => ({
                agent: row.agent,
                phone: row.phone_number,
                callDate: row.call_date,
                queueTime: row.queuetime,
                startTimeQueue: row.queue_start,
                startTime: row.start_time,
                endTime: row.end_time,
                endTimeWrap: row.wrap_end_time,
                callDurationSec: row.call_duration1,
                callDurationTime: row.call_duration,
                wrapTime: row.wrap_time,
                holdTime: row.parked_time,

                Category1: row.Category1,
                Category2: row.Category2,
                Category3: row.Category3,
                Category4: row.Category4,
                Category5: row.Category5,
                Source: row.Source ?? row.campaign_id,
                Recording: row.Recording
                    ? row.Recording
                    : `http://your-server.com/recordings/${row.uniqueid}.wav`,
            }));

            setSampleData(formatted);
            setShowTable(true);
        } catch (err) {
            console.error("Failed to fetch report", err);
        } finally {
            setLoading(false);
        }
  };


  const handleExport = () => {
      if (sampleData.length === 0) {
        alert("No data to export.");
        return;
      }

      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(sampleData);

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
      saveAs(file, "cdr_report.xlsx");
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
      {/* CDR REPORT CARD */}
      <div className="card p-4 mb-4">
        <h5 className="mb-3">CDR REPORT</h5>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <DatePicker
          selected={startDate ? new Date(startDate) : null}
          onChange={handleStartDateChange}
          placeholderText="Start Date"
          className="form-control"
        />

        <DatePicker
          selected={endDate ? new Date(endDate) : null}
          onChange={handleEndDateChange}
          placeholderText="End Date"
          className="form-control"
        />
          <button className="btn btn-primary" onClick={handleExport}>EXPORT</button>
          <button className="btn btn-primary" onClick={handleViewClick}>
          VIEW
        </button>
        </div>
      </div>

      {/* VIEW CDR REPORT CARD */}
      {!loading && showTable && (
      <div className="card p-4">
        <h6 className="mb-3">VIEW CDR REPORT</h6>
        <div className="table-responsive" style={{ maxHeight: "500px", overflow: "auto" }}>
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>Agent</th>
                <th>Phone Number</th>
                <th>Call Date</th>
                <th>Queue Time</th>
                <th>Start Time - Queue</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>End time with Wrap Time</th>
                <th>Call Duration Sec</th>
                <th>Call Duration Time</th>
                <th>Wrap Time</th>
                <th>Hold Time</th>
                <th>Scenario</th>
                <th>Sub Scenario 1</th>
                <th>Sub Scenario 2</th>
                <th>Sub Scenario 3</th>
                <th>Sub Scenario 4</th>
                <th>Source</th>
                <th>Recording</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.length > 0 ? (
                sampleData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.agent}</td>
                  <td>{row.phone}</td>
                  <td>{row.callDate}</td>
                  <td>{row.queueTime}</td>
                  <td>{row.startTimeQueue}</td>
                  <td>{row.startTime}</td>
                  <td>{row.endTime}</td>
                  <td>{row.endTimeWrap}</td>
                  <td>{row.callDurationSec}</td>
                  <td>{row.callDurationTime}</td>
                  <td>{row.wrapTime}</td>
                  <td>{row.holdTime}</td>
                  <td>{row.Category1}</td>
                  <td>{row.Category2}</td>
                  <td>{row.Category3}</td>
                  <td>{row.Category4}</td>
                  <td>{row.Category5}</td>
                  <td>{row.Source}</td>
                  <td>
                    <a href={row.Recording} className="text-primary">
                      Download Recording
                    </a>
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

export default CDRReport;
