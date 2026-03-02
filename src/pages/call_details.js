import React, {  useEffect, useState  } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import api from "../api";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../styles/loader.css";



function CallDetails() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const formattedStart = startDate ? format(startDate, "yyyy-MM-dd") : null;
  const formattedEnd = endDate ? format(endDate, "yyyy-MM-dd") : null;


  const [scenarioList, setScenarioList] = useState([]);       // Level 1
  const [scenario1List, setScenario1List] = useState([]);     // Level 2
  const [scenario2List, setScenario2List] = useState([]);     // Level 3
  const [scenario3List, setScenario3List] = useState([]);     // Level 4
  const [scenario4List, setScenario4List] = useState([]);     // Level 5

  const [selectedScenario, setSelectedScenario] = useState("");   // Level 1
  const [selectedScenario1, setSelectedScenario1] = useState(""); // Level 2
  const [selectedScenario2, setSelectedScenario2] = useState(""); // Level 3
  const [selectedScenario3, setSelectedScenario3] = useState(""); // Level 4
  const companyId = localStorage.getItem("company_id");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);


    const customColStyle = {
        flex: "0 0 auto",
        width: "19.666667%"
      };


   useEffect(() => {
  api
    .get("/core_api/categories/level1?client_id=301")
    .then((res) => {
      setScenarioList(res.data);
    })
    .catch((err) => {
      console.error("Error fetching level1 scenarios:", err);
    });
}, []);

    // Load Level 2 based on Level 1
   const handleScenarioChange = (e) => {
    const selectedId = e.target.value;
    setSelectedScenario(selectedId);
    setScenario1List([]);
    setScenario2List([]);
    setScenario3List([]);
    setScenario4List([]);
    setSelectedScenario1("");
    setSelectedScenario2("");
    setSelectedScenario3("");

    if (selectedId) {
      api
        .get(`/core_api/categories/level2/${selectedId}?client_id=${companyId}`)
        .then((res) => setScenario1List(res.data))
        .catch((err) => console.error("Error loading level2:", err));
    }
  };

   // Load Level 3 based on Level 2
  const handleScenario1Change = (e) => {
    const selectedId = e.target.value;
    setSelectedScenario1(selectedId);
    setScenario2List([]);
    setScenario3List([]);
    setScenario4List([]);
    setSelectedScenario2("");
    setSelectedScenario3("");

    if (selectedId) {
      api
        .get(`/core_api/categories/level3/${selectedId}?client_id=${companyId}`)
        .then((res) => setScenario2List(res.data))
        .catch((err) => console.error("Error loading level3:", err));
    }
  };

  // Load Level 4 based on Level 3
  const handleScenario2Change = (e) => {
    const selectedId = e.target.value;
    setSelectedScenario2(selectedId);
    setScenario3List([]);
    setScenario4List([]);
    setSelectedScenario3("");

    if (selectedId) {
      api
        .get(`/core_api/categories/level4/${selectedId}?client_id=${companyId}`)
        .then((res) => setScenario3List(res.data))
        .catch((err) => console.error("Error loading level4:", err));
    }
  };

  // Load Level 5 based on Level 4
  const handleScenario3Change = (e) => {
    const selectedId = e.target.value;
    setSelectedScenario3(selectedId);
    setScenario4List([]);

    if (selectedId) {
      api
        .get(`/core_api/categories/level5/${selectedId}?client_id=${companyId}`)
        .then((res) => setScenario4List(res.data))
        .catch((err) => console.error("Error loading level5:", err));
    }
  };

  // handleViewClick data
   const handleViewClick = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
    setLoading(true);

    const formattedStart = format(startDate, "yyyy-MM-dd");
    const formattedEnd = format(endDate, "yyyy-MM-dd");

    try {
      const response = await api.get(
        `/call/call-master/${companyId}`,
        {
          params: {
            client_id: companyId,
            from_date: formattedStart,
            to_date: formattedEnd,
          },
        }
      );
      setData(response.data);
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("API call failed:", error);
    }
    finally {
      setLoading(false);
    }
  };


  const handleExportToExcel = () => {
  if (data.length === 0) {
    alert("No data to export.");
    return;
  }

  // Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

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
  saveAs(file, "report.xlsx");
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

    <div class="col-12">
  <div class="card">
    <h5 class="card-header">In Call Details</h5>
    <div class="card-body">
      <div class="row g-3">

       <div style={customColStyle} className="col-md-6 col-sm-12">
        <label className="form-label" htmlFor="start-date">Start Date</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="dd-MM-yyyy"
          placeholderText="DD-MM-YYYY"
          className="form-control"
          id="start-date"
          maxDate={endDate}
        />
      </div>

      <div style={customColStyle} className="col-md-6 col-sm-12">
        <label className="form-label" htmlFor="end-date">End Date</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="dd-MM-yyyy"
          placeholderText="DD-MM-YYYY"
          className="form-control"
          id="end-date"
          minDate={startDate}
        />
      </div>


        <div  style={customColStyle} class=" col-md-6 col-sm-12">
          <label class="form-label" for="in-call-action">In Call Action</label>
          <select id="in-call-action" class="form-select">
            <option value="In Call Action">In Call Action</option>
            <option value="Pending">Pending</option>
          </select>
        </div>


        <div  style={customColStyle} class=" col-md-6 col-sm-12">
          <label class="form-label" for="first-id">First In Call Id</label>
          <input type="text" id="first-id" class="form-control prefix-mask" />
        </div>


        <div style={customColStyle} class=" col-md-6 col-sm-12">
          <label class="form-label" for="last-id">Last In Call Id</label>
          <input type="text" id="last-id" class="form-control prefix-mask" />
        </div>



      {/* Scenario (Level 1) Dropdown */}
      <div style={customColStyle} class=" col-md-6 col-sm-12">
        <label className="form-label" htmlFor="scenario-main">Select Scenario</label>
        <select id="scenario-main" className="form-select" value={selectedScenario} onChange={handleScenarioChange}>
          <option value="">Select Scenario</option>
          {scenarioList.map((item) => (
            <option key={item.id} value={item.id}>{item.ecrName}</option>
          ))}
        </select>
      </div>

      {/* Scenario1 (Level 2) */}
      <div style={customColStyle} class=" col-md-6 col-sm-12">
        <label className="form-label">Select Scenario1</label>
        <select className="form-select" value={selectedScenario1} onChange={handleScenario1Change}>
          <option value="">Select Scenario1</option>
          {scenario1List.map((item) => (
            <option key={item.id} value={item.id}>{item.ecrName}</option>
          ))}
        </select>
      </div>


        <div style={customColStyle} class=" col-md-6 col-sm-12">
        <label className="form-label">Select Scenario2</label>
        <select className="form-select" value={selectedScenario2} onChange={handleScenario2Change}>
          <option value="">Select Scenario2</option>
          {scenario2List.map((item) => (
            <option key={item.id} value={item.id}>{item.ecrName}</option>
          ))}
        </select>
      </div>

      {/* Scenario3 (Level 4) */}
      <div style={customColStyle} class=" col-md-6 col-sm-12">
        <label className="form-label">Select Scenario3</label>
        <select className="form-select" value={selectedScenario3} onChange={handleScenario3Change}>
          {/* <option value="">Select Scenario3</option> */}
          <option value="">All</option>
          {scenario3List.map((item) => (
            <option key={item.id} value={item.id}>{item.ecrName}</option>
          ))}
        </select>
      </div>

      {/* Scenario4 (Level 5) */}
      <div style={customColStyle} class=" col-md-6 col-sm-12">
        <label className="form-label">Select Scenario4</label>
        <select className="form-select">
         {/* <option value="">Select Scenario4</option> */}
          <option value="">All</option>
          {scenario4List.map((item) => (
            <option key={item.id} value={item.id}>{item.ecrName}</option>
          ))}
        </select>
      </div>


        <div class="col-12">
          <div class="d-flex justify-content-center mt-3">
            <button
              type="button"
              className="btn btn-primary me-2 px-4 py-2"
              onClick={handleExportToExcel}
            >
              Export
            </button>

            <button
              type="button"
              className="btn btn-primary me-2 px-4 py-2"
              onClick={handleViewClick}
            >
              View
            </button>
            <button type="submit" class="btn btn-primary px-4 py-2">Closeloop</button>
          </div>
        </div>

        {/* Optional: Render response */}
      {!loading && data.length > 0 && (
      <div className="col-12 mt-4">
        <div
          className="table-responsive"
          style={{ maxHeight: "550px", overflowX: "auto", overflowY: "auto" }}
        >
          <table className="table table-bordered table-striped">
            <thead className="table-dark"  style={{ position: "sticky", top: 0, zIndex: 2 }}>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {Object.keys(row).map((key) => (
                    <td key={key}>{row[key] ?? "-"}</td>
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
</div>
</>

  );
}

export default CallDetails;
