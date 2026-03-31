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
import Jobs from "./job-seeker/Jobs";
import Profile from "./job-seeker/Profile";
import Home from "./Home";
import DashboardHome from "./job-seeker/DashboardHome";
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

        {/* 🔐 EMPLOYER */}
        <Route element={<ProtectedRoute allowedRole="employer" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/employer" element={<EmployerDashboard />} />
          </Route>
        </Route>

        {/* 🔐 JOBSEEKER */}
        <Route element={<ProtectedRoute allowedRole="jobseeker" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Navigate to="/dashboard/home" />} />
            <Route path="/dashboard/home" element={<DashboardHome />} />
            <Route path="/dashboard/jobs" element={<Jobs />} />
            <Route path="/dashboard/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* ❌ 404 PAGE */}
        <Route path="*" element={<ErrorPage />} />

      </Routes>
    </Router>
  );
}

export default App;