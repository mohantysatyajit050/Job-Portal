import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // 🔥 Active link highlight
  const isActive = (path) => location.pathname.includes(path);

  return (
    <nav className="navbar-dashboard">

      {/* 🔷 LEFT: Logo */}
      <h2
        className="navbar-logo"
        onClick={() => navigate("/dashboard/home")}
      >
        JobPortal
      </h2>

      {/* 🔗 CENTER LINKS */}
      <div className="navbar-center">

        <Link
          to="/dashboard/home"
          className={`navbar-link ${isActive("/dashboard/home") ? "active" : ""}`}
        >
          Home
        </Link>

        <Link
          to="/dashboard/jobs"
          className={`navbar-link ${isActive("/dashboard/jobs") ? "active" : ""}`}
        >
          Jobs
        </Link>

        {/* ❌ Activity removed */}

      </div>

      {/* 👉 RIGHT SIDE */}
      <div className="navbar-right">

        {/* 👤 Profile */}
        <Link
          to="/dashboard/profile"
          className={`profile-btn ${isActive("/dashboard/profile") ? "active-profile" : ""}`}
        >
          👤 Profile
        </Link>

        {/* 🚪 Logout */}
        <button onClick={handleLogout} className="navbar-logout">
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;