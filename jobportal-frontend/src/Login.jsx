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

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

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
      const res = await api.post("users/login/", {
  username: form.username,
  password: form.password,
});
      const { token, role, username } = res.data;

      if (!token || !role) {
        setError("Invalid response from server");
        setIsLoading(false);
        return;
      }

      // ✅ Store data
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);

      // Remember me
      if (form.rememberMe) {
        localStorage.setItem("rememberedUsername", form.username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }

      setMessage("Login successful!");

      // 🔥 IMPORTANT FIX: ROLE-BASED REDIRECT
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin");             // ✅ ADMIN FIX
        } else if (role === "employer") {
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
          <div className="alert alert-success">{message}</div>
        )}

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              ref={usernameRef}
              type="text"
              name="username"
              className={`form-control ${fieldErrors.username ? "is-invalid" : ""}`}
              onChange={handleChange}
              value={form.username}
            />
            {fieldErrors.username && (
              <div className="invalid-feedback">{fieldErrors.username}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`form-control ${fieldErrors.password ? "is-invalid" : ""}`}
                onChange={handleChange}
                value={form.password}
              />
              <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
                {showPassword ? "Hide" : "Show"}
              </button>
              {fieldErrors.password && (
                <div className="invalid-feedback">{fieldErrors.password}</div>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-between mb-3">
            <div>
              <input
                type="checkbox"
                name="rememberMe"
                onChange={handleChange}
                checked={form.rememberMe}
              /> Remember me
            </div>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-3">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;