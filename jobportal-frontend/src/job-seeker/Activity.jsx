import { useEffect, useState } from "react";
import api from "../api/api";

function Activity() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return { bg: "#d4edda", text: "#155724", icon: "✅" };
      case "rejected":
        return { bg: "#f8d7da", text: "#721c24", icon: "❌" };
      case "interview":
        return { bg: "#d1ecf1", text: "#0c5460", icon: "📅" };
      case "reviewing":
        return { bg: "#fff3cd", text: "#856404", icon: "👀" };
      default:
        return { bg: "#e2e3e5", text: "#383d41", icon: "⏳" };
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesFilter = filter === "all" || app.status.toLowerCase() === filter;
    const matchesSearch = app.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStats = () => {
    const stats = {
      total: applications.length,
      accepted: applications.filter(a => a.status.toLowerCase() === "accepted").length,
      rejected: applications.filter(a => a.status.toLowerCase() === "rejected").length,
      pending: applications.filter(a => !["accepted", "rejected"].includes(a.status.toLowerCase())).length,
    };
    return stats;
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <>
        <style>{`
          .loading-container {
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            margin: 2rem 0;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="text-white mt-3">Loading your applications...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .activity-container {
          background: #f8f9fa;
          min-height: 100vh;
          padding: 2rem 0;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .stat-card.total { border-left-color: #667eea; }
        .stat-card.accepted { border-left-color: #48bb78; }
        .stat-card.rejected { border-left-color: #f56565; }
        .stat-card.pending { border-left-color: #ed8936; }
        
        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          color: #718096;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .filter-section {
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }
        
        .filter-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }
        
        .filter-btn {
          padding: 0.5rem 1.25rem;
          border: 2px solid #e2e8f0;
          background: white;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .filter-btn:hover {
          border-color: #667eea;
          background: #f7fafc;
        }
        
        .filter-btn.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: #667eea;
        }
        
        .search-box {
          position: relative;
        }
        
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
        }
        
        .application-card {
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          border-left: 4px solid #e2e8f0;
          position: relative;
          overflow: hidden;
        }
        
        .application-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }
        
        .application-card:hover::before {
          transform: translateX(0);
        }
        
        .application-card:hover {
          transform: translateX(5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }
        
        .job-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }
        
        .company-name {
          color: #718096;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.875rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .application-details {
          display: flex;
          gap: 2rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4a5568;
          font-size: 0.875rem;
        }
        
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }
        
        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }
        
        .timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #cbd5e0;
          position: absolute;
          left: -6px;
          top: 2rem;
        }
        
        .application-card.accepted { border-left-color: #48bb78; }
        .application-card.rejected { border-left-color: #f56565; }
        .application-card.interview { border-left-color: #4299e1; }
        .application-card.reviewing { border-left-color: #ed8936; }
      `}</style>

      <div className="activity-container">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="fw-bold mb-2">📊 My Activity</h1>
            <p className="text-muted">Track your job applications and their status</p>
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-number" style={{ color: "#667eea" }}>{stats.total}</div>
              <div className="stat-label">Total Applications</div>
            </div>
            <div className="stat-card accepted">
              <div className="stat-number" style={{ color: "#48bb78" }}>{stats.accepted}</div>
              <div className="stat-label">Accepted</div>
            </div>
            <div className="stat-card rejected">
              <div className="stat-number" style={{ color: "#f56565" }}>{stats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
            <div className="stat-card pending">
              <div className="stat-number" style={{ color: "#ed8936" }}>{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="filter-section">
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All ({applications.length})
              </button>
              <button
                className={`filter-btn ${filter === "accepted" ? "active" : ""}`}
                onClick={() => setFilter("accepted")}
              >
                ✅ Accepted ({stats.accepted})
              </button>
              <button
                className={`filter-btn ${filter === "rejected" ? "active" : ""}`}
                onClick={() => setFilter("rejected")}
              >
                ❌ Rejected ({stats.rejected})
              </button>
              <button
                className={`filter-btn ${filter === "interview" ? "active" : ""}`}
                onClick={() => setFilter("interview")}
              >
                📅 Interview ({applications.filter(a => a.status.toLowerCase() === "interview").length})
              </button>
              <button
                className={`filter-btn ${filter === "reviewing" ? "active" : ""}`}
                onClick={() => setFilter("reviewing")}
              >
                👀 Reviewing ({applications.filter(a => a.status.toLowerCase() === "reviewing").length})
              </button>
            </div>

            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h4 className="mb-2">No applications found</h4>
              <p className="text-muted">
                {applications.length === 0 
                  ? "You haven't applied to any jobs yet. Start exploring opportunities!"
                  : "No applications match your current filters."
                }
              </p>
            </div>
          ) : (
            <div>
              {filteredApplications.map((app, index) => {
                const statusStyle = getStatusColor(app.status);
                return (
                  <div 
                    key={app.id} 
                    className={`application-card ${app.status.toLowerCase()}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="timeline-dot"></div>
                    
                    <div className="job-header">
                      <div>
                        <h5 className="job-title">💼 {app.job_title}</h5>
                        <div className="company-name">
                          <span>🏢</span>
                          <span>{app.company}</span>
                        </div>
                      </div>
                      
                      <div
                        className="status-badge"
                        style={{
                          background: statusStyle.bg,
                          color: statusStyle.text,
                        }}
                      >
                        <span>{statusStyle.icon}</span>
                        <span>{app.status}</span>
                      </div>
                    </div>

                    <div className="application-details">
                      <div className="detail-item">
                        <span>📅</span>
                        <span>Applied: {new Date(app.applied_at).toLocaleDateString("en-US", {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                      </div>
                      
                      <div className="detail-item">
                        <span>⏰</span>
                        <span>{Math.floor((new Date() - new Date(app.applied_at)) / (1000 * 60 * 60 * 24))} days ago</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Activity;