import { useEffect, useState } from "react";
import api from "../api/api";

function Applicants({ jobId }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch applicants
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

  // ✅ ONLY RUN WHEN jobId EXISTS
  useEffect(() => {
    if (!jobId) {
      console.warn("❌ jobId is missing");
      return;
    }

    fetchApplicants();
  }, [jobId]);

  // 🔹 Update status
  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/jobs/applications/${id}/status/`, {
        status,
      });

      fetchApplicants(); // refresh
    } catch (error) {
      console.error("Error updating status:", error.response || error);
    }
  };

  // ✅ IMPORTANT: Stop rendering if no jobId
  if (!jobId) {
    return <p className="text-danger">❌ No job selected</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Applicants</h2>

      {loading && <p>Loading applicants...</p>}

      {!loading && applications.length === 0 && (
        <p>No applicants found for this job.</p>
      )}

      {applications.map((app) => (
        <div key={app.id} className="card p-3 mb-3 shadow-sm">
          <p><strong>Applicant:</strong> {app.applicant_username}</p>
          <p><strong>Job:</strong> {app.job_title}</p>
          <p><strong>Company:</strong> {app.company}</p>
          <p><strong>Status:</strong> {app.status}</p>

          {app.resume && (
            <p>
              <a href={app.resume} target="_blank" rel="noreferrer">
                📄 View Resume
              </a>
            </p>
          )}

          <div>
            <button
              className="btn btn-success me-2"
              onClick={() => updateStatus(app.id, "accepted")}
              disabled={app.status === "accepted"}
            >
              Accept
            </button>

            <button
              className="btn btn-danger me-2"
              onClick={() => updateStatus(app.id, "rejected")}
              disabled={app.status === "rejected"}
            >
              Reject
            </button>

            <button
              className="btn btn-warning"
              onClick={() => updateStatus(app.id, "pending")}
              disabled={app.status === "pending"}
            >
              Pending
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Applicants;