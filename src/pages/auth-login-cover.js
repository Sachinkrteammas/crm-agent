//....Login with Toast Notification + Remember Me....//
import React, { useState, useEffect } from "react";
import { login } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const AuthLoginCover = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ Load saved credentials if "Remember Me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    const savedPassword = localStorage.getItem("rememberPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await login(email, password);
      console.log("Logged in with token:", token);

      // ✅ Save credentials if Remember Me is checked
      if (rememberMe) {
        localStorage.setItem("rememberEmail", email);
        localStorage.setItem("rememberPassword", password);
      } else {
        localStorage.removeItem("rememberEmail");
        localStorage.removeItem("rememberPassword");
      }

      setFormError("");
      setToast({
        show: true,
        type: "success",
        message: "Login successful! Redirecting...",
      });

      setTimeout(() => {
        setToast({ show: false, type: "", message: "" });
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error(err);
      setFormError("Invalid email or password");
    }
  };

  return (
    <div className="authentication-wrapper authentication-cover">
      <a href="#" className="app-brand auth-cover-brand">
        <span className="app-brand-text demo text-heading fw-bold"><img 
            src="/assets/img/branding/logo.DialDesk.png" 
            alt="DialDesk Logo" 
            style={{ height: "50px", width: "auto" }}
          />
          {/* DialDesk */}
        </span>
      </a>

      <div className="authentication-inner row m-0">
        {/* Illustration */}
        <div className="d-none d-xl-flex col-xl-8 p-0">
          <div className="auth-cover-bg d-flex justify-content-center align-items-center">
            <img
              src="/assets/img/illustrations/auth-login-illustration-light2.png"
              alt="auth-login-cover"
              className="my-5 auth-illustration"
            />
          </div>
        </div>

        {/* Login Form */}
        <div className="d-flex col-12 col-xl-4 align-items-center authentication-bg p-sm-12 p-6 position-relative">
          <div className="w-px-400 mx-auto mt-12 pt-5">
            <h4 className="mb-1">Welcome to DialDesk!</h4>
            <p className="mb-6">Please sign-in to your account</p>

            <form onSubmit={handleSubmit} className="mb-6">
              {/* Email */}
              <div className="mb-6">
                <label htmlFor="email" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email or username"
                  required
                />
              </div>

              {/* Password with eye toggle */}
              <div className="mb-6 position-relative">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`form-control ${formError ? "is-invalid" : ""}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                />
                {/* 👁️ Eye Icon (Bootstrap) */}
                <i
                  className={`bi ${
                    showPassword ? "bi-eye-slash" : "bi-eye"
                  }`}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    top: "60%",
                    right: "12px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                ></i>

                {formError && (
                  <div className="invalid-feedback">{formError}</div>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="my-8 d-flex justify-content-between">
                <div className="form-check mb-0 ms-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label className="form-check-label" htmlFor="remember-me">
                    Remember Me
                  </label>
                </div>
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              <button type="submit" className="btn btn-primary d-grid w-100">
                Sign in
              </button>
            </form>
          </div>

          {/* ✅ Toast Notification */}
          {toast.show && (
            <div
              className={`toast align-items-center text-white border-0 position-absolute top-0 end-0 m-3 show
                ${toast.type === "success" ? "bg-success" : "bg-danger"}`}
              role="alert"
            >
              <div className="d-flex">
                <div className="toast-body">{toast.message}</div>
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 m-auto"
                  onClick={() =>
                    setToast({ show: false, type: "", message: "" })
                  }
                ></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLoginCover;
