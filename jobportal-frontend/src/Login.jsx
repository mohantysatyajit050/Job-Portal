import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/api";
import "./Login.css";

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

      console.log("LOGIN RESPONSE:", res.data);

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

      // ✅ FIXED NAVIGATION (NO Navigate component)
      if (role === "employer") {
       navigate("/dashboard/employer");
      } else if (role === "jobseeker") {
       navigate("/dashboard/home");

      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      if (err.response && err.response.data) {
        alert(err.response.data.error || "Login failed");
      } else {
        alert("Server error. Please try again.");
      }
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className="input-group">
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Login</button>

        <div className="divider">
          <span>OR</span>
        </div>

        <p>
          Don't have an account?{" "}
          <span
            style={{
              color: "#a5b4fc",
              cursor: "pointer",
              fontWeight: "500",
            }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;