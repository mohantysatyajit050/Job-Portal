import { useState } from "react";

function EmployerDashboard() {
  const [tab, setTab] = useState("dashboard");

  // ✅ Proper sidebar close (safe)
  const closeSidebar = () => {
    const sidebar = document.getElementById("employerSidebar");

    if (sidebar) {
      sidebar.classList.remove("show"); // force close
    }
  };

  const handleTabChange = (tabName) => {
    setTab(tabName);
    closeSidebar(); // ✅ close after click
  };

  const renderContent = () => {
    switch (tab) {
      case "dashboard":
        return <h3>🏢 Employer Dashboard</h3>;
      case "post":
        return <h3>➕ Post Job</h3>;
      case "jobs":
        return <h3>📋 My Jobs</h3>;
      case "applicants":
        return <h3>👀 Applicants</h3>;
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">

        {/* 🔹 MOBILE TOP BAR */}
        <nav className="navbar navbar-dark bg-dark d-md-none w-100">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#employerSidebar"
            >
              ☰
            </button>
            <span className="navbar-brand">Employer</span>
          </div>
        </nav>

        {/* 🔹 SIDEBAR */}
        <div
          className="offcanvas-md offcanvas-start bg-dark text-white col-md-2 p-3"
          id="employerSidebar"
          style={{ minHeight: "100vh" }}
        >
          <h5 className="mb-4">Employer</h5>

          <button
            className={`btn btn-dark w-100 text-start mb-2 ${
              tab === "dashboard" && "bg-secondary"
            }`}
            onClick={() => handleTabChange("dashboard")}
          >
            🏢 Dashboard
          </button>

          <button
            className={`btn btn-dark w-100 text-start mb-2 ${
              tab === "post" && "bg-secondary"
            }`}
            onClick={() => handleTabChange("post")}
          >
            ➕ Post Job
          </button>

          <button
            className={`btn btn-dark w-100 text-start mb-2 ${
              tab === "jobs" && "bg-secondary"
            }`}
            onClick={() => handleTabChange("jobs")}
          >
            📋 My Jobs
          </button>

          <button
            className={`btn btn-dark w-100 text-start mb-2 ${
              tab === "applicants" && "bg-secondary"
            }`}
            onClick={() => handleTabChange("applicants")}
          >
            👀 Applicants
          </button>
        </div>

        {/* 🔹 CONTENT */}
        <div className="col-12 col-md-10 p-4">
          {renderContent()}
        </div>

      </div>
    </div>
  );
}

export default EmployerDashboard;