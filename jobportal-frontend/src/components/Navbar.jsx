import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">

      <Link className="navbar-brand fw-bold" to="/">
        JobPortal
      </Link>

      <button
        className="navbar-toggler"
        data-bs-toggle="collapse"
        data-bs-target="#navMenu"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navMenu">

        <ul className="navbar-nav ms-auto">

          {/* 🌐 PUBLIC */}
          {!token && (
            <>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/login") ? "active" : ""}`}
                  to="/login"
                >
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/register") ? "active" : ""}`}
                  to="/register"
                >
                  Register
                </Link>
              </li>
            </>
          )}

          {/* 🔐 JOBSEEKER */}
          {token && role === "jobseeker" && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard/home">
                  Dashboard
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/dashboard/jobs">
                  Jobs
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/dashboard/profile">
                  Profile
                </Link>
              </li>
            </>
          )}

          {/* 🔐 EMPLOYER */}
          {token && role === "employer" && (
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard/employer">
                Dashboard
              </Link>
            </li>
          )}

          {/* 🔐 LOGOUT */}
          {token && (
            <li className="nav-item">
              <button onClick={handleLogout} className="btn btn-danger ms-3">
                Logout
              </button>
            </li>
          )}

        </ul>

      </div>
    </nav>
  );
}

export default Navbar;