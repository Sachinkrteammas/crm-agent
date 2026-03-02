//...Table with Pagination and Search bar..///
import React, { useState, useEffect } from "react";
import axios from "axios";
import WizardForm from "./company-registration"; // make sure the path is correct
import "../styles/stepper.css";

export default function ClientRequestPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCompany, setEditingCompany] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtered, setFiltered] = useState([]);
  const [filterType, setFilterType] = useState("company_name");

  // Fetch all companies
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:8000/company/list");
      setCompanies(res.data.data || []);
    } catch (err) {
      console.error("Error fetching companies:", err);
      alert("Failed to fetch companies.");
    } finally {
      setLoading(false);
    }
  };

  // Filter companies based on search
  // useEffect(() => {
  //   const filteredData = companies.filter((company) =>
  //     Object.values(company).some((val) =>
  //       val?.toString().toLowerCase().includes(search.toLowerCase())
  //     )
  //   );
  //   setFiltered(filteredData);
  //   setCurrentPage(1); // Reset page when search changes
  // }, [search, companies]);

  useEffect(() => {
    const searchLower = search.toLowerCase();

    const filteredData = companies.filter((company) => {
      if (filterType === "company_name") {
        return company.company_name?.toLowerCase().includes(searchLower);
      }
      if (filterType === "status") {
        return company.status?.toLowerCase().includes(searchLower);
      }
      if (filterType === "auth_person") {
        return company.auth_person?.toLowerCase().includes(searchLower);
      }
      return true;
    });

    setFiltered(filteredData);
    setCurrentPage(1); // reset page when search changes
  }, [search, filterType, companies]);

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Handle edit button click
  const handleEdit = async (companyId) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/company/get/${companyId}`
      );
      if (res.data.status === "success" && res.data.data) {
        setEditingCompany(res.data.data);
        setShowForm(true);
      } else {
        alert("Company not found!");
      }
    } catch (err) {
      console.error("Fetch company by ID failed:", err);
      alert("Failed to fetch company details.");
    }
  };

  // Close form modal
  const handleFormClose = () => {
    setEditingCompany(null);
    setShowForm(false);
  };

  // Submit form (create or update)
  const handleFormSubmit = async (formData) => {
    try {
      const isEdit = !!editingCompany;
      const url = isEdit
        ? `http://localhost:8000/company/update/${editingCompany.company_id}`
        : "http://localhost:8000/company/register";

      await axios({
        method: isEdit ? "put" : "post",
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(
        isEdit
          ? "✅ Company updated successfully!"
          : "✅ Company created successfully!"
      );
      fetchCompanies();
      handleFormClose();
    } catch (err) {
      console.error("Error saving company:", err.response || err);
      alert("❌ Failed to save company.");
    }
  };

  return (
    <div className="mt-4">
      <h3>Company List</h3>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Search and page size */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              Show{" "}
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="form-select d-inline-block w-auto"
              >
                {[ 50, 100, 200].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>{" "}
            </div>
            <div className="d-flex">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="form-select me-2"
              >
                <option value="company_name">Company Name</option>
                <option value="auth_person">Client Name</option>
                <option value="status">Request Status</option>
              </select>
              <input
                type="text"
                placeholder={`Search by ${filterType.replace("_", " ")}`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-control form-control-sm"
              />
            </div>
          </div>

          {/* Table */}
          <div
            className="table-responsive"
            style={{ maxHeight: "600px", overflowY: "auto" }}
          >
            <table className="table table-bordered table-hover table-striped">
              <thead className="table-light">
                <tr>
                  <th style={{ minWidth: "40px" }}>SRN.</th>
                  <th style={{ minWidth: "150px" }}>COMPANY NAME</th>
                  <th style={{ minWidth: "120px" }}>CLIENT NAME</th>
                  <th style={{ minWidth: "120px" }}>REQUEST TYPE</th>
                  <th style={{ minWidth: "120px" }}>REQUEST STATUS</th>
                  <th style={{ minWidth: "120px" }}>REQUEST DATA</th>
                  <th style={{ minWidth: "120px" }}>REQUEST DATE</th>
                  <th style={{ minWidth: "120px" }}>RESPONSE DATE</th>
                  <th style={{ minWidth: "80px" }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((company, index) => (
                    <tr key={company.company_id}>
                      <td>{(currentPage - 1) * pageSize + index + 1}</td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: "150px" }}
                      >
                        {company.company_name}
                      </td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: "120px" }}
                      >
                        {company.auth_person}
                      </td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: "120px" }}
                      >
                        {company.email}
                      </td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: "120px" }}
                      >
                        {company.status}
                      </td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: "120px" }}
                      >
                        {company.state}
                      </td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: "120px" }}
                      >
                        {company.create_date}
                      </td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: "120px" }}
                      >
                        {company.response_date || "N/A"}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEdit(company.company_id)}
                          title="Edit"
                        >
                          ✏ Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center text-muted">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing{" "}
              {paginatedData.length ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
              {(currentPage - 1) * pageSize + paginatedData.length} of{" "}
              {filtered.length} entries
            </div>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
                    <li
                      key={num}
                      className={`page-item ${
                        num === currentPage ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(num)}
                      >
                        {num}
                      </button>
                    </li>
                  )
                )}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}

      {/* Edit/Create modal */}
      {showForm && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 9999,
            overflow: "auto",
          }}
        >
          <div
            className="modal-dialog modal-xl" // <-- wider modal
            style={{ marginTop: "50px" }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCompany ? "Edit Company" : "Add Company"}
                </h5>
                <button
                  className="btn-close"
                  onClick={handleFormClose}
                ></button>
              </div>
              <div className="modal-body">
                <WizardForm
                  key={editingCompany ? editingCompany.company_id : "new"}
                  initialData={editingCompany}
                  isEdit={!!editingCompany}
                  onSubmit={handleFormSubmit}
                  onClose={handleFormClose}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
