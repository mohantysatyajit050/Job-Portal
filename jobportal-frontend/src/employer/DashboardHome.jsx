import { useEffect, useState } from "react";
import api from "../api/api";

function DashboardHome({ setSelectedJobId, setTab }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyJobs = async () => {
    try {
      setError(null);
      const res = await api.get("/jobs/my-jobs/");
      setJobs(res.data);
    } catch (err) {
      setError("Failed to load jobs. Please try again.");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleViewApplicants = (jobId) => {
    setSelectedJobId(jobId);
    setTab("applicants");
  };

  if (loading) return <p className="text-center mt-4" style={{ color: "#6c757d" }}>⏳ Loading...</p>;
  if (error) return <p className="alert" style={{ backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb", borderRadius: "4px", padding: "10px 15px" }}>{error}</p>;

  return (
    <div className="container mt-4" style={{ backgroundColor: "#f5f7fa", padding: "20px", borderRadius: "8px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: "#2c3e50" }}>📊 My Posted Jobs</h2>
        <button 
          className="btn" 
          onClick={fetchMyJobs}
          style={{ 
            backgroundColor: "#27ae60", 
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#229954"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#27ae60"}
        >
          🔄 Refresh
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="alert" style={{ backgroundColor: "#d1ecf1", color: "#0c5460", border: "1px solid #bee5eb", borderRadius: "4px", padding: "10px 15px" }}>No jobs posted yet.</div>
      ) : (
        <div className="row">
          {jobs.map((job) => (
            <div key={job.id} className="col-md-6 mb-3">
              <div className="card h-100" style={{ 
                backgroundColor: "#e8f4fc", 
                border: "1px solid #bee5eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s, box-shadow 0.3s"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
              }}>
                <div className="card-body">
                  <h5 className="card-title" style={{ color: "#1a5276" }}>{job.title}</h5>
                  <p className="card-text" style={{ color: "#34495e" }}>{job.description}</p>
                  <p className="text-muted" style={{ color: "#5d6d7e" }}>
                    <strong>Skills:</strong> {job.skills_required}
                  </p>
                  <button
                    className="btn w-100"
                    onClick={() => handleViewApplicants(job.id)}
                    style={{ 
                      backgroundColor: "#3498db", 
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "background-color 0.3s"
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#2980b9"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#3498db"}
                  >
                    👀 View Applicants
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardHome;