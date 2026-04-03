import { useEffect, useState } from "react";
import api from "../api/api";

function DashboardHome({ setSelectedJobId, setTab }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyJobs = async () => {
    try {
      const res = await api.get("/jobs/my-jobs/");
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  return (
    <div>
      <h2>📊 My Posted Jobs</h2>

      {loading ? (
        <p>Loading...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
            }}
          >
            <h4>{job.title}</h4>
            <p>{job.description}</p>
            <p>
              <strong>Skills:</strong> {job.skills_required}
            </p>

            {/* 🔥 ADD THIS BUTTON */}
            <button
              className="btn btn-primary mt-2"
              onClick={() => {
                console.log("Selected Job ID:", job.id); // debug
                setSelectedJobId(job.id);  // ✅ PASS JOB ID
                setTab("applicants");      // ✅ SWITCH TAB
              }}
            >
              👀 View Applicants
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default DashboardHome;