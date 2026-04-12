import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

function AdminApplicants() {
  const { jobId } = useParams();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = () => {
    api.get(`/jobs/admin/jobs/${jobId}/applicants/`)
      .then(res => setApps(res.data))
      .catch(err => console.error(err));
  };

  const shortlist = (id) => {
    api.patch(`/api/jobs/admin/applications/${id}/shortlist/`)
      .then(() => {
        alert("Candidate Shortlisted ✅");
        fetchApplicants(); // refresh
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Applicants</h2>

      {apps.map(app => (
        <div key={app.id} style={{border: "1px solid black", margin: "10px", padding: "10px"}}>
          <p><b>User:</b> {app.applicant}</p>
          <p><b>Status:</b> {app.status}</p>

          {app.resume && (
            <a href={app.resume} target="_blank">View Resume</a>
          )}

          <br />

          {app.status !== "shortlisted" && (
            <button onClick={() => shortlist(app.id)}>
              Shortlist
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminApplicants;