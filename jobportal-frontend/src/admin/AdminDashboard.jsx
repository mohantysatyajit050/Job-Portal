import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">⚙️ Admin Dashboard</h1>

      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h4>Users</h4>
            <p>Manage all users</p>
            <Link to="/admin/users" className="btn btn-dark">
              Go to Users
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h4>Jobs</h4>
            <p>Manage job postings</p>
            <button className="btn btn-secondary" disabled>
              Coming Soon
            </button>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h4>Analytics</h4>
            <p>View reports</p>
            <button className="btn btn-secondary" disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;