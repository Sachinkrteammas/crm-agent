import { Link } from "react-router-dom";
import { signup } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


  const AuthRegister = () => {

      const [username, setUsername] = useState("");
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [error, setError] = useState("");
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
          const user = await signup(username, email, password);
          console.log("User registered:", user);
          // Optional: show success toast here
          navigate("/"); // Navigate to login page after registration
        } catch (err) {
          console.error(err);
          setError(err);
        }
      };

   return (
   
    <div className="authentication-wrapper authentication-cover">
      {/* Logo */}
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
      {/* Logo */}
      <div className="authentication-inner row m-0">
        {/* Left Text */}
        <div className="d-none d-xl-flex col-xl-8 p-0">
          <div className="auth-cover-bg d-flex justify-content-center align-items-center">
            <img
              src="/assets/img/illustrations/auth-login-illustration-light2.png"
              alt="auth-register-cover"
              className="my-5 auth-illustration"
              data-app-light-img="/assets/img/illustrations/auth-login-illustration-light2.png"
              data-app-dark-img="/assets/img/illustrations/auth-register-illustration-dark.png" />
            <img
              src="/assets/img/illustrations/bg-shape-image-light.png"
              alt="auth-register-cover"
              className="platform-bg"
              data-app-light-img="/assets/img/illustrations/bg-shape-image-light.png"
              data-app-dark-img="/assets/img/illustrations/bg-shape-image-dark.png" />
          </div>
        </div>
        {/* Left Text */}

        {/* Register */}
        <div className="d-flex col-12 col-xl-4 align-items-center authentication-bg p-sm-12 p-6">
          <div className="w-px-400 mx-auto mt-12 pt-5">
            <h4 className="mb-1">Adventure starts here 🚀</h4>
            <p className="mb-6">Make your app management easy and fun!</p>

            <form onSubmit={handleSubmit} className="mb-6">
              <div className="mb-6 form-control-validation">
                <label for="username" className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6 form-control-validation">
                <label for="email" className="form-label">Email</label>
                <input type="text" className="form-control" id="email" name="email" placeholder="Enter your email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                 />
              </div>
              <div className="mb-6 form-password-toggle form-control-validation">
                <label className="form-label" for="password">Password</label>

                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    name="password"
                    placeholder="********"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />


              </div>
              <div className="mb-6 mt-8">
                <div className="form-check mb-8 ms-2">
                  <input className="form-check-input" type="checkbox" id="terms-conditions" name="terms" />
                  <label className="form-check-label" for="terms-conditions">
                    I agree to
                    <a href="#">privacy policy & terms</a>
                  </label>
                </div>
              </div>
              <button type="submit" className="btn btn-primary d-grid w-100">Sign up</button>
              {error && <p className="text-red-500">{error}</p>}
            </form>

            <p className="text-center">
              <span>Already have an account?</span>
              <Link to="/">
                <span>Sign in instead</span>
               </Link>
            </p>

            <div className="divider my-6">
              <div className="divider-text">or</div>
            </div>

            <div className="d-flex justify-content-center">
              <a href="#" className="btn btn-icon rounded-circle btn-text-facebook me-1_5">
                <i className="icon-base ti tabler-brand-facebook-filled icon-20px"></i>
              </a>

              <a href="#" className="btn btn-icon rounded-circle btn-text-twitter me-1_5">
                <i className="icon-base ti tabler-brand-twitter-filled icon-20px"></i>
              </a>

              <a href="#" className="btn btn-icon rounded-circle btn-text-github me-1_5">
                <i className="icon-base ti tabler-brand-github-filled icon-20px"></i>
              </a>

              <a href="#" className="btn btn-icon rounded-circle btn-text-google-plus">
                <i className="icon-base ti tabler-brand-google-filled icon-20px"></i>
              </a>
            </div>
          </div>
        </div>
        {/* Register */}
      </div>
    </div>
    
   );

};

export default AuthRegister;