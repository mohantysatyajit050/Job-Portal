import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("users/login/", form);

      const { token, role, username } = res.data;

      if (!token || !role) {
        alert("Invalid response from server");
        return;
      }

      // ✅ Store data
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);

      alert("Login successful");

      // ✅ Redirect based on role
      if (role === "employer") {
        navigate("/dashboard/employer");
      } else if (role === "jobseeker") {
        navigate("/dashboard/home");
      } else {
        navigate("/");
      }

    } catch (err) {
      if (err.response && err.response.data) {
        alert(err.response.data.error || "Login failed");
      } else {
        alert("Server error. Please try again.");
      }
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
        
        <h3 className="text-center mb-4 fw-bold">Login</h3>

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