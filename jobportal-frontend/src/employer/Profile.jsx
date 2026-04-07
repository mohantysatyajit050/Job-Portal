import React, { useState, useEffect } from "react";
import api from "../api/api";

function Profile() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    role: "",
    resume: null,
    skills: [],
    courses: [],
    experience: "",
    is_complete: false,
    isLoading: true,
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    skills: "",
    courses: "",
    experience: "",
    resume: null,
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile/");
      setProfile({
        ...response.data,
        isLoading: false,
      });

      // Initialize form data
      setFormData({
        skills: response.data.skills ? response.data.skills.join(", ") : "",
        courses: response.data.courses ? response.data.courses.join(", ") : "",
        experience: response.data.experience || "",
        resume: null,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        resume: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataObj = new FormData();
      
      if (formData.skills) formDataObj.append("skills", formData.skills);
      if (formData.courses) formDataObj.append("courses", formData.courses);
      if (formData.experience) formDataObj.append("experience", formData.experience);
      if (formData.resume) formDataObj.append("resume", formData.resume);
      
      const response = await api.post("/update-profile/", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // Update profile with new data
      setProfile((prev) => ({
        ...prev,
        skills: formData.skills.split(",").map((s) => s.trim()),
        courses: formData.courses.split(",").map((c) => c.trim()),
        experience: formData.experience,
        is_complete: response.data.is_complete,
      }));
      
      setMessage("Profile updated successfully!");
      setMessageType("success");
      setEditMode(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile. Please try again.");
      setMessageType("error");
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (profile.isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "30px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0, color: "#2c3e50" }}>My Profile</h2>
          <button
            className={`btn ${editMode ? "btn-success" : "btn-primary"}`}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Save" : "Edit"}
          </button>
        </div>

        {message && (
          <div
            className={`alert alert-${messageType === "success" ? "success" : "danger"}`}
            role="alert"
          >
            {message}
          </div>
        )}

        {editMode ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={profile.username}
                disabled
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={profile.email}
                disabled
              />
            </div>

            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <input
                type="text"
                className="form-control"
                id="role"
                value={profile.role}
                disabled
              />
            </div>

            <div className="mb-3">
              <label htmlFor="skills" className="form-label">
                Skills (comma-separated)
              </label>
              <textarea
                className="form-control"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                rows="2"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="courses" className="form-label">
                Courses (comma-separated)
              </label>
              <textarea
                className="form-control"
                id="courses"
                name="courses"
                value={formData.courses}
                onChange={handleInputChange}
                rows="2"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="experience" className="form-label">
                Experience
              </label>
              <textarea
                className="form-control"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="resume" className="form-label">
                Resume
              </label>
              <input
                type="file"
                className="form-control"
                id="resume"
                onChange={handleFileChange}
              />
              {profile.resume && (
                <div className="mt-2">
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary"
                  >
                    View Current Resume
                  </a>
                </div>
              )}
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="mb-3">
              <h5 className="text-muted">Username</h5>
              <p>{profile.username}</p>
            </div>

            <div className="mb-3">
              <h5 className="text-muted">Email</h5>
              <p>{profile.email}</p>
            </div>

            <div className="mb-3">
              <h5 className="text-muted">Role</h5>
              <p style={{ textTransform: "capitalize" }}>{profile.role}</p>
            </div>

            <div className="mb-3">
              <h5 className="text-muted">Skills</h5>
              <div>
                {profile.skills && profile.skills.length > 0 ? (
                  <div>
                    {profile.skills.map((skill, index) => (
                      <span key={index} className="badge bg-primary me-2 mb-2">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No skills added yet</p>
                )}
              </div>
            </div>

            <div className="mb-3">
              <h5 className="text-muted">Courses</h5>
              <div>
                {profile.courses && profile.courses.length > 0 ? (
                  <ul>
                    {profile.courses.map((course, index) => (
                      <li key={index}>{course}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No courses added yet</p>
                )}
              </div>
            </div>

            <div className="mb-3">
              <h5 className="text-muted">Experience</h5>
              <p>{profile.experience || "No experience added yet"}</p>
            </div>

            <div className="mb-3">
              <h5 className="text-muted">Resume</h5>
              {profile.resume ? (
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary"
                >
                  Download Resume
                </a>
              ) : (
                <p className="text-muted">No resume uploaded yet</p>
              )}
            </div>

            <div className="mt-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={profile.is_complete}
                  disabled
                />
                <label className="form-check-label">
                  Profile Complete
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;