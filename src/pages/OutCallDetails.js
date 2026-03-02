import React, { useState, useEffect } from "react";
import {
  getCampaignTypes,
  getCampaigns,
  getAllocations,
  getOutCallDetails
} from '../services/authService';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../styles/loader.css";


export default function OutCallDetails() {
  const [form, setForm] = useState({
        campaignType: "",
        campaign: "",
        allocation: "",
        scenario: "",
        subScenario1: "",
        subScenario2: "",
        subScenario3: "",
        msisdn: "",
        startDate: "",
        endDate: ""
    });

    const [types, setTypes] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [allocs, setAllocs] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showTable, setShowTable] = useState(false);

    const company_id = localStorage.getItem('company_id');

    useEffect(() => {
        if (company_id) {
            getCampaignTypes(company_id)
                .then(res => setTypes(res.data))
                .catch(err => console.error(err));
        }
    }, [company_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === "campaignType") {
            setCampaigns([]);
            setAllocs([]);
            if (value) {
                getCampaigns(company_id, value)
                    .then(res => setCampaigns(res.data))
                    .catch(err => console.error(err));
            }
        }
        if (name === "campaign") {
            setAllocs([]);
            if (value) {
                getAllocations(company_id, value)
                    .then(res => setAllocs(res.data))
                    .catch(err => console.error(err));
            }
        }
    };

    const handleView = async (e) => {
        e.preventDefault();

        if (company_id) {
            // Create a sanitized filter object without empty strings
            const sanitizedFilters = {};
            for (const key in form) {
                if (form[key] !== "") {
                    sanitizedFilters[key] = form[key];
                }
            }

            setLoading(true);
            try {
                const res = await getOutCallDetails(company_id, sanitizedFilters);
                setData(res);
                setShowTable(true);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };


    const handleExport = (e) => {
        e.preventDefault();
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
        saveAs(file, "out_call_details.xlsx");
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
    <div className="card p-4">
      <h5 className="mb-4">Out Call Details</h5>
      <form onSubmit={handleView}>
      <div className="row mb-3">
        <div className="col-md-3 mb-2">
          <select
              className="form-select"
              name="campaignType"
              value={form.campaignType}
              onChange={handleChange}
            >
              <option value="">Select Campaign Type</option>
              {Array.isArray(types) && types.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
        </div>
        <div className="col-md-3 mb-2">
          <select
              className="form-select"
              name="campaign"
              value={form.campaign}
              onChange={handleChange}
              disabled={!campaigns.length}
            >
              <option value="">Select Campaign</option>
              {campaigns.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
        </div>
        <div className="col-md-3 mb-2">
          <select
              className="form-select"
              name="allocation"
              value={form.allocation}
              onChange={handleChange}
              disabled={!allocs.length}
            >
              <option value="">Select Allocation</option>
              {allocs.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
        </div>
        <div className="col-md-3 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Select Scenario"
            name="scenario"
            value={form.scenario}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-3 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Select Sub Scenario 1"
            name="subScenario1"
            value={form.subScenario1}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Select Sub Scenario 2"
            name="subScenario2"
            value={form.subScenario2}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Select Sub Scenario 3"
            name="subScenario3"
            value={form.subScenario3}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="MSISDN"
            name="msisdn"
            value={form.msisdn}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-3 mb-2">
          <input
            type="date"
            className="form-control"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3 mb-2">
          <input
            type="date"
            className="form-control"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 d-flex gap-2">
          <button className="btn btn-primary" onClick={handleExport}>
            Export
          </button>
          <button type="submit" className="btn btn-primary">
            View
          </button>
        </div>
      </div>
      </form>

      {!loading && showTable && (
      <div className="card p-4">
      <div className="table-responsive" style={{ maxHeight: "500px", overflow: "auto" }}>
        <table className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              <th>View</th>
              <th>Recording</th>
              <th>Out Call ID</th>
              <th>Call From</th>
              <th>Scenarios</th>
              <th>Sub Scenarios 1</th>
              <th>Name</th>
              <th>Contact Number</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <button className="btn btn-sm btn-outline-primary">
                        🔍
                      </button>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-secondary">
                        ⏬
                      </button>
                    </td>
                    <td>{row.id}</td>
                    <td>{row.callFrom}</td>
                    <td>{row.scenario}</td>
                    <td>{row.subScenario1}</td>
                    <td>{row.name}</td>
                    <td>{row.contactNumber}</td>
                    {/* Add more cells as needed */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="23" className="text-center">
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
}








// import React, { useState, useEffect } from "react";
// import {
//   getCampaignTypes,
//   getCampaigns,
//   getAllocations,
//   getOutCallDetails
// } from '../services/authService';
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import "../styles/loader.css";


// export default function OutCallDetails() {
//   const [form, setForm] = useState({
//         campaignType: "",
//         campaign: "",
//         allocation: "",
//         scenario: "",
//         subScenario1: "",
//         subScenario2: "",
//         subScenario3: "",
//         msisdn: "",
//         startDate: "",
//         endDate: ""
//     });

//     const [types, setTypes] = useState([]);
//     const [campaigns, setCampaigns] = useState([]);
//     const [allocs, setAllocs] = useState([]);
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showTable, setShowTable] = useState(false);

//     // const company_id = localStorage.getItem('company_id');
//     // Get company_id from localStorage
//        const company_id_raw = localStorage.getItem("company_id");
//        const company_id = Number(company_id_raw);

//     // useEffect(() => {
//     //     if (company_id) {
//     //         getCampaignTypes(company_id)
//     //             .then(res => setTypes(res.data))
//     //             .catch(err => console.error(err));
//     //     }
//     // }, [company_id]);

//     useEffect(() => {
//     if (Number.isInteger(company_id)) {
//       getCampaignTypes(company_id)
//         .then(res => setTypes(res.data))
//         .catch(err => console.error(err));
//     }
//   }, [company_id]);


//     // const handleChange = (e) => {
//     //     const { name, value } = e.target;
//     //     setForm((prev) => ({ ...prev, [name]: value }));

//     //     if (name === "campaignType") {
//     //         setCampaigns([]);
//     //         setAllocs([]);
//     //         // if (value) {
//     //         //     getCampaigns(company_id, value)
//     //         //         .then(res => setCampaigns(res.data))
//     //         //         .catch(err => console.error(err));
//     //         // }
//     //            if (value && company_id) {
//     //               getCampaigns(company_id, value)
//     //                   .then(res => setCampaigns(res.data))
//     //                   .catch(err => console.error(err));
//     //            }
//     //     }
//     //     if (name === "campaign") {
//     //         setAllocs([]);
//     //         // if (value) {
//     //         //     getAllocations(company_id, value)
//     //         //         .then(res => setAllocs(res.data))
//     //         //         .catch(err => console.error(err));
//     //         // }
//     //          if (value && company_id) {
//     //                getAllocations(company_id, value)
//     //                   .then(res => setAllocs(res.data))
//     //                   .catch(err => console.error(err));
//     //           }
//     //     }
//     // };


//      const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));

//     if (name === "campaignType" && company_id) {
//       setCampaigns([]);
//       setAllocs([]);
//       if (value) {
//         getCampaigns(company_id, value)
//           .then(res => setCampaigns(res.data))
//           .catch(err => console.error(err));
//       }
//     }

//     if (name === "campaign" && company_id) {
//       setAllocs([]);
//       if (value) {
//         getAllocations(company_id, value)
//           .then(res => setAllocs(res.data))
//           .catch(err => console.error(err));
//       }
//     }
//   };

//     // const handleView = async (e) => {
//     //     e.preventDefault();

//     //      if (!company_id) {
//     //          alert("Company ID is missing. Please login again.");
//     //          return;
//     //     }

//     //         // Create a sanitized filter object without empty strings
//     //         const sanitizedFilters = {};
//     //         for (const key in form) {
//     //             if (form[key] !== "") {
//     //                 sanitizedFilters[key] = form[key];
//     //             }
//     //         }

//     //         setLoading(true);
//     //         try {
//     //             const res = await getOutCallDetails(company_id, sanitizedFilters);
//     //             setData(res);
//     //             setShowTable(true);
//     //         } catch (err) {
//     //             console.error(err);
//     //         } finally {
//     //             setLoading(false);
//     //         }
       
//     // };

// const handleView = async (e) => {
//     e.preventDefault();

//     if (!Number.isInteger(company_id)) {
//       alert("Company ID is missing or invalid. Please login again.");
//       return;
//     }

//     // Remove empty filters
//     const sanitizedFilters = {};
//     for (const key in form) {
//       if (form[key] !== "") {
//         sanitizedFilters[key] = form[key];
//       }
//     }

//     setLoading(true);
//     try {
//       // ✅ Ensure company_id sent as integer query param
//       const res = await getOutCallDetails(company_id, sanitizedFilters);
//       setData(res);
//       setShowTable(true);
//     } catch (err) {
//       console.error("Error fetching out call details:", err);
//     } finally {
//       setLoading(false);
//     }
//   };


//     const handleExport = (e) => {
//         e.preventDefault();
//         if (data.length === 0) {
//             alert("No data to export.");
//             return;
//         }

//           // Create a worksheet
//         const worksheet = XLSX.utils.json_to_sheet(data);

//           // Create a new workbook and append the worksheet
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

//           // Generate a buffer
//         const excelBuffer = XLSX.write(workbook, {
//             bookType: "xlsx",
//             type: "array",
//         });

//           // Save file
//         const file = new Blob([excelBuffer], {
//             type: "application/octet-stream",
//         });
//         saveAs(file, "out_call_details.xlsx");
//     };

//   return (
//   <>
//       {loading && (
//         <div className="loader-overlay">
//           <div className="bar"></div>
//           <div className="bar"></div>
//           <div className="bar"></div>
//           <div className="bar"></div>
//           <div className="bar"></div>
//         </div>
//       )}

//     <div className={`priority-wrapper ${loading ? "blurred" : ""}`}>
//     <div className="card p-4">
//       <h5 className="mb-4">Out Call Details</h5>
//       <form onSubmit={handleView}>
//       <div className="row mb-3">
//         <div className="col-md-3 mb-2">
//           <select
//               className="form-select"
//               name="campaignType"
//               value={form.campaignType}
//               onChange={handleChange}
//             >
//               <option value="">Select Campaign Type</option>
//               {Array.isArray(types) && types.map(t => (
//                 <option key={t.id} value={t.id}>{t.name}</option>
//               ))}
//             </select>
//         </div>
//         <div className="col-md-3 mb-2">
//           <select
//               className="form-select"
//               name="campaign"
//               value={form.campaign}
//               onChange={handleChange}
//               disabled={!campaigns.length}
//             >
//               <option value="">Select Campaign</option>
//               {campaigns.map(c => (
//                 <option key={c.id} value={c.id}>{c.name}</option>
//               ))}
//             </select>
//         </div>
//         <div className="col-md-3 mb-2">
//           <select
//               className="form-select"
//               name="allocation"
//               value={form.allocation}
//               onChange={handleChange}
//               disabled={!allocs.length}
//             >
//               <option value="">Select Allocation</option>
//               {allocs.map(a => (
//                 <option key={a.id} value={a.id}>{a.name}</option>
//               ))}
//             </select>
//         </div>
//         <div className="col-md-3 mb-2">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Select Scenario"
//             name="scenario"
//             value={form.scenario}
//             onChange={handleChange}
//           />
//         </div>
//       </div>

//       <div className="row mb-3">
//         <div className="col-md-3 mb-2">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Select Sub Scenario 1"
//             name="subScenario1"
//             value={form.subScenario1}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="col-md-3 mb-2">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Select Sub Scenario 2"
//             name="subScenario2"
//             value={form.subScenario2}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="col-md-3 mb-2">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Select Sub Scenario 3"
//             name="subScenario3"
//             value={form.subScenario3}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="col-md-3 mb-2">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="MSISDN"
//             name="msisdn"
//             value={form.msisdn}
//             onChange={handleChange}
//           />
//         </div>
//       </div>

//       <div className="row mb-3">
//         <div className="col-md-3 mb-2">
//           <input
//             type="date"
//             className="form-control"
//             name="startDate"
//             value={form.startDate}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="col-md-3 mb-2">
//           <input
//             type="date"
//             className="form-control"
//             name="endDate"
//             value={form.endDate}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="col-md-6 d-flex gap-2">
//           <button className="btn btn-primary" onClick={handleExport}>
//             Export
//           </button>
//           <button type="submit" className="btn btn-primary">
//             View
//           </button>
//         </div>
//       </div>
//       </form>

//       {!loading && showTable && (
//       <div className="card p-4">
//       <div className="table-responsive" style={{ maxHeight: "500px", overflow: "auto" }}>
//         <table className="table table-bordered table-sm">
//           <thead className="table-light">
//             <tr>
//               <th>View</th>
//               <th>Recording</th>
//               <th>Out Call ID</th>
//               <th>Call From</th>
//               <th>Scenarios</th>
//               <th>Sub Scenarios 1</th>
//               <th>Name</th>
//               <th>Contact Number</th>
//               {/* Add more columns as needed */}
//             </tr>
//           </thead>
//           <tbody>
//               {Array.isArray(data) && data.length > 0 ? (
//                 data.map((row, idx) => (
//                   <tr key={idx}>
//                     <td>
//                       <button className="btn btn-sm btn-outline-primary">
//                         🔍
//                       </button>
//                     </td>
//                     <td>
//                       <button className="btn btn-sm btn-outline-secondary">
//                         ⏬
//                       </button>
//                     </td>
//                     <td>{row.id}</td>
//                     <td>{row.callFrom}</td>
//                     <td>{row.scenario}</td>
//                     <td>{row.subScenario1}</td>
//                     <td>{row.name}</td>
//                     <td>{row.contactNumber}</td>
//                     {/* Add more cells as needed */}
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="23" className="text-center">
//                     No data available for selected date range.
//                   </td>
//                 </tr>
//               )}
//             </tbody>

//         </table>
//       </div>
//       </div>
//       )}
//     </div>
//     </div>
//     </>
//   );
// }
