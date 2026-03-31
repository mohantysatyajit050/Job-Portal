import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function PostJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    skills_required: "",
    location: "",
    salary: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ IMPORTANT: correct endpoint
      const res = await api.post("/jobs/create/", form);

      console.log("Job Created:", res.data);

      setMessage("Job posted successfully ✅");
      setError(null);

      // Optional redirect to employer dashboard (tab system)
      setTimeout(() => {
        navigate("/employer");
      }, 1000);

    } catch (err) {
      console.error("ERROR:", err.response?.data);

      // Show real backend error
      setError(
        JSON.stringify(err.response?.data) || "Failed to post job ❌"
      );
      setMessage(null);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2>➕ Post a Job</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Job Title */}
        <div>
          <label>Job Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Skills */}
        <div>
          <label>Skills Required (comma separated)</label>
          <input
            type="text"
            name="skills_required"
            value={form.skills_required}
            onChange={handleChange}
            placeholder="React, Django, Python"
          />
        </div>

        {/* Location */}
        <div>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        {/* Salary */}
        <div>
          <label>Salary</label>
          <input
            type="number"
            name="salary"
            value={form.salary}
            onChange={handleChange}
          />
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>
          Post Job
        </button>
      </form>
    </div>
  );
}

export default PostJob;