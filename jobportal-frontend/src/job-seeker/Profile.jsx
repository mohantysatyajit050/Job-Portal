import { useState } from "react";
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
  "AI & ML", "Mobile App Dev", "DevOps", "UI/UX", "Cybersecurity",
];

function Profile() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [resume, setResume] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    if (!resume) return alert("Upload resume 📄");
    if (!selectedSkills.length) return alert("Select skills 🧠");

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("skills", selectedSkills.join(","));
    formData.append("courses", selectedCourses.join(","));
    formData.append("experience", experience);

    try {
      setLoading(true);
      await api.post("/users/update-profile/", formData);
      navigate("/dashboard/jobs");
    } catch {
      alert("Error updating profile ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">

      {/* HEADER */}
      <div className="text-center mb-4">
        <h2 className="fw-bold">⚡ Build Your Profile</h2>
        <p className="text-muted">Get matched with the best jobs</p>
      </div>

      {/* PROGRESS BAR */}
      <div className="progress mb-4" style={{ height: "8px" }}>
        <div
          className="progress-bar bg-success"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* STEP INDICATOR */}
      <div className="d-flex justify-content-between mb-4 text-center">
        <div className={`fw-bold ${step === 1 ? "text-primary" : ""}`}>
          📄 Resume
        </div>
        <div className={`fw-bold ${step === 2 ? "text-primary" : ""}`}>
          🧠 Skills
        </div>
        <div className={`fw-bold ${step === 3 ? "text-primary" : ""}`}>
          🎓 Courses
        </div>
      </div>

      {/* CARD */}
      <div className="card shadow-lg border-0 p-4">

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h5 className="mb-3">Upload Resume</h5>

            <input
              type="file"
              className="form-control mb-3"
              onChange={(e) => setResume(e.target.files[0])}
            />

            <div className="mb-3">
              <label className="form-label">Experience</label>
              <select
                className="form-select"
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="">Select</option>
                <option>0–1 yr</option>
                <option>1–3 yrs</option>
                <option>3–5 yrs</option>
                <option>5+ yrs</option>
              </select>
            </div>

            <button
              className="btn btn-primary w-100"
              onClick={() => setStep(2)}
              disabled={!resume}
            >
              Next →
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h5 className="mb-3">Select Skills</h5>

            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat.category} className="mb-3">
                <h6>{cat.icon} {cat.category}</h6>

                <div className="d-flex flex-wrap gap-2">
                  {cat.items.map((skill) => (
                    <button
                      key={skill}
                      className={`btn btn-sm ${
                        selectedSkills.includes(skill)
                          ? "btn-success"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setStep(3)}
                disabled={!selectedSkills.length}
              >
                Next →
              </button>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h5 className="mb-3">Courses</h5>

            <div className="row g-2">
              {COURSE_OPTIONS.map((course) => (
                <div key={course} className="col-6">
                  <div
                    className={`card p-2 text-center ${
                      selectedCourses.includes(course)
                        ? "bg-success text-white"
                        : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleCourse(course)}
                  >
                    {course}
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                ← Back
              </button>

              <button
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "🚀 Complete Profile"}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Profile;