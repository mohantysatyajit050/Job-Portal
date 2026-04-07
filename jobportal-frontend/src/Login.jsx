import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api/api";

function Login() {
  const navigate = useNavigate();
  const usernameRef = useRef(null);

  const [form, setForm] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Auto-focus username field on mount
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  // Check for remembered credentials on mount
  useEffect(() => {
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    if (rememberedUsername) {
      setForm(prev => ({ ...prev, username: rememberedUsername, rememberMe: true }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!form.username.trim()) {
      errors.username = "Username is required";
    }
    
    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
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
      const res = await api.post("users/login/", form);

      const { token, role, username } = res.data;

      if (!token || !role) {
        setError("Invalid response from server");
        setIsLoading(false);
        return;
      }

      // Store data
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);
      
      // Handle remember me functionality
      if (form.rememberMe) {
        localStorage.setItem("rememberedUsername", form.username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }

      setMessage("Login successful!");
      
      // Role-based redirect
      setTimeout(() => {
        if (role === "employer") {
          navigate("/employer");
        } else if (role === "jobseeker") {
          navigate("/dashboard/home");
        } else {
          navigate("/");
        }
      }, 800);

    } catch (err) {
      const errorMsg =
        err.response?.data?.error || 
        err.response?.data?.message || 
        "Server error. Please try again.";
      
      setError(errorMsg);
      setMessage(null);
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <div className="card shadow-lg p-4 p-md-5" style={{ width: "100%", maxWidth: "450px", borderRadius: "12px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-2">Welcome Back</h2>
          <p className="text-muted">Sign in to continue to your account</p>
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
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              ref={usernameRef}
              type="text"
              id="username"
              name="username"
              className={`form-control ${fieldErrors.username ? "is-invalid" : ""}`}
              placeholder="Enter your username"
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

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={`form-control ${fieldErrors.password ? "is-invalid" : ""}`}
                placeholder="Enter your password"
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
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                className="form-check-input"
                onChange={handleChange}
                checked={form.rememberMe}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="text-decoration-none">
              Forgot password?
            </Link>
          </div>

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
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center mt-4 mb-0">
          Don't have an account?{" "}
          <Link to="/register" className="text-decoration-none fw-semibold">
            Sign up
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

export default Login;