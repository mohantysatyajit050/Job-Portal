// src/pages/Users.jsx
import React, { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    // ✅ CORRECT PATH: Relative to the baseURL
    api.get("/users/admin/users/")
      .then(res => {
        setUsers(res.data);
        setError(null);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please check your permissions.");
        toast.error("Failed to load users");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const approveUser = (user_id) => {
    // ✅ CORRECT PATH: Relative to the baseURL
    api.put(`/users/admin/approve/${user_id}/`)
      .then(res => {
        toast.success(res.data.message || "User Approved");
        fetchUsers();
      })
      .catch(err => {
        console.error("Error approving user:", err);
        const errorMsg = err.response?.data?.error || "Failed to approve user";
        toast.error(errorMsg);
      });
  };

  const deleteUser = (user_id) => {
    if (window.confirm("Are you sure you want to delete this user? This cannot be undone.")) {
      // ✅ CORRECT PATH: Relative to the baseURL
      api.delete(`/users/admin/delete/${user_id}/`)
        .then(res => {
          toast.success(res.data.message || "User Deleted");
          fetchUsers();
        })
        .catch(err => {
          console.error("Error deleting user:", err);
          const errorMsg = err.response?.data?.error || "Failed to delete user";
          toast.error(errorMsg);
        });
    }
  };

  const markEligible = (user_id) => {
    // ✅ CORRECT PATH: Relative to the baseURL
    api.put(`/users/admin/eligible/${user_id}/`)
      .then(res => {
        toast.success(res.data.message || "Marked as Eligible");
        fetchUsers();
      })
      .catch(err => {
        console.error("Error marking eligible:", err);
        const errorMsg = err.response?.data?.error || "Failed to mark as eligible";
        toast.error(errorMsg);
      });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          {error}
          <button className="btn btn-sm btn-primary ms-2" onClick={fetchUsers}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">👨‍💼 Admin - Manage Users</h2>
        <button className="btn btn-primary" onClick={fetchUsers}>
          Refresh
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Role</th>
              <th>Approved</th>
              <th>Eligible</th>
              <th>Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>
                  <span className={`badge text-capitalize ${
                    user.role === "employer" ? "bg-info text-dark" : 
                    user.role === "admin" ? "bg-danger" : 
                    "bg-secondary"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  {user.is_approved ? (
                    <span className="badge bg-success">Yes</span>
                  ) : (
                    <span className="badge bg-warning text-dark">No</span>
                  )}
                </td>
                <td>
                  {user.is_eligible ? (
                    <span className="badge bg-success">Yes</span>
                  ) : (
                    <span className="badge bg-secondary">No</span>
                  )}
                </td>
                <td>{user.test_score || 0}</td>
                <td>
                  <div className="btn-group btn-group-sm" role="group">
                    {!user.is_approved && (
                      <button
                        className="btn btn-success"
                        onClick={() => approveUser(user.id)}
                        title="Approve User"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      className="btn btn-primary"
                      onClick={() => markEligible(user.id)}
                      title="Mark as Eligible"
                    >
                      ★
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteUser(user.id)}
                      title="Delete User"
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;