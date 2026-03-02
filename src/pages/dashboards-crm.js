import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  getDashboardReport,
  getActiveServices,
  getCallAnalysisReport,
  getCallDistributionReport,
  getTicketCaseAnalysis,
  getTicketBySource,
} from "../services/authService";
import api from "../api";

const Dashboard = () => {
    const companyId = localStorage.getItem("company_id");
  const userType = localStorage.getItem("user_type");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");

  const [dateRange, setDateRange] = useState("today");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    answered: 0,
    abandon: 0,
    tagged: 0,
    abandon_callback: 0,
  });

  const [data, setData] = useState([
    { name: "Answered", value: 0 },
    { name: "Abandon", value: 0 },
  ]);

  const [callData, setCallData] = useState([]);

  const [plan, setPlan] = useState(null);

  const [ticketCaseData, setTicketCaseData] = useState([]);
  const [openCloseTicketData, setOpenCloseTicketData] = useState([]);

  const [ticketSourceData, setTicketSourceData] = useState([]);

  useEffect(() => {
    const today = new Date();
    const format = (date) => date.toISOString().split("T")[0];

      // Auto-select client for non-admin users once clients are loaded
  // useEffect(() => {
  //   if (userType !== "Super-Admin" && clients.length > 0) {
  //     setSelectedClient(companyId);
  //   }
  // }, [userType, clients, companyId]);



    switch (dateRange) {
      case "today":
        setFromDate(format(today));
        setToDate(format(today));
        break;
      case "yesterday":
        const y = new Date(today);
        y.setDate(today.getDate() - 1);
        setFromDate(format(y));
        setToDate(format(y));
        break;
      case "weekly":
        const w = new Date(today);
        w.setDate(today.getDate() - 6);
        setFromDate(format(w));
        setToDate(format(today));
        break;
      case "monthly":
        const m = new Date(today);
        m.setDate(today.getDate() - 30);
        setFromDate(format(m));
        setToDate(format(today));
        break;
      case "custom":
        // Let user manually input
        break;
    }
  }, [dateRange]);

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };

  
  const fetchCallAnalysis = async () => {
    if (!selectedClient) return;

    try {
      const payload = {
        company_id: selectedClient,
        view_type: dateRange.charAt(0).toUpperCase() + dateRange.slice(1),
        from_date: fromDate || null,
        to_date: toDate || null,
      };
      const res = await getCallAnalysisReport(payload);
      setData([
        { name: "Answered", value: res.answered },
        { name: "Abandon", value: res.abandon },
      ]);
    } catch (err) {
      console.error("Failed to load call analysis", err);
    }
  };

  const fetchCallDistribution = async () => {
    if (!selectedClient) return;
    try {
      const payload = {
        company_id: selectedClient,
        view_type: dateRange.charAt(0).toUpperCase() + dateRange.slice(1),
        from_date: fromDate || null,
        to_date: toDate || null,
      };
      const data = await getCallDistributionReport(payload);
      setCallData(data);
    } catch (err) {
      console.error("Failed to fetch call distribution report", err);
    }
  };

  useEffect(() => {
    if (!selectedClient || !fromDate || !toDate) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchDashboardData(),
          fetchCallAnalysis(),
          fetchCallDistribution(),
          fetchData(),
          fetchTicketBySource(),
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [selectedClient, fromDate, toDate]);

  const fetchDashboardData = async () => {
    try {
      const payload = {
        company_id: Number(selectedClient),
        view_type: dateRange.charAt(0).toUpperCase() + dateRange.slice(1),
        from_date: fromDate,
        to_date: toDate,
      };

      const { days, total_tagged, total_abandon_cb } = await getDashboardReport(
        payload
      );

      const answered = days.reduce((sum, d) => sum + (d.Answered ?? 0), 0);
      const abandon = days.reduce((sum, d) => sum + (d.Abandon ?? 0), 0);

      setDashboardData({
        answered,
        abandon,
        tagged: total_tagged,
        abandon_callback: total_abandon_cb,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchData = async () => {
    if (!selectedClient) return;
    const viewType = dateRange.charAt(0).toUpperCase() + dateRange.slice(1);

    const payload = {
      company_id: selectedClient,
      view_type: dateRange.charAt(0).toUpperCase() + dateRange.slice(1),
      from_date: fromDate || null,
      to_date: toDate || null,
    };

    try {
      const { cases, open_tat, close_tat } = await getTicketCaseAnalysis(
        payload
      );

      setTicketCaseData(cases);
      setOpenCloseTicketData([
        {
          name: "Open",
          InTAT: open_tat[0]?.InTAT ?? 0,
          OutOfTAT: open_tat[0]?.OutOfTAT ?? 0,
        },
        {
          name: "Close",
          InTAT: close_tat[0]?.InTAT ?? 0,
          OutOfTAT: close_tat[0]?.OutOfTAT ?? 0,
        },
      ]);
    } catch (err) {
      console.error("Failed to load Ticket Case Analysis", err);
    }
  };

  const fetchTicketBySource = async () => {
    if (!selectedClient) return;

    try {
      const payload = {
        company_id: selectedClient,
        view_type: dateRange.charAt(0).toUpperCase() + dateRange.slice(1),
        from_date: fromDate || null,
        to_date: toDate || null,
      };
      const data = await getTicketBySource(payload);
      setTicketSourceData(data);
    } catch (err) {
      console.error("Failed to load Ticket By Source", err);
    }
  };

  //   useEffect(() => {
  //   const fetchClients = async () => {
  //     try {
  //       const res = await api.get("/agents/clients-rights"); // 👈 use api
  //       setClients(res.data);
  //     } catch (err) {
  //       console.error("Error fetching clients:", err);
  //     }
  //   };

  //   fetchClients();
  // }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get("/agents/clients-rights");

        // Sort alphabetically (case-insensitive)
        const sortedClients = res.data.sort((a, b) =>
          a.company_name.localeCompare(b.company_name, "en", {
            sensitivity: "base",
          })
        );

        setClients(sortedClients);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    };

    fetchClients();
  }, []);

 useEffect(() => {
    if (userType !== "Super-Admin" && clients.length > 0) {
      setSelectedClient(companyId);
    }
  }, [userType, clients, companyId]);


  useEffect(() => {
    const fetchPlan = async () => {
      if (!selectedClient) {
        // use selectedClient instead of companyId
        setPlan(null);
        return;
      }
      try {
        const data = await getActiveServices(parseInt(selectedClient, 10));
        setPlan(data);
      } catch (err) {
        console.error("Failed to load active services", err);
        setPlan(null);
      } finally {
      }
    };

    fetchPlan();
  }, [selectedClient]);

  const COLORS = ["#36A2EB", "#4BC0C0"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await Promise.all([
        fetchDashboardData(),
        fetchCallAnalysis(),
        fetchCallDistribution(),
        fetchData(),
        fetchTicketBySource(),
      ]);
    } catch (error) {
      console.error("Error during submission data fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="row mb-4">
        <div className="col-md-4">
      {userType === "Super-Admin" ? (
        <>
          <label className="form-label fw-semibold">Select Client</label>
          <select
            className="form-select"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">-- Select Client --</option>
            {clients.map((client) => (
              <option key={client.company_id} value={String(client.company_id)}>
                {client.company_name}
              </option>
            ))}
          </select>
        </>
      ) : (
        <p>
          {/* Dashboard loaded for your company:{" "} */}
          {/* {clients.find((c) => c.company_id === Number(companyId))?.company_name ||
            "Unknown"} */}
        </p>
      )}

        </div>
      </div>

      {/* Show placeholders depending on state */}
      {!selectedClient ? (
        <div className="card h-100">
          <div className="card-body">Please select a client</div>
        </div>
      ) : (
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
              {/* Sales last year */}

              <div className="col-xxl-2 col-md-3 col-6">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="badge p-2 bg-label-success rounded">
                        <i className="icon-base ti tabler-phone-incoming icon-28px"></i>
                      </div>
                      <small className="text-success fw-medium">+12.6%</small>
                    </div>
                    <h5 className="card-title mb-1">Total Answered Calls</h5>
                    <h4 className="mb-0">
                      {dashboardData.answered.toLocaleString()}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Sessions Last month */}
              <div className="col-xxl-2 col-md-3 col-6">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="badge p-2 bg-label-danger rounded">
                        <i className="icon-base ti tabler-phone-off icon-28px"></i>
                      </div>
                      <small className="text-danger fw-medium">-16.2%</small>
                    </div>
                    <h5 className="card-title mb-1">Total Abandon Calls</h5>
                    <h4 className="mb-0">
                      {dashboardData.abandon.toLocaleString()}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Total Profit */}
              <div className="col-xxl-2 col-md-3 col-6">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="badge p-2 bg-label-warning rounded">
                        <i className="icon-base ti tabler-tag icon-28px"></i>
                      </div>
                      <small className="text-danger fw-medium">-12.2%</small>
                    </div>
                    <h5 className="card-title mb-1">Total Tagged Calls</h5>
                    <h4 className="mb-0">
                      {dashboardData.tagged.toLocaleString()}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Total Sales */}
              <div className="col-xxl-2 col-md-3 col-6">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="badge p-2 bg-label-info rounded">
                        <i className="icon-base ti tabler-phone-calling icon-28px"></i>
                      </div>
                      <small className="text-success fw-medium">+24.5%</small>
                    </div>
                    <h5 className="card-title mb-1">Total Abandon Call Back</h5>
                    <h4 className="mb-0">
                      {dashboardData.abandon_callback.toLocaleString()}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Revenue Growth */}
              <div className="col-xxl-4 col-xl-5 col-md-6 col-sm-8 col-12 mb-md-0">
                <form onSubmit={handleSubmit}>
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title mb-3">Call Filters</h5>

                      <div className="row gx-2 gy-2 align-items-center">
                        {/* Date Range Selection */}
                        <div className="col-12 d-flex flex-wrap gap-2 mb-3">
                          {[
                            "Today",
                            "Yesterday",
                            "Weekly",
                            "Monthly",
                            "Custom",
                          ].map((label, idx) => (
                            <div
                              className="form-check form-check-inline mb-0"
                              key={idx}
                            >
                              <input
                                className="form-check-input"
                                type="radio"
                                name="dateRange"
                                id={`range-${label}`}
                                value={label.toLowerCase()}
                                checked={dateRange === label.toLowerCase()}
                                onChange={handleDateRangeChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`range-${label}`}
                              >
                                {label}
                              </label>
                            </div>
                          ))}
                        </div>

                        {/* Call Type */}
                        <div className="col-sm">
                          <select className="form-select">
                            <option value="inbounds">Inbounds</option>
                            <option value="outbounds">Outbounds</option>
                          </select>
                        </div>

                        {/* Date Pickers */}
                        <div className="col-sm">
                          <input
                            type="date"
                            className="form-control"
                            value={fromDate}
                            readOnly={dateRange !== "custom"}
                            onChange={(e) => setFromDate(e.target.value)}
                          />
                        </div>
                        <div className="col-sm">
                          <input
                            type="date"
                            className="form-control"
                            value={toDate}
                            readOnly={dateRange !== "custom"}
                            onChange={(e) => setToDate(e.target.value)}
                          />
                        </div>

                        {/* Search Button */}
                        <div className="col-sm">
                          <button
                            type="submit"
                            className="btn btn-primary w-100"
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Earning Reports Tabs*/}
              {/* Active Services Table (Vuexy styled) */}
              <div className="col-xxl-8 col-12">
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between">
                    <div className="card-title m-0">
                      <h5 className="mb-1">Active Services</h5>
                      <p className="card-subtitle">
                        Currently Active Plan Details
                      </p>
                    </div>
                  </div>
                  <div className="card-body">
                    {!plan ||
                    (typeof plan === "object" &&
                      Object.keys(plan).length === 0) ? (
                      <div className="text-center text-muted">
                        No active plan found.
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover table-bordered mb-0">
                          <thead className="text-center align-middle">
                            <tr>
                              <th className="bg-label-primary text-primary">
                                My Plan
                              </th>
                              <th>Plan Mode</th>
                              <th className="bg-label-primary text-primary">
                                Credit Value
                              </th>
                              <th>Subscription Value</th>
                              <th className="bg-label-primary text-primary">
                                Inbound Call - Day Charges
                              </th>
                              <th>Inbound Call - Night Charges</th>
                              <th className="bg-label-primary text-primary">
                                Outbound Call Charges
                              </th>
                              <th>SMS Charges</th>
                              <th>Email Charges</th>
                            </tr>
                          </thead>
                          <tbody className="text-center align-middle">
                            <tr>
                              <td className="fw-semibold">{plan.plan_name}</td>
                              <td>{plan.period_type}</td>
                              <td>
                                Rs.{" "}
                                {plan.credit_value.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                              <td>
                                Rs.{" "}
                                {plan.subscription_value.toLocaleString(
                                  undefined,
                                  { minimumFractionDigits: 2 }
                                )}
                              </td>
                              <td>
                                Rs. {plan.inbound_call_day_charge.toFixed(2)} /
                                Min.
                              </td>
                              <td>
                                Rs. {plan.inbound_call_night_charge.toFixed(2)}{" "}
                                / Min.
                              </td>
                              <td>
                                Rs. {plan.outbound_call_charge.toFixed(2)} /
                                Min.
                              </td>
                              <td>{plan.sms_charge.toFixed(2)}</td>
                              <td>{plan.email_charge.toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* </div> */}

              {/* Sales last 6 months */}
              <div className="col-xxl-4 col-lg-6 col-md-12">
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between pb-4">
                    <div className="card-title mb-0">
                      <h5 className="mb-1">Call Analysis</h5>
                      <p className="card-subtitle">Answered vs Abandon</p>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-text-secondary rounded-pill text-body-secondary border-0 p-2 me-n1"
                        type="button"
                        id="callAnalysisMenu"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i className="icon-base ti tabler-dots-vertical icon-md text-body-secondary"></i>
                      </button>
                      <div
                        className="dropdown-menu dropdown-menu-end"
                        aria-labelledby="callAnalysisMenu"
                      >
                        <a className="dropdown-item" href="#">
                          View More
                        </a>
                        <a className="dropdown-item" href="#">
                          Delete
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={data}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                        >
                          {data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index]}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend
                          verticalAlign="top"
                          iconType="circle"
                          align="center"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="col-xxl-4 col-lg-6 col-md-12">
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between align-items-start pb-0">
                    <div className="card-title mb-0">
                      <h5 className="mb-1">Call Answer vs Abandon</h5>
                      <p className="card-subtitle">Daily Call Distribution</p>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-text-secondary btn-icon rounded-pill border-0 p-1"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i className="icon-base ti tabler-dots-vertical icon-md text-body-secondary"></i>
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Download
                        </a>
                        <a className="dropdown-item" href="#">
                          Refresh
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={callData}
                        layout="vertical"
                        margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
                      >
                        <XAxis
                          type="number"
                          domain={[0, 100]}
                          tickFormatter={(tick) => `${tick}%`}
                          stroke="#b4b7bd"
                          fontSize={12}
                        />
                        <YAxis
                          type="category"
                          dataKey="date"
                          stroke="#b4b7bd"
                          fontSize={12}
                        />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend verticalAlign="top" height={36} />
                        <Bar
                          dataKey="Answered"
                          stackId="a"
                          fill="#66bb6a"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="Abandon"
                          stackId="a"
                          fill="#ef5350"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              {/* Last Transaction */}
              <div className="col-xxl-8 col-lg-6 col-md-12">
                <div className="card h-100 shadow-sm rounded-2xl">
                  <div className="card-header d-flex justify-between items-center border-b border-gray-200 p-4">
                    <h5 className="text-lg font-semibold flex items-center gap-2">
                      <i className="ti ti-ticket text-primary"></i>
                      Ticket By Source
                    </h5>
                    <div className="dropdown">
                      <button
                        className="btn btn-sm btn-light rounded-full"
                        type="button"
                        id="ticketBySourceDropdown"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i className="ti ti-dots-vertical text-gray-500"></i>
                      </button>
                      <div
                        className="dropdown-menu dropdown-menu-end"
                        aria-labelledby="ticketBySourceDropdown"
                      >
                        <a className="dropdown-item" href="#">
                          Download
                        </a>
                        <a className="dropdown-item" href="#">
                          Refresh
                        </a>
                        <a className="dropdown-item" href="#">
                          Share
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table mb-0 text-sm">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="font-medium py-3 px-4">Source</th>
                          <th className="font-medium py-3 px-4 text-center">
                            Total
                          </th>
                          <th className="font-medium py-3 px-4 text-center">
                            Open
                          </th>
                          <th className="font-medium py-3 px-4 text-center">
                            Close
                          </th>
                          <th className="font-medium py-3 px-4 text-center">
                            As On Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {ticketSourceData.map((item, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="py-3 px-4 font-medium text-gray-700">
                              {item.source}
                            </td>
                            <td className="py-3 px-4 text-center text-gray-600">
                              {item.total}
                            </td>
                            <td className="py-3 px-4 text-center text-gray-600">
                              {item.open}
                            </td>
                            <td className="py-3 px-4 text-center text-gray-600">
                              {item.close}
                            </td>
                            <td className="py-3 px-4 text-center text-gray-600">
                              {item.as_on_date}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/*/ Last Transaction */}

              {/* Activity Timeline */}
              <div className="col-12">
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between align-items-start pb-0">
                    <div className="card-title mb-0">
                      <h5 className="mb-1">Ticket Case Analysis</h5>
                      <p className="card-subtitle">
                        Current Ticket Distribution
                      </p>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-text-secondary btn-icon rounded-pill border-0 p-1"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i className="icon-base ti tabler-dots-vertical icon-md text-body-secondary"></i>
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Download
                        </a>
                        <a className="dropdown-item" href="#">
                          Refresh
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart
                        data={ticketCaseData}
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke="#b4b7bd" />
                        <YAxis stroke="#b4b7bd" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Enquiry" stackId="a" fill="#6366F1" />
                        <Bar dataKey="Complaint" stackId="a" fill="#EC4899" />
                        <Bar dataKey="BulkOrder" stackId="a" fill="#F59E0B" />
                        <Bar dataKey="Request" stackId="a" fill="#10B981" />
                        <Bar dataKey="Other" stackId="a" fill="#F43F5E" />
                      </BarChart>
                    </ResponsiveContainer>

                    <div className="row mt-4">
                      <div className="col-md-6">
                        <h6 className="text-center mb-2">
                          Open Ticket Analysis
                        </h6>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={openCloseTicketData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="#b4b7bd" />
                            <YAxis stroke="#b4b7bd" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="InTAT" stackId="b" fill="#22D3EE" />
                            <Bar
                              dataKey="OutOfTAT"
                              stackId="b"
                              fill="#FB923C"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="col-md-6">
                        <h6 className="text-center mb-2">
                          Close Ticket Analysis
                        </h6>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={openCloseTicketData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="#b4b7bd" />
                            <YAxis stroke="#b4b7bd" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="InTAT" stackId="c" fill="#22D3EE" />
                            <Bar
                              dataKey="OutOfTAT"
                              stackId="c"
                              fill="#FB923C"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;

