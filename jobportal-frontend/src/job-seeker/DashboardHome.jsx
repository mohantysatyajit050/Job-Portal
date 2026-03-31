import { useState } from "react";
import Jobs from "./Jobs";
import Profile from "./Profile";

function DashboardHome() {
  const [tab, setTab] = useState("dashboard");

  // ✅ Close sidebar function (important for mobile)
  const closeSidebar = () => {
    const offcanvasEl = document.getElementById("sidebar");
    const bsOffcanvas =
      window.bootstrap?.Offcanvas?.getInstance(offcanvasEl);

    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }
  };

  const handleTabChange = (tabName) => {
    setTab(tabName);
    closeSidebar();
  };

  const renderContent = () => {
    switch (tab) {
      case "dashboard":
        return <h3>🏠 Dashboard Content</h3>;
      case "jobs":
        return <Jobs />;
      case "profile":
        return <Profile />;
      case "activity":
        return <h3>📊 Activity Content</h3>;
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">

        {/* 🔹 MOBILE TOP BAR (HAMBURGER) */}
        <nav className="navbar navbar-dark bg-dark d-md-none w-100">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#sidebar"
            >
              ☰
            </button>
            <span className="navbar-brand">JobSeeker</span>
          </div>
        </nav>

        {/* 🔹 SIDEBAR */}
        <div
          className="offcanvas-md offcanvas-start bg-dark text-white col-md-2 p-3"
          id="sidebar"
          style={{ minHeight: "100vh" }}
        >
          <h5 className="mb-4">JobSeeker</h5>

          <button
            className={`btn btn-dark w-100 text-start mb-2 ${
              tab === "dashboard" && "bg-secondary"
            }`}
            onClick={() => handleTabChange("dashboard")}
          >
            🏠 Dashboard
          </button>

          <button
            className={`btn btn-dark w-100 text-start mb-2 ${
              tab === "jobs" && "bg-secondary"
            }`}
            onClick={() => handleTabChange("jobs")}
          >
            📋 Jobs
          </button>

          <button
            className={`btn btn-dark w-100 text-start mb-2 ${
              tab === "profile" && "bg-secondary"
            }`}
            onClick={() => handleTabChange("profile")}
          >
            👤 Profile
          </button>

          <button
            className={`btn btn-dark w-100 text-start mb-2 ${
              tab === "activity" && "bg-secondary"
            }`}
            onClick={() => handleTabChange("activity")}
          >
            📊 Activity
          </button>
        </div>

        {/* 🔹 CONTENT AREA */}
        <div className="col-12 col-md-10 p-4">
          {renderContent()}
        </div>

      </div>
    </div>
  );
}

export default DashboardHome;