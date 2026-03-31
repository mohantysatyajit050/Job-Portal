import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Dashboard.css";

// Keep your ACTIVITY DATA (no change)
const ACTIVITY_DATA = [
  { label: "Company Approaches", value: 8, icon: "📩", color: "#6c63ff" },
  { label: "Jobs Applied", value: 12, icon: "📋", color: "#00c9a7" },
  { label: "Shortlisted", value: 5, icon: "⭐", color: "#ffd166" },
  { label: "Interviews", value: 3, icon: "🎯", color: "#ef476f" },
];

// (BarChart & MeritScore remain SAME — no change)

function DashboardHome() {
  const navigate = useNavigate();

  const [selectedJob, setSelectedJob] = useState(null);
  const [profileComplete, setProfileComplete] = useState(true);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [jobs, setJobs] = useState([]);              // ✅ NEW (real jobs)
  const [files, setFiles] = useState({});            // ✅ NEW (per job file)
  const [appliedJobs, setAppliedJobs] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("jobs");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get("/users/profile/");
        setProfile(profileRes.data);
        setProfileComplete(profileRes.data.is_complete);

        // ✅ Fetch jobs from backend
        let jobRes;
        try {
          jobRes = await api.get("/jobs/filter/");
        } catch {
          jobRes = await api.get("/jobs/");
        }

        setJobs(jobRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ FILTER LOGIC (UPDATED FOR BACKEND DATA)
  const filteredJobs = (() => {
    let list = jobs;

    if (searchQuery) {
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          j.skills_required?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return list;
  })();

  const meritScore = Math.min(
    100,
    40 +
      (profile?.skills?.length || 0) * 4 +
      (profile?.courses?.length || 0) * 3 +
      appliedJobs.length * 2
  );

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // ✅ APPLY FUNCTION (CONNECTED TO BACKEND)
  const handleApply = async (job) => {
    const file = files[job.id];

    if (!file) {
      alert("Upload resume first 📄");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await api.post(`jobs/apply/${job.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAppliedJobs((prev) => [...prev, job.id]);
      showNotif(`Applied to ${job.title} ✅`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Already applied ❌");
    }
  };

  return (
    <div className="dash-root">
      {notification && <div className="toast">{notification}</div>}

      <aside className="dash-sidebar">
        <div className="sidebar-logo">⚡ JobPulse</div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "jobs" ? "active" : ""}`}
            onClick={() => setActiveTab("jobs")}
          >
            🏠 Dashboard
          </button>

          <button
            className={`nav-item ${activeTab === "activity" ? "active" : ""}`}
            onClick={() => setActiveTab("activity")}
          >
            📊 Activity
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => navigate("/profile")}>
            👤 Profile
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-topbar">
          <div className="topbar-left">
            <h2>Job Recommendations</h2>
            <p>{filteredJobs.length} jobs found</p>
          </div>

          <div className="topbar-right">
            {profile && (
              <div className="user-chip">
                <div className="user-avatar">
                  {profile.username?.[0]?.toUpperCase()}
                </div>
                <span>{profile.username}</span>
              </div>
            )}
          </div>
        </header>

        {!loading && !profileComplete && (
          <div className="profile-alert">
            <div className="alert-icon">⚠️</div>
            <div className="alert-text">
              <strong>Your profile is incomplete!</strong>
              <p>Add skills & resume</p>
            </div>
            <button onClick={() => navigate("/profile")}>
              Complete Now →
            </button>
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === "jobs" && (
          <>
            <div className="search-bar">
              <input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="jobs-layout">
              {/* LEFT LIST */}
              <div className="job-list-panel">
                {filteredJobs.map((job) => {
                  const isApplied = appliedJobs.includes(job.id);

                  return (
                    <div
                      key={job.id}
                      className={`job-card-new ${
                        selectedJob?.id === job.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <h4>{job.title}</h4>
                      <p>{job.company} · {job.location}</p>

                      {isApplied && <span>Applied ✓</span>}
                    </div>
                  );
                })}
              </div>

              {/* RIGHT DETAIL */}
              <div className="job-detail-panel">
                {selectedJob ? (
                  <div className="job-detail-inner">
                    <h2>{selectedJob.title}</h2>
                    <p>{selectedJob.company}</p>

                    <p>📍 {selectedJob.location}</p>
                    <p>💰 {selectedJob.salary}</p>

                    <h4>Skills</h4>
                    <p>{selectedJob.skills_required}</p>

                    <h4>Description</h4>
                    <p>{selectedJob.description}</p>

                    {/* ✅ FILE INPUT */}
                    <input
                      type="file"
                      onChange={(e) =>
                        setFiles({
                          ...files,
                          [selectedJob.id]: e.target.files[0],
                        })
                      }
                    />

                    <button
                      onClick={() => handleApply(selectedJob)}
                      disabled={appliedJobs.includes(selectedJob.id)}
                    >
                      {appliedJobs.includes(selectedJob.id)
                        ? "Applied"
                        : "Apply"}
                    </button>
                  </div>
                ) : (
                  <p>Select a job</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* ACTIVITY TAB (UNCHANGED) */}
      </main>
    </div>
  );
}

export default DashboardHome;