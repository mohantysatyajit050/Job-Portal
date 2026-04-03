import { useState } from "react";
import DashboardHome from "./DashboardHome";
import PostJob from "./PostJob";
import Applicants from "./Applicants";

function EmployerDashboard() {
  const [tab, setTab] = useState("dashboard");
  const [selectedJobId, setSelectedJobId] = useState(null);

  const closeSidebar = () => {
    const sidebar = document.getElementById("employerSidebar");
    if (sidebar) {
      sidebar.classList.remove("show");
    }
  };

  const handleTabChange = (tabName) => {
    setTab(tabName);
    closeSidebar();
  };

  const renderContent = () => {
    switch (tab) {
      case "dashboard":
        return (
          <DashboardHome
            setSelectedJobId={setSelectedJobId}
            setTab={setTab}
          />
        );

      case "post":
        return <PostJob />;

      case "applicants":
        return <Applicants jobId={selectedJobId} />;

      default:
        return null;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">

        {/* SIDEBAR */}
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
              tab === "applicants" && "bg-secondary"
            }`}
            onClick={() => handleTabChange("applicants")}
          >
            👀 Applicants
          </button>
        </div>

        {/* CONTENT */}
        <div className="col-12 col-md-10 p-4">
          {renderContent()}
        </div>

      </div>
    </div>
  );
}

export default EmployerDashboard;