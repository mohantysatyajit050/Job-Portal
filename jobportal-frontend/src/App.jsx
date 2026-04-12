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
import AdminDashboard from "./admin/AdminDashboard";
import AdminApplicants from "./admin/AdminApplicants";

import Home from "./Home";

import DashboardHome from "./job-seeker/DashboardHome";

// 🔥 EMPLOYER IMPORTS
import EmployerDashboard from "./employer/EmployerDashboard";

// 🔐 Protected Route
function ProtectedRoute({ allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

// 🌐 PUBLIC LAYOUT
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

// 🔥 DASHBOARD LAYOUT
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
        {/* 🌐 PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* 🔐 EMPLOYER ROUTES */}
        <Route element={<ProtectedRoute allowedRole="employer" />}>
          <Route element={<DashboardLayout />}>
            {/* Employer Dashboard */}
            <Route path="/employer" element={<EmployerDashboard />} />
          </Route>
        </Route>

        {/* 🔐 JOBSEEKER ROUTES */}
        <Route element={<ProtectedRoute allowedRole="jobseeker" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/*" element={<DashboardHome />} />
          </Route>
        </Route>

        
        {/* 🔐 ADMIN ROUTES */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route element={<DashboardLayout />}>
            {/* Admin Dashboard */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Admin Applicants */}
            <Route path="/admin/job/:jobId" element={<AdminApplicants />} />
          </Route>
        </Route>
        {/* ❌ 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
