// src/pages/logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService"; //

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/", { replace: true });
  }, [navigate]);

  return null; // or a spinner while redirecting
}

export default Logout;
