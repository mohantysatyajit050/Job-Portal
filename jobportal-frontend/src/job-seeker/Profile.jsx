import { useState } from "react";
import api from "../api/api";

const SKILL_CATEGORIES = [
  {
    category: "Frontend",
    icon: "🎨",
    color: "#667eea",
    items: ["React", "Vue", "Angular", "Next.js", "TypeScript", "Tailwind CSS", "Figma"],
  },
  {
    category: "Backend",
    icon: "⚙️",
    color: "#f56565",
    items: ["Django", "Node.js", "FastAPI", "Spring Boot", "Laravel", "Express.js", "GraphQL"],
  },
  {
    category: "Languages",
    icon: "💻",
    color: "#48bb78",
    items: ["Python", "JavaScript", "Java", "C++", "Go", "Rust", "Kotlin"],
  },
  {
    category: "Data & AI",
    icon: "🤖",
    color: "#ed8936",
    items: ["Machine Learning", "Data Science", "TensorFlow", "PyTorch", "SQL", "Power BI", "Tableau"],
  },
  {
    category: "DevOps & Cloud",
    icon: "☁️",
    color: "#9f7aea",
    items: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Terraform", "Azure"],
  },
  {
    category: "Mobile",
    icon: "📱",
    color: "#38b2ac",
    items: ["React Native", "Flutter", "Android", "iOS", "Ionic", "SwiftUI"],
  },
];

const COURSE_OPTIONS = [
  { name: "Full Stack Web Dev", icon: "🌐", duration: "6 months" },
  { name: "Data Science Bootcamp", icon: "📊", duration: "4 months" },
  { name: "Cloud Computing", icon: "☁️", duration: "3 months" },
  { name: "AI & ML", icon: "🤖", duration: "5 months" },
  { name: "Mobile App Dev", icon: "📱", duration: "4 months" },
  { name: "DevOps", icon: "⚙️", duration: "3 months" },
  { name: "UI/UX", icon: "🎨", duration: "2 months" },
  { name: "Cybersecurity", icon: "🔒", duration: "6 months" },
];

function Profile({ onGoToJobs }) {
  const [step, setStep] = useState(1);
  const [resume, setResume] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const progress = (step / 3) * 100;

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleCourse = (course) => {
    setSelectedCourses((prev) =>
      prev.includes(course) ? prev.filter((c) => c !== course) : [...prev, course]
    );
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setResume(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!resume) {
      showNotification("Please upload your resume 📄", "warning");
      return;
    }
    if (!selectedSkills.length) {
      showNotification("Please select at least one skill 🧠", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("skills", selectedSkills.join(","));
    formData.append("courses", selectedCourses.join(","));
    formData.append("experience", experience);

    try {
      setLoading(true);
      await api.post("/users/update-profile/", formData);
      showNotification("Profile updated successfully! 🎉", "success");
      
      setTimeout(() => {
        if (onGoToJobs) {
          onGoToJobs();
        }
      }, 1500);
    } catch {
      showNotification("Error updating profile ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '❌'}</span>
        <span class="toast-message">${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  return (
    <>
      <style>{`
        .profile-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 2rem 0;
        }
        
        .profile-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          overflow: hidden;
          animation: slideUp 0.5s ease;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .step-indicator {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin-bottom: 3rem;
        }
        
        .step-indicator::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          height: 2px;
          background: #e2e8f0;
          z-index: 0;
        }
        
        .step-indicator-progress {
          position: absolute;
          top: 20px;
          left: 0;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.3s ease;
          z-index: 1;
        }
        
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        
        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          border: 2px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        
        .step-item.active .step-circle {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: #667eea;
          transform: scale(1.1);
        }
        
        .step-item.completed .step-circle {
          background: #48bb78;
          color: white;
          border-color: #48bb78;
        }
        
        .step-label {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #718096;
          font-weight: 500;
        }
        
        .step-item.active .step-label {
          color: #667eea;
        }
        
        .file-upload-area {
          border: 2px dashed #cbd5e0;
          border-radius: 12px;
          padding: 3rem;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          background: #f7fafc;
        }
        
        .file-upload-area:hover,
        .file-upload-area.drag-active {
          border-color: #667eea;
          background: #edf2f7;
          transform: scale(1.02);
        }
        
        .file-upload-area.has-file {
          border-color: #48bb78;
          background: #f0fff4;
        }
        
        .skill-category {
          margin-bottom: 2rem;
        }
        
        .category-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #f0f0f0;
        }
        
        .category-title {
          font-weight: 600;
          color: #2d3748;
        }
        
        .skill-chip {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          border: 2px solid #e2e8f0;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .skill-chip:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .skill-chip.selected {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: #667eea;
          transform: scale(1.05);
        }
        
        .course-card {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
          height: 100%;
        }
        
        .course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
          border-color: #667eea;
        }
        
        .course-card.selected {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: #667eea;
          transform: scale(1.02);
        }
        
        .course-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        
        .course-duration {
          font-size: 0.75rem;
          opacity: 0.8;
        }
        
        .experience-select {
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .experience-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .nav-button {
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
        }
        
        .nav-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        
        .submit-button {
          background: linear-gradient(135deg, #48bb78, #38a169);
          color: white;
          padding: 1rem 3rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }
        
        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(72, 187, 120, 0.3);
        }
        
        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
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
        
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="profile-container">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="d-inline-flex align-items-center gap-3 bg-white px-4 py-3 rounded-2 shadow-sm">
              <span style={{ fontSize: '2.5rem' }}>⚡</span>
              <div>
                <h2 className="mb-0 fw-bold">Build Your Profile</h2>
                <p className="text-muted mb-0">Get matched with the best opportunities</p>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div className="profile-card p-5">
            {/* Step Indicator */}
            <div className="step-indicator">
              <div 
                className="step-indicator-progress" 
                style={{ width: `${progress}%` }}
              ></div>
              
              <div className={`step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                <div className="step-circle">
                  {step > 1 ? '✓' : '1'}
                </div>
                <span className="step-label">Resume</span>
              </div>
              
              <div className={`step-item ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                <div className="step-circle">
                  {step > 2 ? '✓' : '2'}
                </div>
                <span className="step-label">Skills</span>
              </div>
              
              <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
                <div className="step-circle">
                  3
                </div>
                <span className="step-label">Courses</span>
              </div>
            </div>

            {/* Step Content */}
            <div className="mt-5">
              {step === 1 && (
                <div className="animate-fade-in">
                  <h4 className="mb-4 fw-bold">📄 Upload Your Resume</h4>
                  
                  <div 
                    className={`file-upload-area ${resume ? 'has-file' : ''} ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('resume-input').click()}
                  >
                    <input
                      id="resume-input"
                      type="file"
                      className="d-none"
                      onChange={(e) => setResume(e.target.files[0])}
                      accept=".pdf,.doc,.docx"
                    />
                    
                    {resume ? (
                      <div>
                        <div style={{ fontSize: '3rem', color: '#48bb78' }}>✅</div>
                        <h5 className="mt-3 mb-2">{resume.name}</h5>
                        <p className="text-muted">Click to change file</p>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '3rem' }}>📁</div>
                        <h5 className="mt-3 mb-2">Drag & Drop your resume</h5>
                        <p className="text-muted">or click to browse</p>
                        <small className="text-muted">PDF, DOC, DOCX (Max 5MB)</small>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="form-label fw-bold">Experience Level</label>
                    <select
                      className="experience-select w-100"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    >
                      <option value="">Select your experience</option>
                      <option value="0-1">0–1 year (Entry Level)</option>
                      <option value="1-3">1–3 years (Junior)</option>
                      <option value="3-5">3–5 years (Mid Level)</option>
                      <option value="5+">5+ years (Senior)</option>
                    </select>
                  </div>

                  <div className="text-end mt-4">
                    <button
                      className="nav-button btn-primary"
                      onClick={() => setStep(2)}
                      disabled={!resume}
                    >
                      Next Step →
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-fade-in">
                  <h4 className="mb-4 fw-bold">🧠 Select Your Skills</h4>
                  
                  {SKILL_CATEGORIES.map((cat) => (
                    <div key={cat.category} className="skill-category">
                      <div className="category-header">
                        <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                        <span className="category-title">{cat.category}</span>
                      </div>
                      
                      <div className="d-flex flex-wrap gap-2">
                        {cat.items.map((skill) => (
                          <div
                            key={skill}
                            className={`skill-chip ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                            onClick={() => toggleSkill(skill)}
                            style={{
                              borderColor: selectedSkills.includes(skill) ? cat.color : undefined
                            }}
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="d-flex justify-content-between mt-5">
                    <button
                      className="nav-button btn-secondary"
                      onClick={() => setStep(1)}
                    >
                      ← Previous
                    </button>
                    <button
                      className="nav-button btn-primary"
                      onClick={() => setStep(3)}
                      disabled={!selectedSkills.length}
                    >
                      Next Step →
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-fade-in">
                  <h4 className="mb-4 fw-bold">🎓 Select Relevant Courses</h4>
                  
                  <div className="row g-3">
                    {COURSE_OPTIONS.map((course) => (
                      <div key={course.name} className="col-md-6">
                        <div
                          className={`course-card ${selectedCourses.includes(course.name) ? 'selected' : ''}`}
                          onClick={() => toggleCourse(course.name)}
                        >
                          <div className="course-icon">{course.icon}</div>
                          <h6 className="mb-2 fw-bold">{course.name}</h6>
                          <div className="course-duration">⏱️ {course.duration}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between mt-5">
                    <button
                      className="nav-button btn-secondary"
                      onClick={() => setStep(2)}
                    >
                      ← Previous
                    </button>
                    
                    <button
                      className="submit-button"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="loading-spinner me-2"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          🚀 Complete Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;