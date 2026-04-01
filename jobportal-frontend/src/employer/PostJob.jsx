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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/jobs/create/", form);

      setMessage("Job posted successfully ✅");
      setError(null);

      setTimeout(() => {
        navigate("/employer");
      }, 1200);
    } catch (err) {
      setError(
        JSON.stringify(err.response?.data) || "Failed to post job ❌"
      );
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">

          <div className="card shadow-lg border-0 rounded-4 p-4">
            <h3 className="mb-4 text-center fw-bold">
              ➕ Post a Job
            </h3>

            {/* Alerts */}
            {message && (
              <div className="alert alert-success">{message}</div>
            )}
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Job Title */}
              <div className="mb-3">
                <label className="form-label">Job Title</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control rounded-3"
                  rows="4"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Skills */}
              <div className="mb-3">
                <label className="form-label">
                  Skills Required
                </label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  name="skills_required"
                  value={form.skills_required}
                  onChange={handleChange}
                  placeholder="React, Django, Python"
                />
              </div>

              {/* Location */}
              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>

              {/* Salary */}
              <div className="mb-3">
                <label className="form-label">Salary</label>
                <input
                  type="number"
                  className="form-control rounded-3"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary w-100 rounded-3"
                disabled={loading}
              >
                {loading ? "Posting..." : "🚀 Post Job"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PostJob;