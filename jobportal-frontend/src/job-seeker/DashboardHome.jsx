import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Jobs from "./Jobs";
import Profile from "./Profile";
import Activity from "./Activity";

const API_BASE = "http://127.0.0.1:8000"; // 🔧 Change if your backend URL differs

function DashboardHome() {
  const [tab, setTab] = useState("dashboard");

  // ✅ Real user state from backend
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    avatar: null,
    skills: [],
    is_complete: false,
  });

  // ✅ Real stats from backend (with fallback defaults)
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    jobMatches: 0,
  });

  const [notifications, setNotifications] = useState([
    { id: 1, text: "New job match for Senior Developer", read: false, time: "2h ago" },
    { id: 2, text: "Your profile was viewed by 5 companies", read: false, time: "5h ago" },
    { id: 3, text: "Application status updated", read: true, time: "1d ago" },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  // ✅ Fetch real profile from backend on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch Profile
    fetch(`${API_BASE}/api/users/profile/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setUser({
          name: data.username || "User",
          email: data.email || "",
          role: data.role || "jobseeker",
          avatar: null,
          skills: data.skills || [],
          is_complete: data.is_complete || false,
        });
      })
      .catch((err) => console.error("Profile fetch error:", err))
      .finally(() => setProfileLoading(false));

    // ✅ Fetch real stats safely
    fetch(`${API_BASE}/api/users/applications/stats/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          // ❌ API not found or error
          console.warn("Stats API not available:", res.status);
          return null;
        }

        try {
          return await res.json();
        } catch (err) {
          console.error("Invalid JSON from stats API");
          return null;
        }
      })
      .then((data) => {
        if (!data) return;

        setStats({
          applications: data.total_applications ?? 0,
          interviews: data.interviews ?? 0,
          jobMatches: data.job_matches ?? 0,
        });
      })
      .catch((err) => {
        console.error("Stats fetch error:", err);
      });
  }, [navigate]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Real logout — calls backend to delete token
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_BASE}/api/users/logout/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      navigate("/login");
    }
  };

  const closeSidebar = () => {
    const offcanvasEl = document.getElementById("sidebar");
    // Check if bootstrap is loaded on window
    const bsOffcanvas = window.bootstrap?.Offcanvas?.getInstance(offcanvasEl);
    if (bsOffcanvas) bsOffcanvas.hide();
  };

  const handleTabChange = (tabName) => {
    setIsLoading(true);
    setTab(tabName);
    closeSidebar();
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ✅ Generate initials from username
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    switch (tab) {
      case "dashboard":
        return (
          <>
            {/* Welcome Section */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="bg-gradient-primary rounded-3 p-4 text-white shadow-sm">
                  {/* ✅ Real username from backend */}
                  <h2 className="mb-1">
                    Welcome back, {profileLoading ? "..." : user.name.split(" ")[0]}! 👋
                  </h2>
                  <p className="mb-0 opacity-75">
                    Here's what's happening with your job search today.
                  </p>
                  {/* ✅ Profile completion warning */}
                  {!profileLoading && !user.is_complete && (
                    <div className="mt-2">
                      <span
                        className="badge bg-warning text-dark"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleTabChange("profile")}
                      >
                        ⚠️ Complete your profile to get better matches
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ✅ Stats Cards — real data from backend */}
            <div className="row mb-4">
              {[
                {
                  value: stats.applications,
                  label: "Applications",
                  color: "primary",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M21 13.255A6 6 0 0112 19.255A6 6 0 013 13.255V11.5A8.5 8.5 0 0111.5 3h1A8.5 8.5 0 0121 11.5v1.755z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 11v6M15 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                },
                {
                  value: stats.interviews,
                  label: "Interviews",
                  color: "success",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                },
                {
                  value: unreadCount,
                  label: "New Alerts",
                  color: "warning",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                },
                {
                  value: stats.jobMatches,
                  label: "Job Matches",
                  color: "info",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                },
              ].map((stat, i) => (
                <div className="col-md-3 col-sm-6 mb-3" key={i}>
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className={`flex-shrink-0 bg-${stat.color} bg-opacity-10 rounded-3 p-3 text-${stat.color}`}>
                          {stat.icon}
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h3 className="mb-0 fw-bold">
                            {profileLoading ? (
                              <span className="placeholder col-4"></span>
                            ) : (
                              stat.value
                            )}
                          </h3>
                          <p className="mb-0 text-muted small">{stat.label}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Quick Actions</h5>
                    <div className="d-flex flex-wrap gap-2">
                      <button className="btn btn-primary btn-sm" onClick={() => handleTabChange("jobs")}>
                        + New Search
                      </button>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => handleTabChange("profile")}>
                        ✏️ Update Profile
                      </button>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => handleTabChange("profile")}>
                        📄 Upload Resume
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Jobs - Enhanced Style */}
            <div className="row">
              <div className="col-12">
                <div className="card border-0 shadow-sm overflow-hidden">
                  <div className="card-header bg-gradient-primary text-white p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h3 className="mb-1 d-flex align-items-center">
                          <span className="me-2">🔥</span>
                          Trending Jobs
                        </h3>
                        <p className="mb-0 opacity-75">Hot opportunities that match your profile</p>
                      </div>
                      <button 
                        className="btn btn-light btn-sm px-4" 
                        onClick={() => handleTabChange("jobs")}
                      >
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <div className="trending-jobs-container">
                      <Jobs mode="trending" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case "jobs":
        return (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="mb-1">🎯 Recommended Jobs</h3>
                <p className="text-muted mb-0">Based on your profile and preferences</p>
              </div>
            </div>
            <Jobs mode="recommended" />
          </>
        );

      case "profile":
        return (
          <Profile
            onGoToJobs={() => setTab("jobs")}
            user={user}
            setUser={setUser}
          />
        );

      case "activity":
        return <Activity />;

      default:
        return null;
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "jobs", label: "Jobs", icon: "📋" },
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "activity", label: "Activity", icon: "📊" },
  ];

  return (
    <div className="container-fluid p-0">
      {/* ✅ Top Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
        <div className="container-fluid">
          <button
            className="navbar-toggler d-md-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebar"
            aria-controls="sidebar"
            aria-label="Toggle navigation"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
            <div className="bg-primary rounded p-1 me-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M20 7h-7m0 0l3 3m-3-3l-3 3M8 7H4a1 1 0 00-1 1v10a1 1 0 001 1h4m5-11v11m0 0h7a1 1 0 001-1V8a1 1 0 00-1-1h-7m-5 11V9a1 1 0 011-1h3a1 1 0 011 1v9"/>
              </svg>
            </div>
            <span className="fw-bold">JobSeeker</span>
          </Link>

          {/* Search Bar */}
          <form className="d-none d-md-flex mx-auto" style={{ maxWidth: "400px", width: "100%" }} onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control border-end-0"
                placeholder="Search jobs, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-outline-secondary" type="submit">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </form>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-3">

            {/* 🔔 Notifications */}
            <div className="position-relative" ref={notificationRef}>
              <button
                className="btn btn-link text-dark position-relative p-1"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="position-absolute end-0 mt-2" style={{ zIndex: 1000, minWidth: "300px" }}>
                  <div className="card shadow-sm">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Notifications</h6>
                      <button className="btn btn-sm btn-link text-primary p-0" onClick={markAllRead}>
                        Mark all read
                      </button>
                    </div>
                    <div className="card-body p-0">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 border-bottom ${!notif.read ? "bg-light" : ""}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => markNotificationAsRead(notif.id)}
                        >
                          <div className="d-flex">
                            <div className="flex-grow-1">
                              <p className="mb-1 small">{notif.text}</p>
                              <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>{notif.time}</p>
                            </div>
                            {!notif.read && (
                              <div className="flex-shrink-0">
                                <span className="badge bg-primary rounded-pill">New</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="card-footer bg-white text-center">
                      <button className="btn btn-sm btn-link text-primary p-0">View all notifications</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ✅ User Avatar + Menu with real name & logout */}
            <div className="position-relative" ref={userMenuRef}>
              <button
                className="btn btn-link text-dark p-1 d-flex align-items-center"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {/* ✅ Avatar circle with real initials */}
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2 fw-bold"
                  style={{ width: "36px", height: "36px", fontSize: "14px", flexShrink: 0 }}
                >
                  {profileLoading ? "..." : getInitials(user.name)}
                </div>
                {/* ✅ Real username from backend */}
                <span className="d-none d-md-inline fw-semibold">
                  {profileLoading ? "Loading..." : user.name}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ms-1">
                  <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {showUserMenu && (
                <div className="position-absolute end-0 mt-2" style={{ zIndex: 1000, minWidth: "220px" }}>
                  <div className="card shadow-sm">
                    <div className="card-body p-0">

                      {/* ✅ User info header */}
                      <div className="p-3 border-bottom d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                          style={{ width: "40px", height: "40px", fontSize: "14px" }}
                        >
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <p className="mb-0 fw-semibold" style={{ fontSize: "14px" }}>{user.name}</p>
                          <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>{user.email}</p>
                          <span className="badge bg-secondary" style={{ fontSize: "10px" }}>{user.role}</span>
                        </div>
                      </div>

                      {/* Menu items */}
                      <button
                        className="dropdown-item d-flex align-items-center p-2 w-100 text-start border-0 bg-transparent"
                        onClick={() => { handleTabChange("profile"); setShowUserMenu(false); }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
                          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        My Profile
                      </button>

                      <button className="dropdown-item d-flex align-items-center p-2 w-100 text-start border-0 bg-transparent">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
                          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Settings
                      </button>

                      <div className="border-top">
                        {/* ✅ Real logout button */}
                        <button
                          className="dropdown-item d-flex align-items-center p-2 w-100 text-start border-0 bg-transparent text-danger"
                          onClick={handleLogout}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
                            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="row g-0">
        {/* Sidebar */}
        <div
          className="offcanvas-md offcanvas-start bg-white border-end col-md-3 col-lg-2 p-0"
          id="sidebar"
          tabIndex="-1"
          aria-labelledby="sidebarLabel"
          style={{ minHeight: "calc(100vh - 56px)" }}
        >
          <div className="p-3 border-bottom">
            <h6 className="mb-0 text-muted">Navigation</h6>
          </div>
          <nav className="nav flex-column p-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-link d-flex align-items-center px-3 py-2 rounded mb-1 border-0 ${
                  tab === item.id ? "bg-primary text-white" : "text-dark"
                }`}
                style={{ cursor: "pointer", background: tab === item.id ? undefined : "transparent" }}
                onClick={() => handleTabChange(item.id)}
              >
                <span className="me-3">{item.icon}</span>
                <span>{item.label}</span>
                {tab === item.id && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ms-auto">
                    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="mt-auto p-3 border-top">
            <div className="card bg-light border-0">
              <div className="card-body p-3">
                <h6 className="card-title small mb-2">Upgrade to Pro</h6>
                <p className="card-text small text-muted mb-2">Get unlimited job alerts and advanced features</p>
                <button className="btn btn-primary btn-sm w-100">Upgrade Now</button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-12 col-md-9 col-lg-10 p-4 bg-light">
          {renderContent()}
        </div>
      </div>

      <style>{`
        .hover-bg-light:hover { background-color: #f8f9fa !important; }
        .bg-gradient-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .trending-jobs-container {
          background: linear-gradient(to bottom, #f8f9ff, #ffffff);
          padding: 1.5rem;
        }
        .trending-jobs-container .job-card {
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }
        .trending-jobs-container .job-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          border-left-color: #667eea;
        }
        .trending-jobs-container .job-card .badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
        }
      `}</style>
    </div>
  );
}

export default DashboardHome;