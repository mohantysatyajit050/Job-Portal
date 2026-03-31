import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const [message, setMessage] = useState(null); // ✅ success
  const [error, setError] = useState(null);     // ❌ error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.role) {
      setError("Please select a role");
      setMessage(null);
      return;
    }

    try {
      const res = await api.post("users/register/", form);

      setMessage(res.data.message || "Registered successfully!");
      setError(null);

      // ✅ Redirect after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);

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
      <div
        className="card shadow p-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >

        <h3 className="text-center mb-4 fw-bold">Create Account</h3>

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

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email"
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

          {/* Role */}
          <div className="mb-3">
            <label className="form-label">Select Role</label>
            <select
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">Choose...</option>
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {/* Button */}
          <button className="btn btn-primary w-100">
            Register
          </button>

        </form>

        {/* Login Link */}
        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;