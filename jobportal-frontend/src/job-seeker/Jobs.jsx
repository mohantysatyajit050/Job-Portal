import { useEffect, useState } from "react";
import api from "../api/api";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  // ❌ OLD: single file
  // const [file, setFile] = useState(null);

  // ✅ NEW: store file per job
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
      } catch (err) {
        jobRes = await api.get("/jobs/");
      }

      setJobs(jobRes.data || []);

    } catch (err) {
      console.error("Error:", err);
      setProfileComplete(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED APPLY FUNCTION
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
      console.error(err);
      alert(err.response?.data?.message || "Already applied or error ❌");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Recommended Jobs 🎯</h2>

      {loading && <p>Loading...</p>}

      {!loading && !profileComplete && (
        <div style={styles.alertBox}>
          <h3>⚠️ Profile Incomplete</h3>
          <p>
            Complete your profile (skills, resume, experience) to see job recommendations.
          </p>

          <button
            style={styles.completeBtn}
            onClick={() => (window.location.href = "/dashboard/profile")}
          >
            Complete Profile
          </button>
        </div>
      )}

      {!loading && profileComplete && (
        <>
          <div style={styles.grid}>
            {jobs.length === 0 ? (
              <p>No matching jobs found 🔍</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} style={styles.card}>
                  <h3>{job.title}</h3>
                  <p><b>Company:</b> {job.company}</p>
                  <p><b>Location:</b> {job.location}</p>
                  <p>{job.description}</p>

                  {/* ✅ FILE INPUT PER JOB */}
                  <input
                    type="file"
                    onChange={(e) =>
                      setFiles({
                        ...files,
                        [job.id]: e.target.files[0],
                      })
                    }
                  />

                  <button
                    onClick={() => applyJob(job.id)}
                    disabled={appliedJobs.includes(job.id)}
                    style={
                      appliedJobs.includes(job.id)
                        ? styles.appliedBtn
                        : styles.applyBtn
                    }
                  >
                    {appliedJobs.includes(job.id)
                      ? "Applied"
                      : "Apply"}
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

// 🎨 STYLES (UNCHANGED)
const styles = {
  container: {
    padding: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
  },
  applyBtn: {
    marginTop: "10px",
    padding: "8px",
    backgroundColor: "green",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  appliedBtn: {
    marginTop: "10px",
    padding: "8px",
    backgroundColor: "gray",
    color: "white",
    border: "none",
  },
  alertBox: {
    padding: "25px",
    border: "2px solid #ff4d4f",
    borderRadius: "10px",
    backgroundColor: "#fff1f0",
    textAlign: "center",
    marginTop: "20px",
  },
  completeBtn: {
    marginTop: "15px",
    padding: "10px 15px",
    backgroundColor: "#ff4d4f",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Jobs;