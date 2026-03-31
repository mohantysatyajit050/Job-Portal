import { useEffect, useState } from "react";
import api from "../api/api";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [files, setFiles] = useState({});
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    checkProfileAndFetchJobs();
  }, []);

  const checkProfileAndFetchJobs = async () => {
    try {
      setLoading(true);

      const profileRes = await api.get("/users/profile/");
      const profile = profileRes.data;

      const hasSkills =
        Array.isArray(profile.skills) && profile.skills.length > 0;

      const isComplete =
        profile.is_complete === true || profile.is_complete === "true";

      if (!hasSkills || !isComplete) {
        setProfileComplete(false);
        setJobs([]);
        return;
      }

      setProfileComplete(true);

      let jobRes;
      try {
        jobRes = await api.get("/jobs/filter/");
      } catch {
        jobRes = await api.get("/jobs/");
      }

      setJobs(jobRes.data || []);
    } catch (err) {
      console.error(err);
      setProfileComplete(false);
    } finally {
      setLoading(false);
    }
  };

  const applyJob = async (jobId) => {
    const file = files[jobId];

    if (!file) {
      alert("Please upload resume 📄");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await api.post(`/jobs/apply/${jobId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Applied successfully ✅");
      setAppliedJobs((prev) => [...prev, jobId]);
    } catch (err) {
      alert(err.response?.data?.message || "Already applied ❌");
    }
  };

  return (
    <div className="container py-4">

      <h2 className="mb-4 text-center fw-bold">
        🎯 Recommended Jobs
      </h2>

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2">Loading jobs...</p>
        </div>
      )}

      {!loading && !profileComplete && (
        <div className="alert alert-danger text-center shadow">
          <h4>⚠️ Profile Incomplete</h4>
          <p>
            Complete your profile (skills, resume, experience) to see job recommendations.
          </p>

          <button
            className="btn btn-danger mt-2"
            onClick={() => (window.location.href = "/dashboard/profile")}
          >
            Complete Profile
          </button>
        </div>
      )}

      {!loading && profileComplete && (
        <div className="row g-4">

          {jobs.length === 0 ? (
            <div className="col-12 text-center">
              <p className="text-muted fs-5">No matching jobs found 🔍</p>
            </div>
          ) : (
            jobs.map((job) => {
              const isApplied = appliedJobs.includes(job.id);

              return (
                <div className="col-md-4" key={job.id}>
                  <div className="card h-100 shadow-sm border-0">

                    <div className="card-body d-flex flex-column">

                      <h5 className="card-title fw-bold">
                        {job.title}
                      </h5>

                      <p className="mb-1">
                        <b>🏢 Company:</b> {job.company}
                      </p>

                      <p className="mb-1">
                        <b>📍 Location:</b> {job.location}
                      </p>

                      <p className="text-muted small">
                        {job.description}
                      </p>

                      <hr />

                      {/* FILE INPUT */}
                      <div className="mb-2">
                        <label className="form-label">
                          Upload Resume
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) =>
                            setFiles({
                              ...files,
                              [job.id]: e.target.files[0],
                            })
                          }
                        />
                      </div>

                      {/* APPLY BUTTON */}
                      <button
                        className={`btn mt-auto ${
                          isApplied ? "btn-secondary" : "btn-success"
                        }`}
                        onClick={() => applyJob(job.id)}
                        disabled={isApplied}
                      >
                        {isApplied ? "✔ Applied" : "Apply Now"}
                      </button>

                    </div>

                  </div>
                </div>
              );
            })
          )}

        </div>
      )}
    </div>
  );
}

export default Jobs;