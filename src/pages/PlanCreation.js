import React, { useState, useEffect } from "react";
import axios from "axios";

// Keep your full PlanCreation form state
const initialFormState = {
  planName: "",
  setupFee: "",
  subscriptionAmount: "",
  PlanType: "",
  creditValuePerMode: "",
  creditValue: "",
  ratePerPulseDay: "",
  inboundChargeDay: "",
  pulseDay: "",
  outboundCallCharge: "",
  pulse: "",
  inboundChargeNight: "",
  pulseNight: "",
  emailCharge: "",
  ratePerPulseNight: "",
  ratePerPulse: "",
  smsCharge: "",
  missCallCharge: "",
  ivrCallCharge: "",
  vfoCharge: "",
  chargePerExtraUser: "",
  noOfUsers: "",
  balanceCarry: "",
  firstMinute: 0,
  multiInboundCharge: "",
  pulseMultiLang: "",
  ratePerPulseMultiLang: "",
  multiOutboundCharge: "",
  pulseMultiOutbound: "",
  ratePerPulseMultiOutbound: "",
  multiLiveChat: "",
  whatsappSmsCharge: "",
};

export default function PlanManagement() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [editingPlanId, setEditingPlanId] = useState(null);

  // ✅ New state for View Plan
  const [viewPlan, setViewPlan] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // ✅ Pagination & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://localhost:8000/plan/plans"); // fetch plans
      setPlans(res.data.plans || []);
    } catch (err) {
      console.error("Error fetching plans:", err);
    }
  };

  // Filtered + Paginated Data
  const filteredPlans = plans.filter(
    (plan) =>
      plan.PlanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.PlanType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPlans.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentPlans = filteredPlans.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.planName) newErrors.planName = true;
    if (!form.PlanType) newErrors.PlanType = true;
    const numericFields = [
      "setupFee",
      "subscriptionAmount",
      "creditValuePerMode",
      "creditValue",
      "ratePerPulseDay",
      "inboundChargeDay",
      "outboundCallCharge",
      "inboundChargeNight",
      "emailCharge",
      "ratePerPulseNight",
      "ratePerPulse",
      "smsCharge",
      "missCallCharge",
      "ivrCallCharge",
      "vfoCharge",
      "chargePerExtraUser",
      "noOfUsers",
      "multiInboundCharge",
      "ratePerPulseMultiLang",
      "multiOutboundCharge",
      "ratePerPulseMultiOutbound",
      "multiLiveChat",
      "whatsappSmsCharge",
    ];
    numericFields.forEach((f) => {
      if (form[f] === "" || isNaN(form[f])) newErrors[f] = true;
    });
    if (!form.pulseDay) newErrors.pulseDay = true;
    if (!form.pulseNight) newErrors.pulseNight = true;
    if (!form.balanceCarry) newErrors.balanceCarry = true;
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const payload = { ...form };

      if (editingPlanId) {
        // ✅ Update existing plan using correct id
        await axios.put(
          `http://localhost:8000/plan/plan/${editingPlanId}`,
          payload
        );
        setModalMessage("✅ Plan updated successfully!");
      } else {
        // ✅ Create new plan
        await axios.post("http://localhost:8000/plan/create_plan", payload);
        setModalMessage("✅ Plan created successfully!");
      }

      fetchPlans();
      setForm(initialFormState);
      setEditingPlanId(null);
    } catch (err) {
      console.error("Error saving plan:", err.response || err);
      setModalMessage("❌ Failed to save plan. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setForm({
      planName: plan.PlanName,
      setupFee: plan.SetupCost,
      subscriptionAmount: plan.RentalAmount,
      PlanType: plan.PlanType, // Correct PlanType
      periodType: plan.PeriodType,
      creditValuePerMode: plan.CreditValuePerMode,
      creditValue: plan.CreditValue,
      ratePerPulseDay: plan.rate_per_pulse_day_shift,
      inboundChargeDay: plan.InboundCallCharge,
      pulseDay: plan.pulse_day_shift,
      outboundCallCharge: plan.OutboundCallCharge,
      pulse: plan.pulse_day_shift,
      inboundChargeNight: plan.InboundCallChargeNight,
      pulseNight: plan.pulse_night_shift,
      emailCharge: plan.EmailCharge,
      ratePerPulseNight: plan.rate_per_pulse_night_shift,
      ratePerPulse: plan.rate_per_pulse_day_shift,
      smsCharge: plan.SMSCharge,
      missCallCharge: plan.MissCallCharge,
      ivrCallCharge: plan.IVR_Charge,
      vfoCharge: plan.VFOCallCharge,
      chargePerExtraUser: plan.ChargePerExtraUser,
      noOfUsers: plan.NoOfFreeUser,
      balanceCarry: plan.balanceCarry || "yes",
      firstMinute: plan.first_minute,
      multiInboundCharge: plan.MultiIBCharges,
      pulseMultiLang: plan.pulse_ib_multi,
      ratePerPulseMultiLang: plan.rate_per_pulse_ib_multi,
      multiOutboundCharge: plan.MultiOBCharges,
      pulseMultiOutbound: plan.pulse_ob_multi,
      ratePerPulseMultiOutbound: plan.rate_per_pulse_ob_multi,
      multiLiveChat: plan.MultiLiveChat,
      whatsappSmsCharge: plan.whatsapp_message_charge,
    });

    setEditingPlanId(plan.Id); // ✅ Use the correct backend primary key
    setShowModal(true);
  };

  const handleDelete = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await axios.delete(`http://localhost:8000/plan/plan/${planId}`);
      fetchPlans();
    } catch (err) {
      console.error("Error deleting plan:", err);
    }
  };

  // ✅ Handle View Plan
  const handleView = async (planId) => {
    try {
      const res = await axios.get(`http://localhost:8000/plan/plan/${planId}`);
      setViewPlan(res.data.plan);
      setShowViewModal(true);
    } catch (err) {
      console.error("Error fetching plan:", err);
      alert("Failed to load plan details.");
    }
  };

  // Reuse your PlanCreation form rendering here
  const renderInput = (label, name, placeholder, type = "text") => (
    <div className="col-md-4 mb-2">
      <label className="form-label">{label}</label>
      <input
        type={type}
        name={name}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        placeholder={placeholder}
        value={form[name]}
        onChange={handleChange}
      />
    </div>
  );

  const renderSelect = (label, name, options) => (
    <div className="col-md-4 mb-2">
      <label className="form-label">{label}</label>
      <select
        name={name}
        className={`form-select ${errors[name] ? "is-invalid" : ""}`}
        value={form[name]}
        onChange={handleChange}
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Plan Management</h3>
        <button
          className="btn btn-primary"
          onClick={() => {
            setForm(initialFormState);
            setEditingPlanId(null);
            setShowModal(true);
          }}
        >
          + Add Plan
        </button>
      </div>

      {/* ✅ Search & Rows per page */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="🔍 Search by name or type..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className="form-select w-auto"
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
        </select>
      </div>

      {/* Plans Table */}
      <div
        className="table-responsive"
        style={{ maxHeight: "600px", overflowY: "auto" }}
      >
        <table className="table table-hover table-striped table-bordered align-middle shadow-sm">
          <thead className="table-dark sticky-top">
            <tr>
              <th className="text-center">S. No.</th>
              <th className="text-start">Plan Name</th>
              <th className="text-center">Plan Mode</th>
              <th className="text-center">Setup Cost</th>
              <th className="text-center">Rental Amount</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPlans.length > 0 ? (
              currentPlans.map((plan, index) => (
                <tr key={plan.Id}>
                  <td className="text-center">{indexOfFirstRow + index + 1}</td>
                  <td className="text-start">{plan.PlanName}</td>
                  <td className="text-center">{plan.PlanType}</td>
                  <td className="text-center">{plan.SetupCost}</td>
                  <td className="text-center">{plan.RentalAmount}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-secondary me-2 mb-1"
                      onClick={() => handleView(plan.Id)}
                      title="View Plan"
                    >
                      👁 View
                    </button>
                    <button
                      className="btn btn-sm btn-outline-warning me-2 mb-1"
                      onClick={() => handleEdit(plan)}
                      title="Edit Plan"
                    >
                      ✏ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger mb-1"
                      onClick={() => handleDelete(plan.Id)}
                      title="Delete Plan"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted py-3">
                  No plans found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button
            className="btn btn-sm btn-outline-primary"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ⬅ Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-sm btn-outline-primary"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next ➡
          </button>
        </div>
      )}

      {/* ✅ View Plan Modal */}
   {/* ✅ View Plan Modal */}
{showViewModal && viewPlan && (
  <div className="modal show fade d-block" tabIndex="-1">
    <div className="modal-dialog modal-xl"> {/* <-- wider modal */}
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">View Plan - {viewPlan.PlanName}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowViewModal(false)}
          ></button>
        </div>
        <div className="modal-body">
          <div className="row">
            {Object.keys(viewPlan).map((key) => (
              <div className="col-md-6 mb-2" key={key}>
                <strong>{key}:</strong> {viewPlan[key]}
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setShowViewModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      {/* Modal for Add/Edit Plan */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMessage
                    ? modalMessage.includes("updated")
                      ? "Update Plan"
                      : "Create Plan"
                    : editingPlanId
                    ? "Edit Plan"
                    : "Add Plan"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setModalMessage(""); // reset message
                    setShowModal(false);
                  }}
                ></button>
              </div>

              <div className="modal-body">
                {/* If submission message exists → show it, else show form */}
                {modalMessage ? (
                  <div className="text-center">
                    <p>{modalMessage}</p>
                  </div>
                ) : (
                  <form className="row g-3" onSubmit={handleSubmit}>
                    {renderInput("Plan Name", "planName", "Plan Name")}
                    {renderInput(
                      "Setup Fee",
                      "setupFee",
                      "Setup Cost",
                      "number"
                    )}
                    {renderInput(
                      "Subscription Amount",
                      "subscriptionAmount",
                      "Subscription Amount",
                      "number"
                    )}
                    {renderInput("Plan Mode", "PlanType", "Period Type")}
                    {renderInput(
                      "Credit Value as per Plan Mode",
                      "creditValuePerMode",
                      "Credit Value per Plan Mode",
                      "number"
                    )}
                    {renderInput(
                      "Credit Value",
                      "creditValue",
                      "Credit Value",
                      "number"
                    )}
                    {renderInput(
                      "Rate Per Pulse (Day Shift)",
                      "ratePerPulseDay",
                      "Rate Per Pulse",
                      "number"
                    )}
                    {renderInput(
                      "Inbound Call Charge (Day Shift)",
                      "inboundChargeDay",
                      "Inbound Call Charge",
                      "number"
                    )}
                    {renderSelect("Pulse (Day Shift)", "pulseDay", [
                      { value: "1", label: "1 Sec" },
                      { value: "15", label: "15 Sec" },
                      { value: "30", label: "30 Sec" },
                      { value: "45", label: "45 Sec" },
                      { value: "60", label: "60 Sec" },
                    ])}
                    {renderInput(
                      "Outbound Call Charge",
                      "outboundCallCharge",
                      "Outbound Call Charge",
                      "number"
                    )}
                    {renderSelect("Pulse", "pulse", [
                      { value: "1", label: "1 Sec" },
                      { value: "15", label: "15 Sec" },
                      { value: "30", label: "30 Sec" },
                      { value: "45", label: "45 Sec" },
                      { value: "60", label: "60 Sec" },
                    ])}
                    {renderInput(
                      "Inbound Call Charge (Night Shift)",
                      "inboundChargeNight",
                      "Inbound Call Charge",
                      "number"
                    )}
                    {renderSelect("Pulse (Night Shift)", "pulseNight", [
                      { value: "1", label: "1 Sec" },
                      { value: "15", label: "15 Sec" },
                      { value: "30", label: "30 Sec" },
                      { value: "45", label: "45 Sec" },
                      { value: "60", label: "60 Sec" },
                    ])}
                    {renderInput(
                      "Email Charge",
                      "emailCharge",
                      "Per Email Charge",
                      "number"
                    )}
                    {renderInput(
                      "Rate Per Pulse (Night Shift)",
                      "ratePerPulseNight",
                      "Rate Per Pulse",
                      "number"
                    )}
                    {renderInput(
                      "Rate Per Pulse",
                      "ratePerPulse",
                      "Rate Per Pulse",
                      "number"
                    )}
                    {renderInput(
                      "SMS Charge 160",
                      "smsCharge",
                      "SMS Charge",
                      "number"
                    )}
                    {renderInput(
                      "Miss Call Charge",
                      "missCallCharge",
                      "Miss Call Rs./Min",
                      "number"
                    )}
                    {renderInput(
                      "IVR Call Charge",
                      "ivrCallCharge",
                      "IVR Call Rs./CALL",
                      "number"
                    )}
                    {renderInput(
                      "VFO Call Charge",
                      "vfoCharge",
                      "VFO Rs./Min",
                      "number"
                    )}
                    {renderInput(
                      "Charge Per Extra User",
                      "chargePerExtraUser",
                      "Charge Per Extra User Rs./User",
                      "number"
                    )}
                    {renderInput(
                      "No. of Users",
                      "noOfUsers",
                      "No. Of Free User",
                      "number"
                    )}
                    {renderSelect("Balance Carry Forward", "balanceCarry", [
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                    ])}

                    <div className="col-md-4 mb-2">
                      <label className="form-label">First Minute</label>
                      <br />
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          id="enable"
                          name="firstMinute"
                          value={1}
                          className="form-check-input"
                          checked={form.firstMinute === 1}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              firstMinute: parseInt(e.target.value),
                            })
                          }
                        />
                        <label htmlFor="enable" className="form-check-label">
                          Enable
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          id="disable"
                          name="firstMinute"
                          value={0}
                          className="form-check-input"
                          checked={form.firstMinute === 0}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              firstMinute: parseInt(e.target.value),
                            })
                          }
                        />
                        <label htmlFor="disable" className="form-check-label">
                          Disable
                        </label>
                      </div>
                    </div>

                    {renderInput(
                      "Multi Language (Inbound Charge)",
                      "multiInboundCharge",
                      "Multi Language Inbound Charge",
                      "number"
                    )}
                    {renderSelect("Pulse (Multi Language)", "pulseMultiLang", [
                      { value: "1", label: "1 Sec" },
                      { value: "15", label: "15 Sec" },
                      { value: "30", label: "30 Sec" },
                      { value: "45", label: "45 Sec" },
                      { value: "60", label: "60 Sec" },
                    ])}
                    {renderInput(
                      "Rate Per Pulse (Multi Language)",
                      "ratePerPulseMultiLang",
                      "Rate Per Pulse",
                      "number"
                    )}
                    {renderInput(
                      "Multi Language (Outbound Charge)",
                      "multiOutboundCharge",
                      "Multi Language Outbound Charge",
                      "number"
                    )}
                    {renderSelect(
                      "Pulse (Multi Language OB)",
                      "pulseMultiOutbound",
                      [
                        { value: "1", label: "1 Sec" },
                        { value: "15", label: "15 Sec" },
                        { value: "30", label: "30 Sec" },
                        { value: "45", label: "45 Sec" },
                        { value: "60", label: "60 Sec" },
                      ]
                    )}
                    {renderInput(
                      "Rate Per Pulse (Multi Language OB)",
                      "ratePerPulseMultiOutbound",
                      "Rate Per Pulse",
                      "number"
                    )}
                    {renderInput(
                      "Multi Language (Live Chat)",
                      "multiLiveChat",
                      "Multi Language Live Chat",
                      "number"
                    )}
                    {renderInput(
                      "Whatsapp SMS Charge",
                      "whatsappSmsCharge",
                      "Whatsapp SMS Charge",
                      "number"
                    )}

                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary px-4"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "SUBMIT"}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="modal-footer">
                {modalMessage && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setModalMessage(""); // clear message for next time
                      setShowModal(false);
                    }}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
