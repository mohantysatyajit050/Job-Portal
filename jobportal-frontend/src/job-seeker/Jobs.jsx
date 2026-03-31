import { useEffect, useState } from "react";
import api from "../api/api";

function Jobs({ mode = "recommended" }) {
  const [jobs, setJobs] = useState([]);
  const [files, setFiles] = useState({});
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [mode]);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      let jobRes;

      if (mode === "trending") {
        jobRes = await api.get("/jobs/");
        setProfileComplete(true);
      } else {
        const profileRes = await api.get("/users/profile/");
        const profile = profileRes.data;

        const hasSkills =
          (Array.isArray(profile.skills) && profile.skills.length > 0) ||
          (typeof profile.skills === "string" && profile.skills.trim() !== "");

        const isComplete = profile.is_complete === true;

        if (!hasSkills || !isComplete) {
          setProfileComplete(false);
          setJobs([]);
          return;
        }

        setProfileComplete(true);

        try {
          jobRes = await api.get("/jobs/filter/");
        } catch {
          jobRes = await api.get("/jobs/");
        }
      }

      setJobs(jobRes.data || []);
    } catch (err) {
      console.error("Fetch Jobs Error:", err);
      setProfileComplete(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED APPLY FUNCTION
  const applyJob = async (jobId) => {
    const file = files[jobId];

    if (!file) {
      alert("Please upload resume 📄");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await api.post(`/jobs/apply/${jobId}/`, formData);

      console.log("SUCCESS:", res.data);

      alert("Applied successfully ✅");

      setAppliedJobs((prev) => [...prev, jobId]);
    } catch (err) {
      // 🔥 FULL DEBUG (VERY IMPORTANT)
      console.log("FULL ERROR:", err);
      console.log("ERROR RESPONSE:", err.response);
      console.log("ERROR DATA:", err.response?.data);

      alert(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Application failed ❌"
      );
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center fw-bold">
        {mode === "trending" ? "🔥 Trending Jobs" : "🎯 Recommended Jobs"}
      </h2>

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2">Loading jobs...</p>
        </div>
      )}

      {!loading && mode === "recommended" && !profileComplete && (
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

      {!loading && jobs.length === 0 && profileComplete && (
        <p className="text-center text-muted fs-5">
          No jobs found 🔍
        </p>
      )}

      {!loading && jobs.length > 0 && (
        <div className="row g-4">
          {jobs.map((job) => {
            const isApplied = appliedJobs.includes(job.id);

            return (
              <div className="col-md-4" key={job.id}>
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{job.title}</h5>

                    <p><b>🏢 Company:</b> {job.company}</p>
                    <p><b>📍 Location:</b> {job.location}</p>

                    <p className="text-muted small">
                      {job.description}
                    </p>

                    <hr />

                    {mode === "recommended" && (
                      <input
                        type="file"
                        className="form-control mb-2"
                        onChange={(e) =>
                          setFiles({
                            ...files,
                            [job.id]: e.target.files[0],
                          })
                        }
                      />
                    )}

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
          })}
        </div>
      )}
    </div>
  );
}

export default Jobs;