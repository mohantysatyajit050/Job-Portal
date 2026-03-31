import { useEffect, useState } from "react";
import api from "../api/api"; // adjust path if needed

function Activity() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/jobs/my-applications/");
      setApplications(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-3">
      <h3>📊 My Activity</h3>

      {applications.length === 0 && <p>No applications found</p>}

      {applications.map((app) => (
        <div key={app.id} className="card p-3 mb-3 shadow-sm">
          <h5>💼 {app.job_title}</h5>
          <p>🏢 {app.company}</p>

          <p>
            📅 Applied:{" "}
            {new Date(app.applied_at).toLocaleDateString()}
          </p>

          <p>
            Status:{" "}
            <span
              className={`badge ${
                app.status === "accepted"
                  ? "bg-success"
                  : app.status === "rejected"
                  ? "bg-danger"
                  : "bg-warning"
              }`}
            >
              {app.status}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

export default Activity;