import { useEffect, useState } from "react";
import api from "../api/api";

function Applicants({ jobId }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/jobs/${jobId}/applicants/`);
      setApplications(res.data);
    } catch (error) {
      console.error("Error fetching applicants:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;
    fetchApplicants();
  }, [jobId]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/jobs/applications/${id}/status/`, { status });
      fetchApplicants();
    } catch (error) {
      console.error("Error updating status:", error.response || error);
    }
  };

  // 🔹 Status Badge Style
  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return "badge bg-success";
      case "rejected":
        return "badge bg-danger";
      default:
        return "badge bg-warning text-dark";
    }
  };

  if (!jobId) {
    return (
      <div className="text-center mt-5">
        <h5 className="text-danger">❌ No job selected</h5>
        <p className="text-muted">Please select a job from dashboard</p>
      </div>
    );
  }

  return (
    <div className="container py-3">
      <h2 className="mb-4 fw-bold">👀 Applicants</h2>

      {/* 🔹 Loading */}
      {loading && (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2">Loading applicants...</p>
        </div>
      )}

      {/* 🔹 Empty */}
      {!loading && applications.length === 0 && (
        <div className="text-center mt-5">
          <h5 className="text-muted">No applicants yet</h5>
          <p className="text-muted">Wait for candidates to apply 🚀</p>
        </div>
      )}

      {/* 🔥 Applicants Grid */}
      <div className="row g-4">
        {applications.map((app) => (
          <div key={app.id} className="col-12 col-md-6 col-lg-4">
            <div className="card applicant-card h-100 border-0 shadow-sm rounded-4 p-3">

              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="fw-bold mb-0">
                  {app.applicant_username}
                </h5>
                <span className={getStatusBadge(app.status)}>
                  {app.status}
                </span>
              </div>

              {/* Job Info */}
              <p className="text-muted small mb-1">
                <strong>Job:</strong> {app.job_title}
              </p>
              <p className="text-muted small mb-2">
                <strong>Company:</strong> {app.company}
              </p>

              {/* Resume */}
              {app.resume && (
                <a
                  href={app.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary btn-sm mb-3 rounded-3"
                >
                  📄 View Resume
                </a>
              )}

              {/* Actions */}
              <div className="mt-auto d-flex flex-wrap gap-2">
                <button
                  className="btn btn-success btn-sm flex-fill"
                  onClick={() => updateStatus(app.id, "accepted")}
                  disabled={app.status === "accepted"}
                >
                  ✔ Accept
                </button>

                <button
                  className="btn btn-danger btn-sm flex-fill"
                  onClick={() => updateStatus(app.id, "rejected")}
                  disabled={app.status === "rejected"}
                >
                  ✖ Reject
                </button>

                <button
                  className="btn btn-warning btn-sm flex-fill"
                  onClick={() => updateStatus(app.id, "pending")}
                  disabled={app.status === "pending"}
                >
                  ⏳ Pending
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Applicants;