import React, { useState } from "react";

const ManageAdminAccess = () => {
    const [selectedUser, setSelectedUser] = useState("");
    const [autoFill, setAutoFill] = useState(false);
    const [expandedParents, setExpandedParents] = useState({});
    const [userRights, setUserRights] = useState({});

    const users = [
        { id: 1, name: "superadmin" },
        { id: 2, name: "admin1" },
        { id: 3, name: "admin2" },
    ];

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

    const handleParentToggle = (parent, children) => {
        setExpandedParents(prev => ({
            ...prev,
            [parent]: !prev[parent]
        }));
    };

    const handleChildToggle = (child) => {
        setUserRights(prev => ({
            ...prev,
            [child]: !prev[child]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            selectedUser,
            autoFill,
            userRights
        });
        alert("Admin Access saved successfully!");
    };

    return (
        <div className="row">
            <div className="col-12">
                {/* Card Form */}
                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Manage Admin Access</h5>
                        <small className="text-body-secondary">Admin Rights Control</small>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row align-items-end">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">User</label>
                                    <select
                                        className="form-select"
                                        value={selectedUser}
                                        onChange={(e) => setSelectedUser(e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.name}>{user.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-2 mb-3 d-flex align-items-center">
                                    <div className="form-check mt-3">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="autoFill"
                                            checked={autoFill}
                                            onChange={(e) => setAutoFill(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="autoFill">Auto Fill</label>
                                    </div>
                                </div>
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
                                                    onChange={() => handleParentToggle(group.parent, group.children)}
                                                />
                                                <label
                                                    className="form-check-label fw-semibold"
                                                    htmlFor={`parent-${idx}`}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {group.parent}
                                                </label>
                                            </div>
                                            {expandedParents[group.parent] && (
                                                <div className="ms-4 mt-2">
                                                    {group.children.map((child, cidx) => (
                                                        <div key={cidx} className="form-check form-check-inline">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                id={`child-${idx}-${cidx}`}
                                                                checked={!!userRights[child]}
                                                                onChange={() => handleChildToggle(child)}
                                                            />
                                                            <label
                                                                className="form-check-label small"
                                                                htmlFor={`child-${idx}-${cidx}`}
                                                            >
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
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageAdminAccess;
