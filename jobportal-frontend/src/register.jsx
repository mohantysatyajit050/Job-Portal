import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api/api";

function Register() {
  const navigate = useNavigate();
  const usernameRef = useRef(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Auto-focus username field on mount
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Username validation - only check if not empty
    if (!form.username.trim()) {
      errors.username = "Username is required";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      errors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    
    // Confirm password validation
    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    // Role validation
    if (!form.role) {
      errors.role = "Please select a role";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...formData } = form;
      
      const res = await api.post("users/register/", formData);

      setMessage(res.data.message || "Registration successful! Redirecting to login...");
      setError(null);

      // Redirect after short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      const errorMsg =
        err.response?.data?.error || 
        err.response?.data?.message || 
        err.response?.data?.detail ||
        "Registration failed. Please try again.";

      setError(errorMsg);
      setMessage(null);
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <div className="card shadow-lg p-4 p-md-5" style={{ width: "100%", maxWidth: "450px", borderRadius: "12px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-2">Create Account</h2>
          <p className="text-muted">Join us today and get started</p>
        </div>

        {message && (
          <div className="alert alert-success d-flex align-items-center" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {message}
          </div>
        )}

        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              ref={usernameRef}
              type="text"
              id="username"
              name="username"
              className={`form-control ${fieldErrors.username ? "is-invalid" : ""}`}
              placeholder="Choose a username"
              onChange={handleChange}
              value={form.username}
              aria-describedby="username-error"
              required
            />
            {fieldErrors.username && (
              <div id="username-error" className="invalid-feedback">
                {fieldErrors.username}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
              placeholder="Enter your email"
              onChange={handleChange}
              value={form.email}
              aria-describedby="email-error"
              required
            />
            {fieldErrors.email && (
              <div id="email-error" className="invalid-feedback">
                {fieldErrors.email}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={`form-control ${fieldErrors.password ? "is-invalid" : ""}`}
                placeholder="Create a strong password"
                onChange={handleChange}
                value={form.password}
                aria-describedby="password-error password-toggle"
                required
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                id="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              {fieldErrors.password && (
                <div id="password-error" className="invalid-feedback">
                  {fieldErrors.password}
                </div>
              )}
            </div>
            <div className="form-text text-muted mt-1">
              Must be at least 8 characters with uppercase, lowercase, and number
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className={`form-control ${fieldErrors.confirmPassword ? "is-invalid" : ""}`}
                placeholder="Re-enter your password"
                onChange={handleChange}
                value={form.confirmPassword}
                aria-describedby="confirmPassword-error confirmPassword-toggle"
                required
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                id="confirmPassword-toggle"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              {fieldErrors.confirmPassword && (
                <div id="confirmPassword-error" className="invalid-feedback">
                  {fieldErrors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          {/* Role */}
          <div className="mb-4">
            <label htmlFor="role" className="form-label">I am a</label>
            <select
              id="role"
              name="role"
              className={`form-select ${fieldErrors.role ? "is-invalid" : ""}`}
              value={form.role}
              onChange={handleChange}
              aria-describedby="role-error"
              required
            >
              <option value="">Select your role</option>
              <option value="jobseeker">👤 Job Seeker</option>
              <option value="employer">🏢 Employer</option>
            </select>
            {fieldErrors.role && (
              <div id="role-error" className="invalid-feedback">
                {fieldErrors.role}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 d-flex justify-content-center align-items-center" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2 animate-spin">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="4 2" strokeLinecap="round"/>
                </svg>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-4 mb-0">
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none fw-semibold">
            Sign In
          </Link>
        </p>
      </div>
      
      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Register;