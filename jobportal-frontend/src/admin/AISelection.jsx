import React, { useState, useEffect } from "react";
import api from "../api/api"; // Assuming you have an axios instance here

const AISelection = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState(null); // To store AI response message

  // 1. Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs/"); // Public or authenticated job list
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs", err);
      }
    };
    fetchJobs();
  }, []);

  // 2. Fetch applicants for selected job (Admin specific endpoint)
  const fetchApplicants = async (jobId) => {
    setSelectedJobId(jobId);
    setLoading(true);
    setAiStatus(null);
    try {
      const res = await api.get(`/jobs/admin/jobs/${jobId}/applicants/`);
      setApplicants(res.data);
    } catch (err) {
      console.error("Error fetching applicants", err);
      alert("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  // 3. Run AI Analysis
  const runAIAnalysis = async () => {
    if (!selectedJobId) return;
    setLoading(true);
    try {
      const res = await api.post(`/jobs/admin/jobs/${selectedJobId}/ai-analyze/`);
      setAiStatus(res.data);
      // Refresh applicants to show new scores
      fetchApplicants(selectedJobId);
    } catch (err) {
      console.error(err);
      alert("AI Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  // 4. Select Best Candidate
  const selectBest = async (appId) => {
    try {
      await api.post(`/jobs/admin/applications/${appId}/select/`);
      alert("Candidate marked as Best!");
      fetchApplicants(selectedJobId);
    } catch (err) {
      console.error(err);
      alert("Failed to select candidate");
    }
  };

  return (
    <div className="container mt-4">
      <h2>🤖 Admin: AI Candidate Selection</h2>
      
      <div className="row mt-4">
        {/* Left Column: Jobs List */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">Select a Job</div>
            <ul className="list-group list-group-flush">
              {jobs.map((job) => (
                <li
                  key={job.id}
                  className={`list-group-item ${selectedJobId === job.id ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => fetchApplicants(job.id)}
                >
                  {job.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Applicants & AI Control */}
        <div className="col-md-8">
          {selectedJobId ? (
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <span>Applicants</span>
                <button className="btn btn-primary btn-sm" onClick={runAIAnalysis}>
                  ⚡ Run AI Analysis
                </button>
              </div>
              <div className="card-body">
                {aiStatus && (
                  <div className="alert alert-info">
                    <strong>AI Question Used:</strong> "{aiStatus.question_used}"
                  </div>
                )}

                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>AI Score</th>
                        <th>Feedback</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map((app) => (
                        <tr key={app.id}>
                          <td>{app.applicant_username}</td>
                          <td>
                            {app.ai_score !== null ? (
                              <span className={`badge ${app.ai_score > 80 ? 'bg-success' : 'bg-warning'}`}>
                                {app.ai_score}/100
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>{app.ai_feedback || "Pending Analysis"}</td>
                          <td>
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={() => selectBest(app.id)}
                            >
                              {app.is_admin_selected ? "✓ Selected" : "Select Best"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-muted">Select a job from the left to view applicants.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISelection;