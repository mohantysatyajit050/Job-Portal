import { useEffect, useState } from "react";
import api from "../api/api";

function DashboardHome({ changeTab }) {
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
    <div className="container-fluid">
      <h2 className="mb-4 fw-bold">📊 My Posted Jobs</h2>

      {/* 🔹 Loading */}
      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2">Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        /* 🔹 Empty State */
        <div className="text-center mt-5">
          <h5 className="text-muted">No jobs posted yet</h5>
          <p className="text-muted">Start by posting a new job 🚀</p>
        </div>
      ) : (
        /* 🔥 JOB CARDS */
        <div className="row g-4">
          {jobs.map((job) => (
            <div key={job.id} className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm h-100 border-0 rounded-4 job-card">
                <div className="card-body d-flex flex-column">

                  {/* Title */}
                  <h5 className="card-title fw-bold mb-2">
                    {job.title}
                  </h5>

                  {/* Description */}
                  <p className="text-muted small flex-grow-1">
                    {job.description?.slice(0, 100)}...
                  </p>

                  {/* Skills */}
                  <p className="mb-2">
                    <strong>Skills:</strong>{" "}
                    <span className="text-primary">
                      {job.skills_required}
                    </span>
                  </p>

                  {/* Button */}
                  <button
                    className="btn btn-primary mt-auto w-100 rounded-3"
                    onClick={() => changeTab("applicants", job.id)}
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