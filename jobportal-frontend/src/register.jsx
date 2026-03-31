import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api/api";
import "./register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  // ✅ FIX ADDED HERE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("FORM DATA:", form);

    if (!form.role) {
      alert("Please select a role");
      return;
    }

    try {
      const res = await api.post("users/register/", form);

      alert(res.data.message || "Registered successfully");
      navigate("/");

    } catch (err) {
      console.error("REGISTER ERROR:", err);

      if (err.response && err.response.data) {
        alert(err.response.data.error);
      } else {
        alert("Server error. Please try again.");
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              name="username"
              placeholder="Enter username"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              name="email"
              type="email"
              placeholder="Enter email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          <button className="register-btn">
            Register
          </button>
        </form>

        <div className="register-link">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;