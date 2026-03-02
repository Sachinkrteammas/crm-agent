import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";

const Layout = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const displayname = localStorage.getItem("displayname");

  const [openMenus, setOpenMenus] = useState({
    inCall: false,
    outCall: false,
    misReports: false,
    billing: false,
    adminManage: false,
    companyApproval: false,
    agentCreation: false,
    agentCall: false,
    planMaster: false,
    renewalPlan: false,
    inCallManagement: false,
    outCallManagement: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => {
      const updatedMenus = Object.keys(prev).reduce((acc, key) => {
        acc[key] = key === menu ? !prev[key] : false;
        return acc;
      }, {});
      return updatedMenus;
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const isActiveMenu = (paths) => {
    return paths.some(
      (path) =>
        location.pathname === path ||
        location.pathname.startsWith(path + "/")
    );
  };



useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (storedUsername) setUsername(storedUsername);
    if (storedRole) setRole(storedRole);

    if (storedRole === "agent") {
      // ✅ Keep all query params, no mandatory checks
      const targetUrl = `/tagging${location.search}`;

      if (location.pathname + location.search !== targetUrl) {
        navigate(targetUrl, { replace: true });
      }
    }
  }, [navigate, location]);

  // ✅ Sidebar behavior (skip if agent)
  useEffect(() => {
    if (role === "agent") return;

    const sidebar = document.getElementById("layout-menu");
    if (!sidebar) return;

    if (window.innerWidth >= 1200) {
      if (isSidebarOpen || isSidebarHovered) {
        document.body.classList.remove("layout-menu-collapsed");
      } else {
        document.body.classList.add("layout-menu-collapsed");
      }
      sidebar.classList.remove("show");
    } else {
      if (isSidebarOpen) {
        sidebar.classList.add("show");
      } else {
        sidebar.classList.remove("show");
      }
    }
  }, [isSidebarOpen, isSidebarHovered, role]);

  // ✅ Theme handling
  useEffect(() => {
    const savedTheme = "Light";
    console.log(savedTheme,"savedTheme==")
    document.documentElement.setAttribute("data-bs-theme", savedTheme);
  }, []);

  const handleThemeChange = (theme) => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  };

  const handleMenuLinkClick = () => {
    if (window.innerWidth < 1200) {
      setIsSidebarOpen(false);
    }
  };

  // ✅ CASE 1: Agent → No sidebar, no header, just the page
  // CASE 1: Agent → No sidebar, BUT show header + page content
if (role === "agent") {
  return (
    <div className="layout-wrapper" style={{ maxWidth: "100%", width: "100%", margin: 0, padding: 0 }}>
      <div className="layout-page" style={{ maxWidth: "100%", width: "100%", margin: 0, padding: 0 }}>

        {/* Header (same as normal users) */}
        <nav
  className="layout-navbar container-xxl navbar-detached navbar navbar-expand-xl align-items-center bg-navbar-theme"
  id="layout-navbar"
  style={{
    width: "100%",
    margin: 0,
    padding: "0.5rem 1rem",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1050,
  }}
>
  <div className="d-flex align-items-center w-100 justify-content-between">
    {/* ✅ Left side: DialDesk logo */}
    <div className="navbar-brand">
      <img
        src="/assets/img/logo.png" // save logo here (public/assets/img/)
        alt="DialDesk Logo"
        style={{ height: "45px", width: "auto" }}
      />
    </div>

    {/* ✅ Right side: User menu */}
    <div className="navbar-nav-right d-flex align-items-center">
      <ul className="navbar-nav flex-row align-items-center ms-auto">
        <li className="nav-item navbar-dropdown dropdown-user dropdown">
          <a
            className="nav-link dropdown-toggle hide-arrow p-0"
            href="#"
            data-bs-toggle="dropdown"
          >
            <div className="avatar avatar-online">
              <img
                src="/assets/img/avatars/1.png"
                alt="user"
                className="rounded-circle"
              />
            </div>
          </a>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <a className="dropdown-item mt-0">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0 me-2">
                    <div className="avatar avatar-online">
                      <img
                        src="/assets/img/avatars/1.png"
                        alt="user"
                        className="rounded-circle"
                      />
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-0">{displayname}</h6>
                    <small className="text-body-secondary">Agent</small>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <div className="dropdown-divider my-1 mx-n2"></div>
            </li>
            <li>
              <div className="d-grid px-2 pt-2 pb-1">
                <Link
                  to="/logout"
                  className="btn btn-sm btn-danger d-flex"
                >
                  <small className="align-middle">Logout</small>
                  <i className="icon-base ti tabler-logout ms-2 icon-14px"></i>
                </Link>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>


        {/* Page Content */}
        <div className="content-wrapper">
          <div className="container-fluid p-3">
            <Outlet /> {/* TaggingForm will load here */}
          </div>
        </div>
      </div>
    </div>
  );
}




  return (
    <div className="layout-wrapper layout-content-navbar">
    <div className="layout-container">
      {/* Sidebar */}
        <aside id="layout-menu" className="layout-menu menu-vertical menu"
          onMouseEnter={() => {
                if (!isSidebarOpen) {
                    setIsSidebarHovered(true);
                }
            }}
            onMouseLeave={() => {
                if (!isSidebarOpen) {
                    setIsSidebarHovered(false);
                }
          }}>
          <div className="app-brand demo">
            <Link to="/dashboard" className="app-brand-link">
              <span className="app-brand-logo demo">
                <svg width="32" height="22" viewBox="0 0 32 22" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M0 0V6.85C0 6.85 -0.13 9.01 1.98 10.84L13.69 22L19.78 21.92L18.8 9.88L16.49 7.17L9.23 0H0Z" fill="currentColor" />
                  <path opacity="0.06" fillRule="evenodd" clipRule="evenodd" d="M7.7 16.43L12.52 3.23L16.55 7.25L7.7 16.43Z" fill="#161616" />
                  <path opacity="0.06" fillRule="evenodd" clipRule="evenodd" d="M8.07 15.91L13.94 4.63L16.58 7.28L8.07 15.91Z" fill="#161616" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M7.77 16.35L23.65 0H32V6.88C32 6.88 31.82 9.17 30.65 10.40L19.78 22H13.69L7.77 16.35Z" fill="currentColor" />
                </svg>
              </span>
              <span className="app-brand-text demo menu-text fw-bold ms-3">DialDesk</span>
            </Link>
            <a
                href="#"
                className="layout-menu-toggle menu-link text-large ms-auto"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSidebarOpen((prev) => !prev);
                  if (isSidebarHovered) {
                      setIsSidebarHovered(false);
                  }
                }}
            >
                <i className="icon-base ti menu-toggle-icon d-none d-xl-block"></i>
                <i className="icon-base ti tabler-x d-block d-xl-none"></i>
            </a>
          </div>

          <div className="menu-inner-shadow"></div>

          <ul className="menu-inner py-1 overflow-y-auto">

            {/* Dashboard */}
            <li className={`menu-item ${location.pathname === "/dashboard" ? "active" : ""}`}>
              <Link to="/dashboard" className="menu-link" onClick={handleMenuLinkClick}>
                <i className="menu-icon icon-base ti tabler-dashboard"></i>
                <div>Dashboard</div>
              </Link>
            </li>

            <li className={`menu-item ${location.pathname === "/real_time_report" ? "active" : ""}`}>
              <Link to="/real_time_report" className="menu-link" onClick={handleMenuLinkClick}>
                <i className="menu-icon icon-base ti tabler-report"></i>
                <div>Real Time Report</div>
              </Link>
            </li>

            <li className={`menu-item ${location.pathname === "/tagging" ? "active" : ""}`}>
              <Link to="/tagging" className="menu-link" onClick={handleMenuLinkClick}>
                <i className="menu-icon icon-base ti tabler-phone-call"></i>
                <div>Call Tagging</div>
              </Link>
            </li>

            <li className={`menu-item ${location.pathname === "/manage_risk" ? "active" : ""}`}>
              <Link to="/manage_risk" className="menu-link" onClick={handleMenuLinkClick}>
                <i className="menu-icon icon-base ti tabler-file-invoice"></i>
                <div>Bill Risk Management</div>
              </Link>
            </li>

            <li className={`menu-item ${location.pathname === "/bill_payment" ? "active" : ""}`}>
              <Link to="/bill_payment" className="menu-link" onClick={handleMenuLinkClick}>
                <i className="menu-icon icon-base ti tabler-receipt-rupee"></i>
                <div>Bill Payment</div>
              </Link>
            </li>


            <li className={`menu-item ${openMenus.adminManage ? "open" : ""} ${isActiveMenu(["/admin_login", "/admin_access"]) ? "active" : ""}`}>
              <a href="#"
                className="menu-link menu-toggle"
                onClick={() => toggleMenu("adminManage")}
              >
                <i className="menu-icon icon-base ti tabler-user"></i>
                <div>Admin Management</div>
              </a>
              <ul className="menu-sub" style={{ display: openMenus.adminManage ? "block" : "none" }}>
                <li className={`menu-item ${location.pathname === "/admin_login" ? "active" : ""}`}>
                  <Link to="/admin_login" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Add/View Admin</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/admin_access" ? "active" : ""}`}>
                  <Link to="/admin_access" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Manage Admin Rights</div>
                  </Link>
                </li>
              </ul>
            </li>

            <li className={`menu-item ${openMenus.companyApproval ? "open" : ""} ${isActiveMenu(["/campaign_list", "/campaign_subtype", "/shopify_integration", "/email_map", "/view_client", "/did_creation", "/campaign_page", "/social_media_form", "/client_request"]) ? "active" : ""}`}>
              <a href="#"
                className="menu-link menu-toggle"
                onClick={() => toggleMenu("companyApproval")}
              >
                <i className="menu-icon icon-base ti tabler-building-skyscraper"></i>
                <div>Company Approval</div>
              </a>
              <ul className="menu-sub" style={{ display: openMenus.companyApproval ? "block" : "none" }}>
                <li className={`menu-item ${location.pathname === "/campaign_list" ? "active" : ""}`}>
                  <Link to="/campaign_list" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>List Id</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/campaign_subtype" ? "active" : ""}`}>
                  <Link to="/campaign_subtype" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Add Sub Type</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/shopify_integration" ? "active" : ""}`}>
                  <Link to="/shopify_integration" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Shopify Integration</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/email_map" ? "active" : ""}`}>
                  <Link to="/email_map" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Add/View Email Map</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/view_client" ? "active" : ""}`}>
                  <Link to="/view_client" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Client Details</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/did_creation" ? "active" : ""}`}>
                  <Link to="/did_creation" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>DID Creation</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/campaign_page" ? "active" : ""}`}>
                  <Link to="/campaign_page" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Add campaign</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/social_media_form" ? "active" : ""}`}>
                  <Link to="/social_media_form" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Add/View Social Media</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/client_request" ? "active" : ""}`}>
                  <Link to="/client_request" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Client Request</div>
                  </Link>
                </li>
              </ul>
            </li>

            <li className={`menu-item ${openMenus.agentCreation ? "open" : ""} ${isActiveMenu(["/view_agent", "/create_agent"]) ? "active" : ""}`}>
              <a href="#"
                className="menu-link menu-toggle"
                onClick={() => toggleMenu("agentCreation")}
              >
                <i className="menu-icon icon-base ti tabler-users"></i>
                <div>Agent Creation</div>
              </a>
              <ul className="menu-sub" style={{ display: openMenus.agentCreation ? "block" : "none" }}>
                <li className={`menu-item ${location.pathname === "/view_agent" ? "active" : ""}`}>
                  <Link to="/view_agent" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>View Agent</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/create_agent" ? "active" : ""}`}>
                  <Link to="/create_agent" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Add Agent</div>
                  </Link>
                </li>
              </ul>
            </li>

            <li className={`menu-item ${openMenus.agentCall ? "open" : ""} ${isActiveMenu(["/call_allocation", "/client_rights_allocation"]) ? "active" : ""}`}>
              <a href="#"
                className="menu-link menu-toggle"
                onClick={() => toggleMenu("agentCall")}
              >
                <i className="menu-icon icon-base ti tabler-outbound"></i>
                <div>Agent Call Allocation</div>
              </a>
              <ul className="menu-sub" style={{ display: openMenus.agentCall ? "block" : "none" }}>
                <li className={`menu-item ${location.pathname === "/call_allocation" ? "active" : ""}`}>
                  <Link to="/call_allocation" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>PD Call Allocation</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/client_rights_allocation" ? "active" : ""}`}>
                  <Link to="/client_rights_allocation" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Client Rights Allocation</div>
                  </Link>
                </li>
              </ul>
            </li>

            <li className={`menu-item ${openMenus.planMaster ? "open" : ""} ${isActiveMenu(["/re_allocate_plan", "/view_plan", "/allocate_plan", "/plan_creation", "/plan_pending", "/plan_approval"]) ? "active" : ""}`}>
              <a href="#"
                className="menu-link menu-toggle"
                onClick={() => toggleMenu("planMaster")}
              >
                <i className="menu-icon icon-base ti tabler-notebook"></i>
                <div>Plan Master</div>
              </a>
              <ul className="menu-sub" style={{ display: openMenus.planMaster ? "block" : "none" }}>
                <li className={`menu-item ${location.pathname === "/re_allocate_plan" ? "active" : ""}`}>
                  <Link to="/re_allocate_plan" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Re-Allocate Plan</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/view_plan" ? "active" : ""}`}>
                  <Link to="/view_plan" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>View Plan</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/allocate_plan" ? "active" : ""}`}>
                  <Link to="/allocate_plan" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Allocate Plan</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/plan_creation" ? "active" : ""}`}>
                  <Link to="/plan_creation" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Plan Creation</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/plan_pending" ? "active" : ""}`}>
                  <Link to="/plan_pending" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Plan Pending For Approval</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/plan_approval" ? "active" : ""}`}>
                  <Link to="/plan_approval" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Plan Approval</div>
                  </Link>
                </li>
              </ul>
            </li>

            <li className={`menu-item ${openMenus.renewalPlan ? "open" : ""} ${isActiveMenu(["/agent_call_tag", "/bill_summary_mail", "/client_bill_summary", "/sla_report"]) ? "active" : ""}`}>
              <a href="#"
                className="menu-link menu-toggle"
                onClick={() => toggleMenu("renewalPlan")}
              >
                <i className="menu-icon icon-base ti tabler-report"></i>
                <div>Report/Renewal Plan</div>
              </a>
              <ul className="menu-sub" style={{ display: openMenus.renewalPlan ? "block" : "none" }}>
                <li className={`menu-item ${location.pathname === "/agent_call_tag" ? "active" : ""}`}>
                  <Link to="/agent_call_tag" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Agent Wise Call Tagging</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/bill_summary_mail" ? "active" : ""}`}>
                  <Link to="/bill_summary_mail" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Add Bill Summary Auto Mail</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/client_bill_summary" ? "active" : ""}`}>
                  <Link to="/client_bill_summary" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Renewal Plan/Bill Summary</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/sla_report" ? "active" : ""}`}>
                  <Link to="/sla_report" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>SLA Report</div>
                  </Link>
                </li>
              </ul>
            </li>

            <li className={`menu-item ${openMenus.inCallManagement ? "open" : ""} ${isActiveMenu(["/manage_customize_mis", "/add_call_flow", "/prompt_creation", "/manage_user_login", "/manage_in_call_action", "/manage_mis_reports", "/manage_training_docs", "/manage_ivr", "/manage_incal_scenarios", "/manage_tat", "/manage_alert_escalations", "/manage_call_actions"]) ? "active" : ""}`}>
              <a href="#"
                className="menu-link menu-toggle"
                onClick={() => toggleMenu("inCallManagement")}
              >
                <i className="menu-icon icon-base ti tabler-phone"></i>
                <div>In Call Management</div>
              </a>
              <ul className="menu-sub" style={{ display: openMenus.inCallManagement ? "block" : "none" }}>
                <li className={`menu-item ${location.pathname === "/manage_customize_mis" ? "active" : ""}`}>
                  <Link to="/manage_customize_mis" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Manage Customized Report</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/add_call_flow" ? "active" : ""}`}>
                  <Link to="/add_call_flow" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Call Flow</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/prompt_creation" ? "active" : ""}`}>
                  <Link to="/prompt_creation" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Prompt Creations</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/manage_user_login" ? "active" : ""}`}>
                  <Link to="/manage_user_login" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Manage User Logins</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/manage_in_call_action" ? "active" : ""}`}>
                  <Link to="/manage_in_call_action" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Manage In Call Actions Alert</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/manage_mis_reports" ? "active" : ""}`}>
                  <Link to="/manage_mis_reports" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Manage MIS & Reports</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/manage_training_docs" ? "active" : ""}`}>
                  <Link to="/manage_training_docs" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Manage Training Docs</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/manage_ivr" ? "active" : ""}`}>
                  <Link to="/manage_ivr" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Manage IVR</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/manage_incal_scenarios" ? "active" : ""}`}>
                  <Link to="/manage_incal_scenarios" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Manage In Call Scenarios</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/manage_tat" ? "active" : ""}`}>
                  <Link to="/manage_tat" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Manage TAT</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/manage_alert_escalations" ? "active" : ""}`}>
                  <Link to="/manage_alert_escalations" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Manage Alerts & Escalations</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/manage_call_actions" ? "active" : ""}`}>
                  <Link to="/manage_call_actions" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Manage In Call Actions</div>
                  </Link>
                </li>
              </ul>
            </li>

            <li className={`menu-item ${openMenus.outCallManagement ? "open" : ""} ${isActiveMenu(["/out_manage_alert_escalations", "/out_manage_customize_mis", "/manage_reallocation", "/ob_add_call_flow", "/out_manage_call_actions", "/manage_campaign", "/manage_allocations", "/out_manage_call_scenarios"]) ? "active" : ""}`}>
              <a href="#"
                className="menu-link menu-toggle"
                onClick={() => toggleMenu("outCallManagement")}
              >
                <i className="menu-icon icon-base ti tabler-file-phone"></i>
                <div>Out Call Management</div>
              </a>
              <ul className="menu-sub" style={{ display: openMenus.outCallManagement ? "block" : "none" }}>
                <li className={`menu-item ${location.pathname === "/out_manage_alert_escalations" ? "active" : ""}`}>
                  <Link to="/out_manage_alert_escalations" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Manage Alerts & Escalations</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/out_manage_customize_mis" ? "active" : ""}`}>
                  <Link to="/out_manage_customize_mis" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Manage Customized Report</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/manage_reallocation" ? "active" : ""}`}>
                  <Link to="/manage_reallocation" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Manage Re Allocations</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/ob_add_call_flow" ? "active" : ""}`}>
                  <Link to="/ob_add_call_flow" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>OB Call Flow</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/out_manage_call_actions" ? "active" : ""}`}>
                  <Link to="/out_manage_call_actions" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Manage Out Call Actions</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/manage_campaign" ? "active" : ""}`}>
                  <Link to="/manage_campaign" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Manage Campaigns</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/manage_allocations" ? "active" : ""}`}>
                  <Link to="/manage_allocations" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Manage Allocations</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/out_manage_call_scenarios" ? "active" : ""}`}>
                  <Link to="/out_manage_call_scenarios" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Manage Out Call Scenarios</div>
                  </Link>
                </li>
              </ul>
            </li>


            {/* In Call Operations */}
            <li className={`menu-item ${openMenus.inCall ? "open" : ""} ${isActiveMenu(["/call_details", "/update_ticket_status", "/create_manual_call", "/csat_view"]) ? "active" : ""}`}>
              <a href="#"
                className="menu-link menu-toggle"
                onClick={() => toggleMenu("inCall")}
              >
                <i className="menu-icon icon-base ti tabler-phone-incoming"></i>
                <div>In Call Operations</div>
              </a>
              <ul className="menu-sub" style={{ display: openMenus.inCall ? "block" : "none" }}>
                <li className={`menu-item ${location.pathname === "/create_manual_call" ? "active" : ""}`}>
                  <Link to="/create_manual_call" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Create Manual Call</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/update_ticket_status" ? "active" : ""}`}>
                  <Link to="/update_ticket_status" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Update Ticket Status</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/call_details" ? "active" : ""}`}>
                  <Link to="/call_details" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>In Call Details</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/csat_view" ? "active" : ""}`}>
                  <Link to="/csat_view" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>CSAT View</div>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Out Call Operations */}
            <li className={`menu-item ${openMenus.outCall ? "open" : ""} ${isActiveMenu(["/out_call_details", "/out_create_manual_call", "/priority_calls"]) ? "active" : ""}`}>
              <a href="#"
                className="menu-link menu-toggle"
                onClick={() => toggleMenu("outCall")}
              >
                <i className="menu-icon icon-base ti tabler-phone-outgoing"></i>
                <div>Out Call Operations</div>
              </a>
              <ul className="menu-sub" style={{ display: openMenus.outCall ? "block" : "none" }}>
                <li className={`menu-item ${location.pathname === "/out_create_manual_call" ? "active" : ""}`}>
                  <Link to="/out_create_manual_call" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Create Manual Call</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/out_call_details" ? "active" : ""}`}>
                  <Link to="/out_call_details" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Out Call Details</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/priority_calls" ? "active" : ""}`}>
                  <Link to="/priority_calls" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Priority Calls via API</div>
                  </Link>
                </li>
              </ul>
            </li>

            {/* MIS & Reports */}
            <li className={`menu-item ${openMenus.misReports ? "open" : ""} ${isActiveMenu(["/cdr-report", "/sla_reports", "/ob-cdr-report", "/ivr-report", "/ob-shared-cdr-report", "/ivr-funnel-report", "/tagging_reports", "/call_reports", "/shopify_reports"]) ? "active" : ""}`}>
              <a
                href="#"
                className="menu-link menu-toggle"
                onClick={() => toggleMenu("misReports")}
              >
                <i className="menu-icon icon-base ti tabler-file-report"></i>
                <div>MIS & Reports</div>
              </a>
              <ul className="menu-sub" style={{ display: openMenus.misReports ? "block" : "none" }}>
                <li className={`menu-item ${location.pathname === "/sla_reports" ? "active" : ""}`}>
                  <Link to="/sla_reports" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>SLA Reports</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/cdr-report" ? "active" : ""}`}>
                  <Link to="/cdr-report" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>CDR Report</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/ob-cdr-report" ? "active" : ""}`}>
                  <Link to="/ob-cdr-report" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>OB CDR Report</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/ivr-report" ? "active" : ""}`}>
                  <Link to="/ivr-report" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>IVR Report</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/ob-shared-cdr-report" ? "active" : ""}`}>
                  <Link to="/ob-shared-cdr-report" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>OB Shared CDR Report</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/ivr-funnel-report" ? "active" : ""}`}>
                  <Link to="/ivr-funnel-report" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>IVR Funnel Report</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/call_reports" ? "active" : ""}`}>
                  <Link to="/call_reports" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Call Reports</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/tagging_reports" ? "active" : ""}`}>
                  <Link to="/tagging_reports" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Tagging Reports</div>
                  </Link>
                </li>
                <li className={`menu-item ${location.pathname === "/shopify_reports" ? "active" : ""}`}>
                  <Link to="/shopify_reports" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Shopify Reports</div>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Billing Statement */}
            <li className={`menu-item ${openMenus.billing ? "open" : ""} ${isActiveMenu(["/bill_statement"]) ? "active" : ""}`}>
              <a
                href="#"
                className="menu-link menu-toggle"
                onClick={() => toggleMenu("billing")}
              >
                <i className="menu-icon icon-base ti tabler-receipt"></i>
                <div>Billing Statement</div>
              </a>
              <ul className="menu-sub" style={{ display: openMenus.billing ? "block" : "none" }}>
                <li className={`menu-item ${location.pathname === "/bill_statement" ? "active" : ""}`}>
                  <Link to="/bill_statement" className="menu-link" onClick={handleMenuLinkClick}>
                    <div>Statement New</div>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
      </aside>

      <div className="menu-mobile-toggler d-xl-none rounded-1">
          <a href="#" className="layout-menu-toggle menu-link text-large text-bg-secondary p-2 rounded-1">
            <i className="ti tabler-menu icon-base"></i>
            <i className="ti tabler-chevron-right icon-base"></i>
          </a>
        </div>

      {/* Main Content */}
      <div className="layout-page">
        {/* Header */}
        <nav
            className="layout-navbar container-xxl navbar-detached navbar navbar-expand-xl align-items-center bg-navbar-theme"
            id="layout-navbar">
            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
              <a
                href="#"
                className="nav-item nav-link px-0 me-xl-6"
                onClick={(e) => {
                    e.preventDefault();
                    toggleSidebar();
                    if (isSidebarHovered) {
                        setIsSidebarHovered(false);
                    }
                }}
              >
                <i className="icon-base ti tabler-menu-2 icon-md"></i>
              </a>
            </div>

            <div className="navbar-nav-right d-flex align-items-center justify-content-end" id="navbar-collapse">
              {/* Search */}
              <div className="navbar-nav align-items-center">
                <div className="nav-item navbar-search-wrapper px-md-0 px-2 mb-0">
                  <a className="nav-item nav-link search-toggler d-flex align-items-center px-0" href="#">
                    <span className="d-inline-block text-body-secondary fw-normal" id="autocomplete"></span>
                  </a>
                </div>
              </div>

              {/* /Search */}

              <ul className="navbar-nav flex-row align-items-center ms-md-auto">
                {/*/ Language */}

                {/* Style Switcher */}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle hide-arrow btn btn-icon btn-text-secondary rounded-pill"
                    id="nav-theme"
                    href="#"
                    data-bs-toggle="dropdown">
                    <i className="icon-base ti tabler-sun icon-22px theme-icon-active text-heading"></i>
                    <span className="d-none ms-2" id="nav-theme-text">Toggle theme</span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="nav-theme-text">
                    <li>
                      <button
                        type="button"
                        className="dropdown-item align-items-center active"
                        data-bs-theme-value="light"
                        aria-pressed="false"
                        onClick={() => handleThemeChange("light")}>
                        <span><i className="icon-base ti tabler-sun icon-22px me-3" data-icon="sun"></i>Light</span>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item align-items-center"
                        data-bs-theme-value="dark"
                        aria-pressed="true"
                        onClick={() => handleThemeChange("dark")}>
                        <span
                          ><i className="icon-base ti tabler-moon-stars icon-22px me-3" data-icon="moon-stars"></i
                          >Dark</span
                        >
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item align-items-center"
                        data-bs-theme-value="system"
                        aria-pressed="false"
                        onClick={() => handleThemeChange("auto")}>
                        <span
                          ><i
                            className="icon-base ti tabler-device-desktop-analytics icon-22px me-3"
                            data-icon="device-desktop-analytics"></i
                          >System</span
                        >
                      </button>
                    </li>
                  </ul>
                </li>
                {/* / Style Switcher*/}

                {/* Quick links  */}

                {/* Quick links */}

                {/* Notification */}

                {/*/ Notification */}

                {/* User */}
                <li className="nav-item navbar-dropdown dropdown-user dropdown">
                  <a
                    className="nav-link dropdown-toggle hide-arrow p-0"
                    href="#"
                    data-bs-toggle="dropdown">
                    <div className="avatar avatar-online">
                      <img src="assets/img/avatars/1.png" alt className="rounded-circle" />
                    </div>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a className="dropdown-item mt-0">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0 me-2">
                            <div className="avatar avatar-online">
                              <img src="assets/img/avatars/1.png" alt className="rounded-circle" />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-0">John Doe</h6>
                            <small className="text-body-secondary">Admin</small>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li>
                      <div className="dropdown-divider my-1 mx-n2"></div>
                    </li>
                    <li>
                      <div className="d-grid px-2 pt-2 pb-1">
                        <Link to="/logout" className="btn btn-sm btn-danger d-flex">
                          <small className="align-middle">Logout</small>
                          <i className="icon-base ti tabler-logout ms-2 icon-14px"></i>
                        </Link>
                      </div>
                    </li>
                  </ul>
                </li>
                {/*/ User */}
              </ul>
            </div>
          </nav>

        <div className="content-wrapper">
          <div className="container-xxl flex-grow-1 container-p-y">
            <Outlet /> {/* Routes will render here */}
          </div>
          <div className="content-backdrop fade"></div>
        </div>
      </div>
      </div>
      <div className="layout-overlay layout-menu-toggle"></div>
      <div className="drag-target"></div>
    </div>
  );
};

export default Layout;
