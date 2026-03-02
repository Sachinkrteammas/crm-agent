import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getIVRReport } from "../services/authService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getIVRFunnelReport } from "../services/authService";
import { format } from "date-fns";

const IVRFunnelReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const companyId = localStorage.getItem("company_id");

  const exportToExcel = (data, filename = "IVR_Funnel_Report.xlsx") => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "IVR Funnel Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, filename);
  };

  const handleExport = async () => {

      try {
        const payload = {
          company_id: companyId,
          from_date: format(startDate, "yyyy-MM-dd"),
          to_date: format(endDate, "yyyy-MM-dd"),
        };

        const data = await getIVRFunnelReport(payload);

        exportToExcel(data, `IVR_Funnel_Report_${payload.from_date}_to_${payload.to_date}.xlsx`);

      } catch (error) {
        console.error("Error exporting IVR Funnel Report:", error);
      }
  };


  return (
    <div className="row gy-4 gx-3">
      {/* OB CDR REPORT CARD */}
      <div className="card p-4 mb-4">
        <h5 className="mb-3">IVR FUNNEL REPORT</h5>
        <div className="d-flex flex-wrap align-items-center gap-2">
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
        </div>
      </div>
    </div>
  );
};

export default IVRFunnelReport;