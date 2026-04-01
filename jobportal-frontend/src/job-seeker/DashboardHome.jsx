import { useState } from "react";
import Jobs from "./Jobs";
import Profile from "./Profile";
import Activity from "./Activity";

function DashboardHome() {
  const [tab, setTab] = useState("dashboard");

  const closeSidebar = () => {
    const offcanvasEl = document.getElementById("sidebar");

    if (offcanvasEl && window.bootstrap) {
      const bsOffcanvas =
        window.bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
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
        return <Jobs mode="trending" />;

      case "jobs":
        return <Jobs mode="recommended" />;

      case "profile":
        return <Profile onGoToJobs={() => handleTabChange("jobs")} />;

      case "activity":
        return <Activity />;

      default:
        return null;
    }
  };

  return (
    <div className="container-fluid p-0">

      {/* 🔥 HEADER */}
      <div className="bg-primary bg-gradient text-white p-4 shadow-sm">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">

          <div>
            <h3 className="fw-bold mb-1">👋 Welcome Back</h3>
            <p className="mb-0">
              Find jobs and track your applications easily
            </p>
          </div>

          <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
            <span className="small">
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>

            <div
              className="bg-white text-dark rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px", fontWeight: "bold" }}
            >
              U
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 MOBILE NAV */}
      <nav className="navbar navbar-dark bg-dark d-md-none px-3">
        <button
          className="btn btn-outline-light"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebar"
        >
          ☰
        </button>
        <span className="navbar-brand">JobSeeker</span>
      </nav>

      <div className="row g-0">

        {/* 🔥 SIDEBAR */}
        <div
          className="offcanvas-md offcanvas-start bg-dark text-white col-md-2 p-3"
          id="sidebar"
          style={{ minHeight: "100vh" }}
        >
          <h5 className="mb-4 fw-bold">JobSeeker</h5>

          <button
            className={`btn w-100 text-start mb-2 ${
              tab === "dashboard" ? "btn-primary" : "btn-outline-light"
            }`}
            onClick={() => handleTabChange("dashboard")}
          >
            🏠 Dashboard
          </button>

          <button
            className={`btn w-100 text-start mb-2 ${
              tab === "jobs" ? "btn-primary" : "btn-outline-light"
            }`}
            onClick={() => handleTabChange("jobs")}
          >
            📋 Jobs
          </button>

          <button
            className={`btn w-100 text-start mb-2 ${
              tab === "profile" ? "btn-primary" : "btn-outline-light"
            }`}
            onClick={() => handleTabChange("profile")}
          >
            👤 Profile
          </button>

          <button
            className={`btn w-100 text-start mb-2 ${
              tab === "activity" ? "btn-primary" : "btn-outline-light"
            }`}
            onClick={() => handleTabChange("activity")}
          >
            📊 Activity
          </button>
        </div>

        {/* 🔥 MAIN CONTENT */}
        <div className="col-12 col-md-10 p-4 bg-light min-vh-100">
          {renderContent()}
        </div>

      </div>
    </div>
  );
}

export default DashboardHome;