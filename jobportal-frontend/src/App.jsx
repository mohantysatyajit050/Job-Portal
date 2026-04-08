import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ErrorPage from "./components/Error";

import Login from "./Login";
import Register from "./register";

import Home from "./Home";
import DashboardHome from "./job-seeker/DashboardHome";
import EmployerDashboard from "./employer/EmployerDashboard";

// ADMIN IMPORTS
import AdminDashboard from "./admin/AdminDashboard";
import Users from "./admin/Users";

// Protected Route
function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

// PUBLIC LAYOUT
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

// DASHBOARD LAYOUT
function DashboardLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
          </Route>
        </Route>

        {/* EMPLOYER ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["employer"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/employer" element={<EmployerDashboard />} />
          </Route>
        </Route>

        {/* JOBSEEKER ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["jobseeker"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/*" element={<DashboardHome />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<ErrorPage />} />

      </Routes>
    </Router>
  );
}

export default App;