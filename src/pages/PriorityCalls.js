import React, { useState } from "react";
import { Card, CardHeader, CardBody, Button, Input } from "reactstrap";
import api from "../api";
import { format } from "date-fns";
import "../styles/loader.css";

const PriorityCalls = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const companyId = localStorage.getItem("company_id");

  const handleViewClick = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    setLoading(true);

    try {
      const formattedStart = format(new Date(startDate), "yyyy-MM-dd");
      const formattedEnd = format(new Date(endDate), "yyyy-MM-dd");

      const response = await api.get("/call/priority_calls", {
        params: {
          client_id: companyId,
          start_time: formattedStart,
          end_time: formattedEnd,
        },
      });

      setData(response.data);
      console.log("Priority Call Data:", response.data);
    } catch (error) {
      console.error("Failed to fetch priority calls:", error);
      alert("Error fetching priority calls");
    } finally {
      setLoading(false);
    }
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
          <h4 className="fw-bold py-2">Priority Calls</h4>

          <Card>
            <CardHeader>Priority Calls Filter</CardHeader>
            <CardBody>
              <form
                className="d-flex flex-wrap gap-2 align-items-center"
                onSubmit={handleViewClick}
              >
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ maxWidth: "200px" }}
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ maxWidth: "200px" }}
                />
                <Button color="primary" type="submit">
                  Submit
                </Button>
              </form>
            </CardBody>
          </Card>

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
    </>
  );
};

export default PriorityCalls;
