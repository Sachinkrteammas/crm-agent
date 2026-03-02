import React, { useState } from 'react';


const ManageAdminLogins = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        designation: '',
        userRights: {}
    });

    const [expandedParents, setExpandedParents] = useState({});
    const [search, setSearch] = useState("");

    const userRightsList = [
        {
            parent: "Company Approval",
            children: ["Client Details", "Client Request", "DID Creation", "Add Campaign", "Add/View Social Medias", "Add/View Email Map", "List Id", "Add Sub Type", "Shopify Integration"]
        },
        {
            parent: "Agent Creation",
            children: ["Add Agent", "View Agent"]
        },
        {
            parent: "Agent Calling Allocation",
            children: ["PD Call Allocation", "Client Rights Allocation"]
        },
        {
            parent: "Bluedart Configuration",
            children: ["Upload Service Address"]
        },
        {
            parent: "Plan Master",
            children: ["Plan Creation", "Plan Pending For Approval", "Plan Approval", "View Plan", "Allocate Plan", "Re-Allocate Plan"]
        },
        {
            parent: "Account Master",
            children: ["View Account", "Add Start Date", "Add Balance"]
        },
        {
            parent: "Bill Risk Mgt",
            children: [""]
        },
        {
            parent: "Waiver Master",
            children: [""]
        },
        {
            parent: "Billing Statement",
            children: ["Statement", "View Invoice", "Client Statement", "View Paid/Unpaid Payment", "Statement New"]
        },
        {
            parent: "Report/Renewal Plan",
            children: ["Agent Wise Call Tagging", "Add Bill Summary Auto Mail", "Renewal Plan/Bill Summary", "SLA Report"]
        },
        {
            parent: "Bill Payment",
            children: [""]
        },
        {
            parent: "In Call Management",
            children: ["Manage IVR", "Manage In Call Scenarios", "Manage TAT", "Manage Required Fields", "Manage Alerts & Escalations", "Manage In Call Actions", "Upload Existing Customers", "Manage Training Docs", "Call Flow", "Manage MIS & Reports", "Manage User Logins", "Manage Work Flow", "Master Field Mapping", "Manage In Call Actions Alert", "Prompt Creation", "Manage Close Fields", "Transaction Manage Fields", "Manage Customized Report"]
        },
        {
            parent: "Out Call Management",
            children: ["Manage Campaigns", "Manage Allocations", "Manage Out Call Scenarios", "Manage Required Fields", "Manage Alerts & Escalations", "Manage Out Call Actions", "Manage Out Close Fields", "Manage Customized Report", "Ob Call Flow", "Manage Re Allocations", "Out Master Field Mapping"]
        },
        {
            parent: "In Call Operations",
            children: ["In Call Details", "Create Manual Call", "Audit Sheet", "Update Ticket Status", "Bajaj In Call Details", "Auto Tagging"]
        },
        {
            parent: "Out Call Operations",
            children: ["Out Call Details", "Bajaj Out Call Details", "Create Manual Call", "Out Call Attempt Wise"]
        },
        {
            parent: "MIS & Reports",
            children: ["SLA Reports", "CDR Reports", "Call Reports", "Tagging Reports", "Shopify Report", "Call Flow Report", "C2P Report", "Ivr Reports", "Closing Balance Report", "Upload MIS File", "Export MIS File"]
        },
        {
            parent: "User Management",
            children: [
                "Manage User Logins",
                "Manage User Access"
            ]
        },
        {
            parent: "Social Media",
            children: [
                "Facebook Interactions",
                "Email Interactions",
                "Whatsapp Text",
                "View Whatsapp Text",
                "Master Dashboard"
            ]
        },
        {
            parent: "Admin Management",
            children: [
                "Add/View Admin",
                "Manage Admin Rights"
            ]
        },
        {
            parent: "Exposure Monitoring",
            children: [
                "Exposure",
                "Invoice Creation",
                "Invoie View & Export",
                "Invoice View/Approve",
                "Download Invoice"
            ]
        },
        {
            parent: "C2P Wallet Amount",
            children: [
                "C2P Field Map",
                "C2P Client Wallet",
                "C2P Client Management",
                "Wallet Dashboard",
                "C2P Notification",
                "C2P Tentative Statement",
                "C2P Validate Statement",
                "C2P Final Statement",
                "C2P Sales Management"
            ]
        }
    ];

    const dummyUsers = [
        { id: 1, name: "Anil Goar", phone: "9643325698", email: "anil.goar@teammas.in", designation: "", status: "Active" },
        { id: 2, name: "Nixon", phone: "9643385423", email: "nixon.sethi@teammas.in", designation: "", status: "Active" },
        { id: 3, name: "Anuj", phone: "9869323557", email: "anj.mohan@teammas.in", designation: "", status: "Active" },
        { id: 4, name: "Varuna", phone: "8896323557", email: "varuna.raghav@teammas.in", designation: "", status: "Active" },
        { id: 5, name: "TL", phone: "8874323557", email: "tl@teammas.in", designation: "", status: "Active" },
        { id: 6, name: "Binit", phone: "9643325585", email: "binit.jha@teammas.in", designation: "", status: "Active" },
        { id: 7, name: "Nitish", phone: "7845323557", email: "nitish.kaul@teammas.in", designation: "", status: "Active" },
        { id: 8, name: "Kripa", phone: "8859323557", email: "kripa.shankar@teammas.in", designation: "", status: "Active" },
        { id: 9, name: "Active", phone: "9965323557", email: "active@gmail.com", designation: "", status: "Active" },
        { id: 10, name: "admin", phone: "9643323557", email: "sudeep.negi@teammas.in", designation: "Admin", status: "Active" }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleParentToggle = (parent) => {
        setExpandedParents(prev => ({
            ...prev,
            [parent]: !prev[parent]
        }));
        // Optionally auto-toggle all children when parent is checked
        // Or leave children selection manual after expanding
    };

    const handleChildToggle = (child) => {
        setFormData(prev => ({
            ...prev,
            userRights: {
                ...prev.userRights,
                [child]: !prev.userRights[child]
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    const renderInput = (label, name, placeholder, type = "text") => (
        <div className="col-md-6 col-lg-4 mb-4">
            <label className="form-label">{label}</label>
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className="form-control"
                placeholder={placeholder}
            />
        </div>
    );

    return (
        <div className="row">
            <div className="col-12">
                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Manage Admin Logins</h5>
                        <small className="text-body-secondary">Admin Access Control</small>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                {renderInput("Full Name", "name", "John Doe")}
                                {renderInput("Email", "email", "john.doe@example.com", "email")}
                                {renderInput("Password", "password", "********", "password")}
                                {renderInput("Confirm Password", "confirmPassword", "********", "password")}
                                {renderInput("Phone Number", "phone", "658 799 8941")}
                                {renderInput("Designation", "designation", "Admin / Manager")}
                            </div>

                            <div className="mb-4">
                                <label className="form-label">User Rights</label>
                                <div className="border rounded p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {userRightsList.map((group, idx) => (
                                        <div key={idx} className="mb-2">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id={`parent-${idx}`}
                                                    checked={expandedParents[group.parent] || false}
                                                    onChange={() => handleParentToggle(group.parent)}
                                                />
                                                <label className="form-check-label fw-semibold" htmlFor={`parent-${idx}`}>
                                                    {group.parent}
                                                </label>
                                            </div>
                                            {expandedParents[group.parent] && (
                                                <div className="ms-4 mt-1">
                                                    {group.children.map((child, cidx) => (
                                                        <div key={cidx} className="form-check form-check-inline">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                id={`child-${idx}-${cidx}`}
                                                                checked={!!formData.userRights[child]}
                                                                onChange={() => handleChildToggle(child)}
                                                            />
                                                            <label className="form-check-label small" htmlFor={`child-${idx}-${cidx}`}>
                                                                {child}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">View Login</h6>
                        <div>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Search..."
                                style={{ width: '200px' }}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>S.N</th>
                                    <th>Name</th>
                                    <th>Phone No</th>
                                    <th>Email</th>
                                    <th>Designation</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dummyUsers
                                    .filter(user => user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()))
                                    .map((user, idx) => (
                                        <tr key={user.id}>
                                            <td>{idx + 1}</td>
                                            <td>{user.name}</td>
                                            <td>{user.phone}</td>
                                            <td>{user.email}</td>
                                            <td>{user.designation}</td>
                                            <td>{user.status}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary me-1">
                                                    <i className="bx bx-edit"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger">
                                                    <i className="bx bx-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageAdminLogins;
