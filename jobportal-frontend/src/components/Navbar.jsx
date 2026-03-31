import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3 d-flex justify-content-between">

      {/* LEFT SIDE */}
      <Link className="navbar-brand fw-bold" to="/">
        JobPortal
      </Link>

      {/* RIGHT SIDE */}
      <div className="d-flex align-items-center gap-2">

        {/* NOT LOGGED IN */}
        {!token && (
          <>
            <Link className="btn btn-outline-light btn-sm" to="/login">
              Login
            </Link>

            <Link className="btn btn-success btn-sm" to="/register">
              Register
            </Link>
          </>
        )}

        {/* LOGGED IN */}
        {token && (
          <div className="dropdown">
            {/* ✅ FIXED BUTTON */}
            <button
              className="btn btn-secondary dropdown-toggle d-flex align-items-center"
              type="button"
              data-bs-toggle="dropdown"   // ✅ REQUIRED
              aria-expanded="false"       // ✅ REQUIRED
            >
              👤 {username || "User"}
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <span className="dropdown-item-text">
                  Signed in as <b>{username || "User"}</b>
                </span>
              </li>

              <li><hr className="dropdown-divider" /></li>

              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </li>
            </ul>
          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;