import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./Login";
import Register from "./register";
import Jobs from "./job-seeker/Jobs";
import Profile from "./job-seeker/Profile";
import Navbar from "./Navbar";
import Home from "./Home";
import DashboardHome from "./job-seeker/DashboardHome";
import EmployerDashboard from "./employer/EmployerDashboard";

import "./App.css";

// 🔐 Protected Route (Auth + Role)
function ProtectedRoute({ allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

// 🔥 Dashboard Layout
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

        {/* 🌐 Public */}
        <Route path="/" element={<Home />} />

        {/* 🔓 Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 Employer */}
        <Route element={<ProtectedRoute allowedRole="employer" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/employer" element={<EmployerDashboard />} />
          </Route>
        </Route>

        {/* 🔐 Jobseeker */}
        <Route element={<ProtectedRoute allowedRole="jobseeker" />}>
          <Route element={<DashboardLayout />}>
            
            {/* ✅ Default redirect to home */}
            <Route
              path="/dashboard"
              element={<Navigate to="/dashboard/home" />}
            />

            <Route path="/dashboard/home" element={<DashboardHome />} />
            <Route path="/dashboard/jobs" element={<Jobs />} />
            <Route path="/dashboard/profile" element={<Profile />} />

          </Route>
        </Route>

        {/* 🔁 Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;