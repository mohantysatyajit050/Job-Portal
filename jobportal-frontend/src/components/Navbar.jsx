// src/components/Navbar.jsx

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll event to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Listen for changes in local storage to update navbar state
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setUsername(localStorage.getItem("username"));
    };
    window.addEventListener('storage', handleStorageChange);
    handleStorageChange(); // Initial check

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUsername(null);
    navigate("/login");
  };

  return (
    <>
      {/* Custom Styles for the Navbar with Effects */}
      <style>{`
        /* --- Base Navbar Styles --- */
        .custom-navbar {
          background-color: #1a1d29;
          border-bottom: 1px solid #343a40;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          padding: 0.75rem 0;
          transition: all 0.3s ease-in-out;
          /* Page Load Animation */
          animation: fadeInDown 0.6s ease-out;
        }

        /* --- Scrolled State Styles --- */
        .custom-navbar.navbar-scrolled {
          padding: 0.5rem 0;
          background-color: rgba(26, 29, 41, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }

        /* --- Brand & Toggler --- */
        .navbar-brand {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff !important;
          transition: color 0.3s ease;
        }
        .navbar-brand:hover {
          color: #4361ee !important;
        }
        .navbar-toggler {
          border-color: rgba(255, 255, 255, 0.5);
        }
        .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.75%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }

        /* --- Main Navigation Links --- */
        .custom-navbar .navbar-nav .nav-link {
          color: #b8bcc8 !important;
          font-weight: 500;
          margin: 0 0.5rem;
          padding: 0.5rem 1rem !important;
          border-radius: 5px;
          position: relative;
          transition: color 0.3s ease;
        }
        .custom-navbar .navbar-nav .nav-link:hover {
          color: #ffffff !important;
          background-color: transparent; /* Removed background for underline effect */
        }
        /* Sliding Underline Effect */
        .custom-navbar .navbar-nav .nav-link::after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 50%;
          width: 0;
          height: 2px;
          background-color: #4361ee;
          transition: all 0.3s ease-in-out;
          transform: translateX(-50%);
        }
        .custom-navbar .navbar-nav .nav-link:hover::after {
          width: 80%;
        }
        
        /* --- User Dropdown --- */
        .user-dropdown-btn {
          background-color: #343a40;
          border: 1px solid #495057;
          color: #ffffff;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          transition: all 0.3s ease;
        }
        .user-dropdown-btn:hover, .user-dropdown-btn:focus {
          background-color: #495057;
          color: #ffffff;
          box-shadow: 0 0 0 0.2rem rgba(67, 97, 238, 0.25);
        }
        .dropdown-menu {
          border: 1px solid #343a40;
          background-color: #212529;
          display: block;
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.2s ease-in-out;
          pointer-events: none; /* Prevent interaction when hidden */
        }
        .dropdown.show .dropdown-menu {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto; /* Allow interaction when shown */
        }
        .dropdown-item {
          color: #b8bcc8;
          transition: all 0.2s ease;
        }
        .dropdown-item:hover {
          background-color: #343a40;
          color: #ffffff;
        }

        /* --- Mobile Menu Animation --- */
        .navbar-collapse {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease-in-out;
        }
        .navbar-collapse.collapsing, .navbar-collapse.show {
          max-height: 500px; /* Adjust as needed */
        }
        
        /* --- Keyframe for Page Load Animation --- */
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <nav className={`navbar navbar-expand-lg custom-navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container-fluid">
          {/* BRAND */}
          <Link className="navbar-brand" to="/">
            JobPortal
          </Link>

          {/* MOBILE TOGGLER */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* COLLAPSIBLE CONTENT */}
          <div className="collapse navbar-collapse" id="navbarContent">
            {/* MAIN NAVIGATION LINKS */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/jobs">Jobs</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/#companies">Companies</Link>
              </li>
            </ul>

            {/* USER ACTIONS */}
            <ul className="navbar-nav">
              {!token && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-success btn-sm ms-2" to="/register">Register</Link>
                  </li>
                </>
              )}

              {token && (
                <li className="nav-item dropdown">
                  <button
                    className="btn user-dropdown-btn dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    👤 {username || "User"}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><span className="dropdown-item-text">Signed in as <b>{username || "User"}</b></span></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" to="/dashboard">📊 Dashboard</Link></li>
                    <li><Link className="dropdown-item" to="/profile">👤 My Profile</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        🚪 Logout
                      </button>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;