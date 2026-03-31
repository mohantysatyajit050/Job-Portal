import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const SKILL_CATEGORIES = [
  {
    category: "Frontend",
    icon: "🎨",
    items: ["React", "Vue", "Angular", "Next.js", "TypeScript", "Tailwind CSS", "Figma"],
  },
  {
    category: "Backend",
    icon: "⚙️",
    items: ["Django", "Node.js", "FastAPI", "Spring Boot", "Laravel", "Express.js", "GraphQL"],
  },
  {
    category: "Languages",
    icon: "💻",
    items: ["Python", "JavaScript", "Java", "C++", "Go", "Rust", "Kotlin"],
  },
  {
    category: "Data & AI",
    icon: "🤖",
    items: ["Machine Learning", "Data Science", "TensorFlow", "PyTorch", "SQL", "Power BI", "Tableau"],
  },
  {
    category: "DevOps & Cloud",
    icon: "☁️",
    items: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Terraform", "Azure"],
  },
  {
    category: "Mobile",
    icon: "📱",
    items: ["React Native", "Flutter", "Android", "iOS", "Ionic", "SwiftUI"],
  },
];

const COURSE_OPTIONS = [
  "Full Stack Web Dev", "Data Science Bootcamp", "Cloud Computing",
  "AI & Machine Learning", "Mobile App Dev", "DevOps Engineering",
  "UI/UX Design", "Cybersecurity", "Blockchain", "Game Development",
];

function Profile() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [resume, setResume] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

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

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) { setResume(file); setResumeName(file.name); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setResume(file); setResumeName(file.name); }
  };

  const handleSubmit = async () => {
    if (!resume) { alert("Please upload your resume 📄"); return; }
    if (selectedSkills.length === 0) { alert("Pick at least one skill 🧠"); return; }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("skills", selectedSkills.join(","));
    formData.append("courses", selectedCourses.join(","));
    formData.append("experience", experience);

    try {
  setLoading(true);
  await api.post("/users/update-profile/", formData);

  // ✅ redirect to jobs page
  navigate("/dashboard/jobs");
} catch (err) {
  console.error(err);
  alert("Error updating profile ❌");
} finally {
  setLoading(false);
}
  };

  return (
    <div className="profile-page">
      {/* Background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="profile-card">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-logo">⚡</div>
          <h1>Build Your Profile</h1>
          <p>Help us match you with the perfect opportunities</p>
        </div>

        {/* Progress */}
        <div className="progress-track">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`progress-step ${step >= s ? "done" : ""} ${step === s ? "active" : ""}`}>
              <div className="step-dot">{step > s ? "✓" : s}</div>
              <span>{s === 1 ? "Resume" : s === 2 ? "Skills" : "Courses"}</span>
            </div>
          ))}
          <div className="progress-line">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* STEP 1 — Resume */}
        {step === 1 && (
          <div className="step-content animate-in">
            <h2 className="step-title">Upload Your Resume</h2>
            <p className="step-sub">PDF or DOCX — max 5MB</p>

            <div
              className={`drop-zone ${dragOver ? "drag-active" : ""} ${resume ? "has-file" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => document.getElementById("resumeInput").click()}
            >
              {resume ? (
                <>
                  <div className="file-icon">📄</div>
                  <p className="file-name">{resumeName}</p>
                  <span className="file-tag">Ready to upload</span>
                </>
              ) : (
                <>
                  <div className="upload-icon">☁️</div>
                  <p>Drag & drop your resume here</p>
                  <span>or click to browse</span>
                </>
              )}
              <input id="resumeInput" type="file" accept=".pdf,.docx" onChange={handleFileChange} style={{ display: "none" }} />
            </div>

            <div className="exp-row">
              <label>Years of Experience</label>
              <div className="exp-pills">
                {["0–1 yr", "1–3 yrs", "3–5 yrs", "5+ yrs"].map((e) => (
                  <button
                    key={e}
                    className={`exp-pill ${experience === e ? "selected" : ""}`}
                    onClick={() => setExperience(e)}
                  >{e}</button>
                ))}
              </div>
            </div>

            <button className="next-btn" onClick={() => setStep(2)} disabled={!resume}>
              Next: Pick Skills →
            </button>
          </div>
        )}

        {/* STEP 2 — Skills */}
        {step === 2 && (
          <div className="step-content animate-in">
            <h2 className="step-title">Select Your Skills</h2>
            <p className="step-sub">{selectedSkills.length} selected — pick as many as you want</p>

            <div className="skills-grid">
              {SKILL_CATEGORIES.map((cat) => (
                <div key={cat.category} className="skill-category">
                  <div className="cat-label">{cat.icon} {cat.category}</div>
                  <div className="skill-pills">
                    {cat.items.map((skill) => (
                      <button
                        key={skill}
                        className={`skill-pill ${selectedSkills.includes(skill) ? "selected" : ""}`}
                        onClick={() => toggleSkill(skill)}
                      >{skill}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="btn-row">
              <button className="back-btn" onClick={() => setStep(1)}>← Back</button>
              <button className="next-btn" onClick={() => setStep(3)} disabled={selectedSkills.length === 0}>
                Next: Courses →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Courses */}
        {step === 3 && (
          <div className="step-content animate-in">
            <h2 className="step-title">Courses & Certifications</h2>
            <p className="step-sub">Select any relevant courses you've completed</p>

            <div className="course-grid">
              {COURSE_OPTIONS.map((course) => (
                <div
                  key={course}
                  className={`course-card ${selectedCourses.includes(course) ? "selected" : ""}`}
                  onClick={() => toggleCourse(course)}
                >
                  <div className="course-check">{selectedCourses.includes(course) ? "✓" : "+"}</div>
                  <span>{course}</span>
                </div>
              ))}
            </div>

            <div className="btn-row">
              <button className="back-btn" onClick={() => setStep(2)}>← Back</button>
              <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? <span className="spinner" /> : "🚀 Complete Profile"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;