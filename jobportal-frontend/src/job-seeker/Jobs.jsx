import { useEffect, useState } from "react";
import api from "../api/api";

function Jobs({ mode = "recommended" }) {
  const [jobs, setJobs] = useState([]);
  const [files, setFiles] = useState({});
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const [hoveredJob, setHoveredJob] = useState(null);

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

  const applyJob = async (jobId) => {
    const file = files[jobId];

    if (!file) {
      showNotification("Please upload resume 📄", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await api.post(`/jobs/apply/${jobId}/`, formData);
      console.log("SUCCESS:", res.data);
      showNotification("Applied successfully ✅", "success");
      setAppliedJobs((prev) => [...prev, jobId]);
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("ERROR RESPONSE:", err.response);
      console.log("ERROR DATA:", err.response?.data);
      showNotification(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Application failed ❌",
        "error"
      );
    }
  };

  const showNotification = (message, type) => {
    // Create a toast notification instead of alert
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '❌'}</span>
        <span class="toast-message">${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  return (
    <>
      <style>{`
        .job-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          overflow: hidden;
          position: relative;
        }
        
        .job-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        
        .job-card:hover::before {
          transform: scaleX(1);
        }
        
        .job-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .job-title {
          color: #2d3748;
          font-weight: 700;
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }
        
        .company-name {
          color: #667eea;
          font-weight: 600;
          font-size: 1rem;
        }
        
        .job-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1rem 0;
          flex-wrap: wrap;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #718096;
          font-size: 0.875rem;
        }
        
        .job-description {
          color: #4a5568;
          font-size: 0.875rem;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .file-upload-wrapper {
          position: relative;
          overflow: hidden;
          display: inline-block;
          width: 100%;
        }
        
        .file-upload-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #f7fafc;
          border: 2px dashed #cbd5e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          color: #4a5568;
        }
        
        .file-upload-label:hover {
          background: #edf2f7;
          border-color: #667eea;
          color: #667eea;
        }
        
        .file-upload-input {
          position: absolute;
          left: -9999px;
        }
        
        .apply-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .apply-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .apply-btn:hover::before {
          width: 300px;
          height: 300px;
        }
        
        .apply-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        
        .apply-btn:disabled {
          background: #cbd5e0;
          cursor: not-allowed;
          transform: none;
        }
        
        .applied-btn {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .profile-alert {
          background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
          border: 1px solid #fc8181;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 10px 30px rgba(252, 129, 129, 0.1);
        }
        
        .empty-state {
          padding: 3rem;
          text-align: center;
        }
        
        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }
        
        .toast-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          background: white;
          border-radius: 8px;
          padding: 1rem 1.5rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          transform: translateX(400px);
          transition: transform 0.3s ease;
          min-width: 300px;
        }
        
        .toast-notification.show {
          transform: translateX(0);
        }
        
        .toast-notification.success {
          border-left: 4px solid #48bb78;
        }
        
        .toast-notification.warning {
          border-left: 4px solid #ed8936;
        }
        
        .toast-notification.error {
          border-left: 4px solid #f56565;
        }
        
        .toast-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .toast-icon {
          font-size: 1.25rem;
        }
        
        .toast-message {
          font-weight: 500;
          color: #2d3748;
        }
        
        .job-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1rem 0;
        }
        
        .job-tag {
          background: #edf2f7;
          color: #4a5568;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .salary-badge {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          display: inline-block;
        }
      `}</style>

      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center gap-3 mb-3">
            <div className={`badge ${mode === 'trending' ? 'bg-danger' : 'bg-primary'} p-3`}>
              <span style={{ fontSize: '2rem' }}>{mode === 'trending' ? '🔥' : '🎯'}</span>
            </div>
            <div>
              <h2 className="mb-0 fw-bold">
                {mode === "trending" ? "Trending Jobs" : "Recommended Jobs"}
              </h2>
              <p className="text-muted mb-0">
                {mode === "trending" 
                  ? "Hot opportunities that are gaining attention" 
                  : "Personalized matches based on your profile"}
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <div className="loading-spinner mx-auto mb-3"></div>
            <p className="text-muted">Discovering amazing opportunities for you...</p>
          </div>
        )}

        {/* Profile Incomplete Alert */}
        {!loading && mode === "recommended" && !profileComplete && (
          <div className="profile-alert">
            <div className="mb-3">
              <span style={{ fontSize: '3rem' }}>⚠️</span>
            </div>
            <h4 className="mb-3">Profile Incomplete</h4>
            <p className="mb-4 text-muted">
              Complete your profile (skills, resume, experience) to unlock personalized job recommendations
            </p>
            <button
              className="btn btn-danger btn-lg px-4"
              onClick={() => (window.location.href = "/dashboard/profile")}
            >
              Complete Profile Now
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && profileComplete && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h4 className="mb-3">No Jobs Found</h4>
            <p className="text-muted">
              {mode === "trending" 
                ? "No trending jobs at the moment. Check back later!" 
                : "We couldn't find any matching jobs. Try updating your skills or preferences."}
            </p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && jobs.length > 0 && (
          <div className="row g-4">
            {jobs.map((job) => {
              const isApplied = appliedJobs.includes(job.id);
              const hasFile = files[job.id];

              return (
                <div className="col-lg-4 col-md-6" key={job.id}>
                  <div 
                    className={`card job-card h-100 ${hoveredJob === job.id ? 'shadow-lg' : 'shadow-sm'}`}
                    onMouseEnter={() => setHoveredJob(job.id)}
                    onMouseLeave={() => setHoveredJob(null)}
                  >
                    <div className="card-body p-4 d-flex flex-column">
                      {/* Job Header */}
                      <div className="mb-3">
                        <h5 className="job-title">{job.title}</h5>
                        <p className="company-name mb-2">
                          <span className="me-2">🏢</span>
                          {job.company}
                        </p>
                      </div>

                      {/* Job Meta */}
                      <div className="job-meta">
                        <div className="meta-item">
                          <span>📍</span>
                          <span>{job.location}</span>
                        </div>
                        {job.salary && (
                          <div className="salary-badge">
                            💰 {job.salary}
                          </div>
                        )}
                      </div>

                      {/* Job Tags */}
                      {job.skills && (
                        <div className="job-tags">
                          {job.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="job-tag">
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 3 && (
                            <span className="job-tag">
                              +{job.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Description */}
                      <p className="job-description flex-grow-1">
                        {job.description}
                      </p>

                      <hr className="my-3" />

                      {/* File Upload (for recommended jobs) */}
                      {mode === "recommended" && !isApplied && (
                        <div className="file-upload-wrapper mb-3">
                          <input
                            type="file"
                            className="file-upload-input"
                            id={`file-${job.id}`}
                            onChange={(e) =>
                              setFiles({
                                ...files,
                                [job.id]: e.target.files[0],
                              })
                            }
                            accept=".pdf,.doc,.docx"
                          />
                          <label 
                            htmlFor={`file-${job.id}`} 
                            className="file-upload-label"
                          >
                            <span>📄</span>
                            <span>{hasFile ? files[job.id].name : "Upload Resume"}</span>
                          </label>
                        </div>
                      )}

                      {/* Apply Button */}
                      <button
                        className={`apply-btn w-100 ${isApplied ? 'applied-btn' : ''}`}
                        onClick={() => applyJob(job.id)}
                        disabled={isApplied}
                      >
                        {isApplied ? (
                          <>
                            <span className="me-2">✓</span>
                            Applied Successfully
                          </>
                        ) : (
                          <>
                            <span className="me-2">🚀</span>
                            Apply Now
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default Jobs;