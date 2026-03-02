import { Link } from "react-router-dom";
import React from 'react';

const ForgotPassword = () => {

    return (

        <div className="authentication-wrapper authentication-cover">
          <a href="#" className="app-brand auth-cover-brand">
            <span className="app-brand-logo demo">
              <span className="text-primary">
                <svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
                    fill="currentColor" />
                  <path
                    opacity="0.06"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
                    fill="#161616" />
                  <path
                    opacity="0.06"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
                    fill="#161616" />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
                    fill="currentColor" />
                </svg>
              </span>
            </span>
            <span className="app-brand-text demo text-heading fw-bold">DialDesk</span>
          </a>
          {/* /Logo */}
          <div className="authentication-inner row m-0">
            {/* /Left Text */}
            <div className="d-none d-xl-flex col-xl-8 p-0">
              <div className="auth-cover-bg d-flex justify-content-center align-items-center">
                <img
                  src="/assets/img/illustrations/auth-login-illustration-light2.png"
                  alt="auth-forgot-password-cover"
                  className="my-5 auth-illustration d-lg-block d-none"
                  data-app-light-img="illustrations/auth-login-illustration-light2.png"
                  data-app-dark-img="illustrations/auth-forgot-password-illustration-dark.png" />
                <img
                  src="/assets/img/illustrations/bg-shape-image-light.png"
                  alt="auth-forgot-password-cover"
                  className="platform-bg"
                  data-app-light-img="illustrations/bg-shape-image-light.png"
                  data-app-dark-img="illustrations/bg-shape-image-dark.png" />
              </div>
            </div>
            {/* /Left Text */}

            {/* Forgot Password */}
            <div className="d-flex col-12 col-xl-4 align-items-center authentication-bg p-sm-12 p-6">
              <div className="w-px-400 mx-auto mt-12 mt-5">
                <h4 className="mb-1">Forgot Password? 🔒</h4>
                <p className="mb-6">Enter your email and we'll send you instructions to reset your password</p>
                <form id="formAuthentication" className="mb-6">
                  <div className="mb-6 form-control-validation">
                    <label for="email" className="form-label">Email</label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      autofocus />
                  </div>
                  <button className="btn btn-primary d-grid w-100">Send Reset Link</button>
                </form>
                <div className="text-center">
                  <a className="d-flex justify-content-center">
                    <Link to="/">
                        <i className="icon-base ti tabler-chevron-left scaleX-n1-rtl me-1_5"></i>
                        Back to login
                    </Link>
                  </a>
                </div>
              </div>
            </div>
            {/* /Forgot Password */}
          </div>
        </div>

    );

};
export default ForgotPassword;