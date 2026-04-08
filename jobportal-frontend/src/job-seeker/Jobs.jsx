import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const API_BASE = "http://127.0.0.1:8000";

// Mock job data (replace with actual API call)
const mockJobs = {
  trending: [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp",
      location: "San Francisco, CA",
      salary: "$120k - $160k",
      type: "Full-time",
      description: "We're looking for an experienced frontend developer...",
      skills: ["React", "TypeScript", "Node.js"],
      posted: "2 days ago",
      applicants: 45,
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "Remote",
      salary: "$100k - $140k",
      type: "Full-time",
      description: "Join our fast-growing team as a full stack engineer...",
      skills: ["Python", "Django", "React"],
      posted: "1 week ago",
      applicants: 32,
    },
  ],
  recommended: [
    {
      id: 3,
      title: "React Developer",
      company: "WebSolutions",
      location: "New York, NY",
      salary: "$90k - $120k",
      type: "Full-time",
      description: "Seeking a skilled React developer for our team...",
      skills: ["React", "JavaScript", "CSS"],
      posted: "3 days ago",
      applicants: 28,
    },
  ],
};

function Jobs({ mode }) {
  const [jobs, setJobs] = useState([]);
  const [applying, setApplying] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        // Replace with actual API endpoint
        // const response = await fetch(`${API_BASE}/api/jobs/${mode}/`, {
        //   headers: { Authorization: `Token ${token}` }
        // });
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          setJobs(mockJobs[mode] || []);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError("Failed to load jobs");
        setLoading(false);
        toast.error("Failed to load jobs");
      }
    };

    fetchJobs();
  }, [mode]);

  // Apply for job with file upload
  const applyJob = async (jobId) => {
    if (!files[jobId] && mode === "recommended") {
      toast.error("Please upload your resume first");
      return;
    }

    try {
      setApplying(jobId);
      const token = localStorage.getItem("token");
      
      const formData = new FormData();
      formData.append("job_id", jobId);
      if (files[jobId]) {
        formData.append("resume", files[jobId]);
      }

      // Replace with actual API endpoint
      // const response = await fetch(`${API_BASE}/api/applications/`, {
      //   method: "POST",
      //   headers: { Authorization: `Token ${token}` },
      //   body: formData,
      // });

      // if (!response.ok) throw new Error("Application failed");

      // Mock successful application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAppliedJobs(prev => new Set([...prev, jobId]));
      toast.success("Application submitted successfully!");
      
      // Remove file after successful upload
      setFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[jobId];
        return newFiles;
      });
    } catch (err) {
      toast.error("Failed to submit application");
      console.error(err);
    } finally {
      setApplying(null);
    }
  };

  const handleFileChange = (jobId, file) => {
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a PDF or Word document");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setFiles(prev => ({ ...prev, [jobId]: file }));
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-5">
        <h4>No jobs found</h4>
        <p className="text-muted">Check back later for new opportunities</p>
      </div>
    );
  }

  return (
    <div className="row">
      {jobs.map((job) => (
        <div className="col-md-6 col-lg-4 mb-4" key={job.id}>
          <div className="card h-100 shadow-sm job-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="card-title">{job.title}</h5>
                <span className="badge bg-primary">{job.type}</span>
              </div>
              <p className="text-muted mb-2">{job.company}</p>
              <p className="mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-1">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {job.location}
              </p>
              <p className="mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-1">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {job.salary}
              </p>
              <p className="card-text text-muted small">{job.description}</p>
              <div className="mb-3">
                {job.skills.map((skill, idx) => (
                  <span key={idx} className="badge bg-light text-dark me-1 mb-1">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  {job.posted} • {job.applicants} applicants
                </small>
              </div>
            </div>
            <div className="card-footer bg-transparent border-top-0">
              {appliedJobs.has(job.id) ? (
                <button className="btn btn-success btn-sm w-100" disabled>
                  ✓ Applied
                </button>
              ) : (
                <>
                  {mode === "recommended" && (
                    <div className="mb-2">
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(job.id, e.target.files[0])}
                      />
                    </div>
                  )}
                  <button
                    className="btn btn-primary btn-sm w-100"
                    onClick={() => applyJob(job.id)}
                    disabled={applying === job.id}
                  >
                    {applying === job.id ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Applying...
                      </>
                    ) : (
                      "Apply Now"
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Jobs;