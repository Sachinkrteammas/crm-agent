import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from "date-fns";
import api from "../api";
import "../styles/loader.css";

const CurrentBillStatement = () => {
  const clientOptions = [
    { value: 'client1', label: 'Client 1' },
    { value: 'client2', label: 'Client 2' },
    { value: 'client3', label: 'Client 3' },
  ];

  const [selectedClient, setSelectedClient] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const formattedStart = format(startDate, "yyyy-MM-dd");
  const formattedEnd = format(endDate, "yyyy-MM-dd");



const handleSubmit = async () => {
  const clientId = localStorage.getItem("company_id");
  const fromDate = formattedStart;
  const toDate = formattedEnd;

  setLoading(true);

  try {
    const response = await api.get("/call/download_excel_raw", {
      params: {
        client_id: clientId,
        from_date: fromDate,
        to_date: toDate
      },
      headers: {
        Accept: "application/vnd.ms-excel"
      },
      responseType: "blob",  // 🔥 important for downloading files
    });

    const blob = new Blob([response.data], { type: "application/vnd.ms-excel" });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `report_${clientId}_${fromDate}_to_${toDate}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    let message = "Download failed. Please check your request.";
    if (error.response && error.response.data) {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          message = reader.result;
          alert(`Download failed: ${message}`);
        };
        reader.readAsText(error.response.data);
        return;  // exit early — error shown after file reader completes
      } catch (e) {
        // fallback
        message = `Server error: ${error.response.status}`;
      }
    }
    console.error("Download failed:", error);
    alert(message);
  }
  finally {
      setLoading(false);
    }
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

    <div className="card p-4 mb-4">
      <h5 className="mb-8">CURRENT BILL STATEMENT</h5>
      <div className="d-flex flex-wrap align-items-center gap-2">
        <div style={{ minWidth: '200px' }}>
          <select
            className="form-select"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">Select Client</option>
            {clientOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <DatePicker
          selected={startDate}
          onChange={setStartDate}
          placeholderText="From Date"
          className="form-control"
          dateFormat="yyyy-MM-dd"
        />
        <DatePicker
          selected={endDate}
          onChange={setEndDate}
          placeholderText="To Date"
          className="form-control"
          dateFormat="yyyy-MM-dd"
        />
        <button className="btn btn-primary" onClick={handleSubmit}>
          SUBMIT
        </button>
      </div>
    </div>
    </div>
     </>
  );
};

export default CurrentBillStatement;
