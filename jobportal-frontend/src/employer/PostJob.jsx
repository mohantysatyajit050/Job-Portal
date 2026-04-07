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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ✅ IMPORTANT: correct endpoint
      const res = await api.post("/jobs/create/", form);

      console.log("Job Created:", res.data);

      setMessage("Job posted successfully ✅");
      setError(null);

      // Optional redirect to employer dashboard (tab system)
      setTimeout(() => {
        navigate("/employer");
      }, 1500);

    } catch (err) {
      console.error("ERROR:", err.response?.data);

      // Show real backend error
      setError(
        JSON.stringify(err.response?.data) || "Failed to post job ❌"
      );
      setMessage(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "8px 0 16px 0",
    border: "1px solid #ddd",
    borderRadius: "6px",
    boxSizing: "border-box",
    fontSize: "16px",
    transition: "border 0.3s",
  };

  const labelStyle = {
    fontWeight: "600",
    color: "#333",
    marginBottom: "5px",
    display: "block",
  };

  const buttonStyle = {
    backgroundColor: isSubmitting ? "#6c757d" : "#4361ee",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: isSubmitting ? "not-allowed" : "pointer",
    width: "100%",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "10px",
    transition: "background-color 0.3s",
  };

  return (
    <div style={{ 
      maxWidth: "600px", 
      margin: "40px auto", 
      padding: "30px",
      backgroundColor: "#f8f9fa",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
    }}>
      <h2 style={{ 
        color: "#2c3e50", 
        marginBottom: "20px",
        textAlign: "center",
        fontWeight: "700"
      }}>
        ➕ Post a Job
      </h2>

      {message && (
        <div style={{
          backgroundColor: "#d4edda",
          color: "#155724",
          padding: "12px",
          borderRadius: "6px",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          {message}
        </div>
      )}
      
      {error && (
        <div style={{
          backgroundColor: "#f8d7da",
          color: "#721c24",
          padding: "12px",
          borderRadius: "6px",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Job Title */}
        <div>
          <label style={labelStyle}>Job Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="e.g. Senior Frontend Developer"
          />
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            style={{
              ...inputStyle,
              minHeight: "120px",
              resize: "vertical"
            }}
            placeholder="Provide a detailed description of the job role, responsibilities, and requirements..."
          />
        </div>

        {/* Skills */}
        <div>
          <label style={labelStyle}>Skills Required (comma separated)</label>
          <input
            type="text"
            name="skills_required"
            value={form.skills_required}
            onChange={handleChange}
            placeholder="React, Django, Python"
            style={inputStyle}
          />
        </div>

        {/* Location */}
        <div>
          <label style={labelStyle}>Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. New York, NY or Remote"
            style={inputStyle}
          />
        </div>

        {/* Salary */}
        <div>
          <label style={labelStyle}>Salary</label>
          <input
            type="number"
            name="salary"
            value={form.salary}
            onChange={handleChange}
            placeholder="e.g. 75000"
            style={inputStyle}
          />
        </div>

        <button 
          type="submit" 
          style={buttonStyle}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}

export default PostJob;