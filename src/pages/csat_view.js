import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../styles/loader.css";

function CsatView() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const companyId = 605;

  const customColStyle = {
    flex: "0 0 auto",
    width: "19.666667%",
  };

  const handleViewClick = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    const formattedStart = format(startDate, "yyyy-MM-dd");
    const formattedEnd = format(endDate, "yyyy-MM-dd");

    try {
      const response = await api.get(`/call/csat-report/${companyId}`, {
        params: {
          client_id: companyId,
          from_date: formattedStart,
          to_date: formattedEnd,
        },
      });

      setData(response.data);
      console.log("CSAT Report Data:", response.data);
    } catch (error) {
      console.error("Failed to fetch CSAT report:", error);
      alert("Error fetching CSAT report");
    } finally {
      setLoading(false);
    }
  };

  const handleExportToExcel = () => {
    if (data.length === 0) {
      alert("No data to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(file, "csat_report.xlsx");
  };

  return (
    <>
      {/* Full-screen loader */}
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
        <div className="col-12">
          <div className="card">
            <h5 className="card-header">CSAT View</h5>
            <div className="card-body">
              <div className="row g-2 align-items-end">
                <div style={customColStyle} className="col-md-3 col-sm-6">
                  <label className="form-label" htmlFor="start-date">
                    Start Date
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="DD-MM-YYYY"
                    className="form-control"
                    id="start-date"
                  />
                </div>

                <div style={customColStyle} className="col-md-3 col-sm-6">
                  <label className="form-label" htmlFor="end-date">
                    End Date
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="DD-MM-YYYY"
                    className="form-control"
                    id="end-date"
                  />
                </div>

                <div className="col-md-3 col-sm-6">
                  <button
                    type="button"
                    className="btn btn-primary w-75 px-4 py-2"
                    onClick={handleViewClick}
                  >
                    View
                  </button>
                </div>

                <div className="col-md-3 col-sm-6">
                  <button
                    type="button"
                    className="btn btn-primary w-75 px-4 py-2"
                    onClick={handleExportToExcel}
                  >
                    Export
                  </button>
                </div>
              </div>

              {!loading && data.length > 0 && (
                <div className="col-12 mt-4">
                  <div
                    className="table-responsive"
                    style={{
                      maxHeight: "600px",
                      overflowX: "auto",
                      overflowY: "auto",
                    }}
                  >
                    <table className="table table-bordered table-striped">
                      <thead
                        className="table-dark"
                        style={{ position: "sticky", top: 0, zIndex: 2 }}
                      >
                        <tr>
                          {Object.keys(data[0]).map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((val, idx) => (
                              <td key={idx}>{val ?? "-"}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CsatView;
