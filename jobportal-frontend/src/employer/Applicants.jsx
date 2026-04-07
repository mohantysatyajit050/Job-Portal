import { useEffect, useState } from "react";
import api from "../api/api";

function Applicants({ jobId }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // 🔹 Fetch applicants
  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/jobs/${jobId}/applicants/`);

      setApplications(res.data);
    } catch (error) {
      console.error("Error fetching applicants:", error.response || error);
      setError("Failed to fetch applicants. Please try again.");
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
      setError("Failed to update application status. Please try again.");
    }
  };

  // Filter applications based on status and search term
  const filteredApplications = applications.filter((app) => {
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    const matchesSearch = searchTerm === "" || 
      app.applicant_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.company && app.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  // Get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return { backgroundColor: "#28a745", color: "white" };
      case "rejected":
        return { backgroundColor: "#dc3545", color: "white" };
      case "pending":
        return { backgroundColor: "#ffc107", color: "#212529" };
      default:
        return { backgroundColor: "#6c757d", color: "white" };
    }
  };

  // View applicant details
  const viewApplicantDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setShowDetails(true);
  };

  // ✅ IMPORTANT: Stop rendering if no jobId
  if (!jobId) {
    return (
      <div className="container mt-4" style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ color: "#dc3545", fontSize: "18px" }}>
          ❌ No job selected
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "20px",
        flexWrap: "wrap"
      }}>
        <h2 style={{ color: "#2c3e50", margin: "0" }}>Applicants</h2>
        <button 
          className="btn btn-outline-primary"
          onClick={fetchApplicants}
          style={{ display: "flex", alignItems: "center", gap: "5px" }}
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <div style={{ 
        display: "flex", 
        gap: "15px", 
        marginBottom: "20px",
        flexWrap: "wrap"
      }}>
        <div style={{ flex: "1", minWidth: "200px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, job, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: "150px" }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ marginTop: "10px" }}>Loading applicants...</p>
        </div>
      )}

      {!loading && filteredApplications.length === 0 && (
        <div style={{ 
          textAlign: "center", 
          padding: "40px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px"
        }}>
          <p style={{ fontSize: "18px", color: "#6c757d" }}>
            {applications.length === 0 
              ? "No applicants found for this job." 
              : "No applicants match your filters."}
          </p>
        </div>
      )}

      {filteredApplications.map((app) => (
        <div 
          key={app.id} 
          className="card p-4 mb-3 shadow-sm"
          style={{ 
            borderLeft: `4px solid ${
              app.status === "accepted" ? "#28a745" : 
              app.status === "rejected" ? "#dc3545" : 
              "#ffc107"
            }`,
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
            <div style={{ flex: "1", minWidth: "200px" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <div 
                  style={{ 
                    width: "40px", 
                    height: "40px", 
                    borderRadius: "50%", 
                    backgroundColor: "#e9ecef", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    marginRight: "15px",
                    fontSize: "18px"
                  }}
                >
                  👤
                </div>
                <div>
                  <h5 style={{ margin: "0" }}>{app.applicant_username}</h5>
                  <p style={{ margin: "0", color: "#6c757d", fontSize: "14px" }}>
                    Applied for: {app.job_title}
                  </p>
                </div>
              </div>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginBottom: "10px" }}>
                {app.company && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: "5px" }}>🏢</span>
                    <span>{app.company}</span>
                  </div>
                )}
                
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ marginRight: "5px" }}>📅</span>
                  {new Date(app.applied_date || Date.now()).toLocaleDateString()}
                </div>
              </div>
              
              <div style={{ marginBottom: "10px" }}>
                <span 
                  className="badge"
                  style={getStatusBadge(app.status)}
                >
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "200px" }}>
              {app.resume && (
                <a 
                  href={app.resume} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn btn-outline-secondary btn-sm"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}
                >
                  📄 View Resume
                </a>
              )}
              
              <button
                className="btn btn-outline-info btn-sm"
                onClick={() => viewApplicantDetails(app)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}
              >
                👁️ View Details
              </button>
              
              <div style={{ display: "flex", gap: "5px" }}>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => updateStatus(app.id, "accepted")}
                  disabled={app.status === "accepted"}
                  style={{ flex: "1" }}
                >
                  ✓ Accept
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => updateStatus(app.id, "rejected")}
                  disabled={app.status === "rejected"}
                  style={{ flex: "1" }}
                >
                  ✗ Reject
                </button>

                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => updateStatus(app.id, "pending")}
                  disabled={app.status === "pending"}
                  style={{ flex: "1" }}
                >
                  ⏱ Pending
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Applicant Details Modal */}
      {showDetails && selectedApplicant && (
        <div 
          className="modal show" 
          style={{ 
            display: "block", 
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            overflow: "auto"
          }}
          onClick={() => setShowDetails(false)}
        >
          <div 
            className="modal-dialog modal-lg"
            style={{ margin: "50px auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Applicant Details</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDetails(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                  <div 
                    style={{ 
                      width: "60px", 
                      height: "60px", 
                      borderRadius: "50%", 
                      backgroundColor: "#e9ecef", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      marginRight: "20px",
                      fontSize: "24px"
                    }}
                  >
                    👤
                  </div>
                  <div>
                    <h4>{selectedApplicant.applicant_username}</h4>
                    <span 
                      className="badge"
                      style={getStatusBadge(selectedApplicant.status)}
                    >
                      {selectedApplicant.status.charAt(0).toUpperCase() + selectedApplicant.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Job Title:</strong> {selectedApplicant.job_title}</p>
                    {selectedApplicant.company && (
                      <p><strong>Company:</strong> {selectedApplicant.company}</p>
                    )}
                    <p><strong>Applied Date:</strong> {new Date(selectedApplicant.applied_date || Date.now()).toLocaleDateString()}</p>
                  </div>
                  <div className="col-md-6">
                    {selectedApplicant.email && (
                      <p><strong>Email:</strong> {selectedApplicant.email}</p>
                    )}
                    {selectedApplicant.phone && (
                      <p><strong>Phone:</strong> {selectedApplicant.phone}</p>
                    )}
                    {selectedApplicant.location && (
                      <p><strong>Location:</strong> {selectedApplicant.location}</p>
                    )}
                  </div>
                </div>
                
                {selectedApplicant.cover_letter && (
                  <div className="mt-3">
                    <h5>Cover Letter</h5>
                    <div style={{ 
                      backgroundColor: "#f8f9fa", 
                      padding: "15px", 
                      borderRadius: "5px",
                      maxHeight: "200px",
                      overflow: "auto"
                    }}>
                      {selectedApplicant.cover_letter}
                    </div>
                  </div>
                )}
                
                {selectedApplicant.skills && (
                  <div className="mt-3">
                    <h5>Skills</h5>
                    <div>
                      {selectedApplicant.skills.split(',').map((skill, index) => (
                        <span key={index} className="badge bg-secondary me-1">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {selectedApplicant.resume && (
                  <a 
                    href={selectedApplicant.resume} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn btn-outline-secondary"
                  >
                    📄 View Resume
                  </a>
                )}
                <button
                  className="btn btn-success"
                  onClick={() => {
                    updateStatus(selectedApplicant.id, "accepted");
                    setShowDetails(false);
                  }}
                  disabled={selectedApplicant.status === "accepted"}
                >
                  ✓ Accept
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    updateStatus(selectedApplicant.id, "rejected");
                    setShowDetails(false);
                  }}
                  disabled={selectedApplicant.status === "rejected"}
                >
                  ✗ Reject
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() => {
                    updateStatus(selectedApplicant.id, "pending");
                    setShowDetails(false);
                  }}
                  disabled={selectedApplicant.status === "pending"}
                >
                  ⏱ Pending
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applicants;