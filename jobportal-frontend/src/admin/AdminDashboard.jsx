import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/jobs/admin/jobs/")
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Admin Dashboard - Jobs</h2>

      {jobs.map(job => (
        <div key={job.id} style={{border: "1px solid gray", margin: "10px", padding: "10px"}}>
          <h3>{job.title}</h3>
          <p>{job.company}</p>

          <button onClick={() => navigate(`/admin/job/${job.id}`)}>
            View Applicants
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;