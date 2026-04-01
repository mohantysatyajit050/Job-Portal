import { useState } from "react";
import DashboardHome from "./DashboardHome";
import PostJob from "./PostJob";
import Applicants from "./Applicants";

function EmployerDashboard() {
  const [tab, setTab] = useState("dashboard");
  const [selectedJobId, setSelectedJobId] = useState(null);

  // 🔥 FIXED: Always close sidebar
  const closeSidebar = () => {
    const sidebar = document.getElementById("employerSidebar");

    if (sidebar && window.bootstrap) {
      const bsOffcanvas =
        window.bootstrap.Offcanvas.getOrCreateInstance(sidebar);

      bsOffcanvas.hide();
    }
  };

  // 🔥 Central tab handler
  const changeTab = (tabName, jobId = null) => {
    setTab(tabName);
    if (jobId) setSelectedJobId(jobId);

    closeSidebar(); // always close
  };

  // 🔹 Render content
  const renderContent = () => {
    switch (tab) {
      case "dashboard":
        return <DashboardHome changeTab={changeTab} />;

      case "post":
        return <PostJob />;

      case "applicants":
        return <Applicants jobId={selectedJobId} />;

      default:
        return null;
    }
  };

  return (
    <div className="container-fluid p-0">

      {/* 🔹 TOP NAVBAR (MOBILE) */}
      <nav className="navbar navbar-dark bg-dark d-md-none px-3">
        <button
          className="btn btn-outline-light"
          data-bs-toggle="offcanvas"
          data-bs-target="#employerSidebar"
        >
          ☰
        </button>
        <span className="navbar-brand mb-0 h6">Employer Panel</span>
      </nav>

      <div className="row g-0">

        {/* 🔹 SIDEBAR */}
        <div
          className="offcanvas-md offcanvas-start bg-dark text-white col-md-2 p-3 shadow-lg"
          id="employerSidebar"
          style={{ minHeight: "100vh" }}
        >
          <h5 className="mb-4">Employer</h5>

          <button
            className={`btn btn-dark w-100 text-start mb-2 ${
              tab === "dashboard" ? "bg-secondary" : ""
            }`}
            onClick={() => changeTab("dashboard")}
          >
            🏢 Dashboard
          </button>

          <button
            className={`btn btn-dark w-100 text-start mb-2 ${
              tab === "post" ? "bg-secondary" : ""
            }`}
            onClick={() => changeTab("post")}
          >
            ➕ Post Job
          </button>

          <button
            className={`btn btn-dark w-100 text-start mb-2 ${
              tab === "applicants" ? "bg-secondary" : ""
            }`}
            onClick={() => changeTab("applicants")}
          >
            👀 Applicants
          </button>
        </div>

        {/* 🔹 MAIN CONTENT */}
        <div className="col-12 col-md-10 p-3 p-md-4 bg-light min-vh-100">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default EmployerDashboard;