import { useNavigate } from "react-router-dom";

function EmployerDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px" }}>
      <h1>🏢 Employer Dashboard</h1>
      <p style={{ marginBottom: "30px" }}>
        Welcome! Manage your jobs and applicants here.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Post Job Card */}
        <div
          style={cardStyle}
          onClick={() => navigate("/post-job")}
        >
          <h3>➕ Post Job</h3>
          <p>Create a new job listing</p>
        </div>

        {/* My Jobs Card */}
        <div
          style={cardStyle}
          onClick={() => navigate("/my-jobs")}
        >
          <h3>📋 My Jobs</h3>
          <p>View and manage your posted jobs</p>
        </div>

        {/* Applicants Card */}
        <div
          style={cardStyle}
          onClick={() => navigate("/applicants")}
        >
          <h3>👀 Applicants</h3>
          <p>See who applied to your jobs</p>
        </div>
      </div>
    </div>
  );
}

/* ✅ Reusable Card Style */
const cardStyle = {
  padding: "20px",
  borderRadius: "10px",
  background: "#f5f5f5",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  transition: "0.3s",
};

export default EmployerDashboard;