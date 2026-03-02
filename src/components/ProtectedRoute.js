import { Navigate, Outlet } from "react-router-dom";

// Protects routes by checking token presence in localStorage
const ProtectedRoute = () => {
    const token = localStorage.getItem("token");

    return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
