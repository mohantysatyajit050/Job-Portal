import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState(null); // ✅ NEW
  const [error, setError] = useState(null);     // ✅ NEW

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("users/login/", form);

      const { token, role, username } = res.data;

      if (!token || !role) {
        setError("Invalid response from server");
        return;
      }

      // ✅ Store data
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);

      // ✅ Flash success message
      setMessage("Login successful!");
      setError(null);

      // ✅ Redirect after short delay (so user can see message)
      setTimeout(() => {
        if (role === "employer") {
          navigate("/dashboard/employer");
        } else if (role === "jobseeker") {
          navigate("/dashboard/home");
        } else {
          navigate("/");
        }
      }, 1000);

    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Server error. Please try again.";

      setError(errorMsg);
      setMessage(null);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>

        <h3 className="text-center mb-4 fw-bold">Login</h3>

        {/* ✅ SUCCESS MESSAGE */}
        {message && (
          <div className="alert alert-success text-center">
            {message}
          </div>
        )}

        {/* ❌ ERROR MESSAGE */}
        {error && (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Enter username"
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              onChange={handleChange}
              required
            />
          </div>

          {/* Button */}
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>

        </form>

        {/* Divider */}
        <div className="text-center my-3 text-muted">OR</div>

        {/* Register link */}
        <p className="text-center mb-0">
          Don't have an account?{" "}
          <Link to="/register" className="text-decoration-none">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;