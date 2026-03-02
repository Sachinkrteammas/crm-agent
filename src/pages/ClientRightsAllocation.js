import { useState } from "react";

const ClientRightsAllocation = () => {
  const [form, setForm] = useState({
    selectAgent: "",
    clientDetails: [],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    const handleClientCheckboxChange = (e) => {
      const { value, checked } = e.target;
      let updatedClients = form.clientDetails || [];

      if (checked) {
        updatedClients = [...updatedClients, value];
      } else {
        updatedClients = updatedClients.filter((item) => item !== value);
      }

      setForm((prevForm) => ({
        ...prevForm,
        clientDetails: updatedClients,
      }));
    };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form); // TODO: Hook up API call here
  };

  return (
    <div className="row">
    <div className="col-12">
      <div className="mb-3">
        <h4>Client Rights Allocation</h4>
      </div>

      {/* Form Card */}
      <div className="card mb-4">
        <h6 className="card-header">CLIENTS RIGHTS ALLOCATION</h6>
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-4">
              <label className="form-label">Select Agent</label>
              <select
                name="selectAgent"
                className="form-select"
                value={form.selectAgent}
                onChange={handleChange}
              >
                <option>Select Agent</option>
              </select>
            </div>

            <div className="col-12">
                <label className="form-label">Client Details</label>
                <div
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "10px",
                    height: "250px",
                    overflowY: "scroll",
                  }}
                >
                  {[
                    "All", "Dalmia Sarvey", "DIALDESK", "DURIAN INDUSTRIES LTD", "Mas P2P",
                    "TV Tele Shopping", "HIMGIRI ENTERPRISES PVT LTD", "Deal92", "Sharp Sight",
                    "TAINO SHOPPING TRIBE PVT LTD", "Civic Elevators", "Krish Realtynirman Pvt. Ltd.",
                    "Valeo Motherson", "DLF Estate Developers Limited", "Ayurveda Saptrishi",
                    "Keeline Applinace Pvt Ltd", "Rx Infotech P Limited", "Mahavir Auto Diagnostic Pvt Ltd",
                    "Timwe", "Oxford University Press", "IP Bank", "PikQuick", "21st Century",
                    "Creo kitchen missed call", "one97 communication ltd", "Limca and Sprite",
                    "Bigpeers Broadband", "Recpdcl", "MSD pay TM", "Wheel India SCM Solutions Pvt Ltd",
                    "Vodafone Out calling", "Snapdeal", "Yamaha", "ARB Accessories pvt Ltd",
                    "BALTRA Home Products", "Super CC", "abc", "Usha Shriram Enterprises Pvt. Ltd.",
                    "Sai Enterprises", "Summerking India", "Door Serve Pvt Ltd", "I2e1 New", "Paylo",
                    "Kan Universal Pvt. Ltd.", "TECHNOKING DISTRIBUTERS", "Destin Electrotech Pvt Ltd",
                    "BridgeLoyalty Customer Experience Management LLP", "Demo", "Ready Roti India Pvt Limited (Harvest Gold)",
                    "Blaupunkt", "The Indus Entrepreneurs - Delhi", "Yamaha Motor India", "Paypik", "Comway",
                    "Gigantic", "UT Electronics-Paras Group", "Akai India", "BOHRA ENTERPRISES",
                    // ... You can continue with the rest of the list
                  ].map((client) => (
                    <div key={client} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="clientDetails"
                        value={client}
                        checked={form.clientDetails?.includes(client)}
                        onChange={handleClientCheckboxChange}
                      />
                      <label className="form-check-label">{client}</label>
                    </div>
                  ))}
                </div>
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ClientRightsAllocation;
