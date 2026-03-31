import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ❌ If not logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // ❌ If role mismatch → redirect
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" />;
  }

  // ✅ Allow access
  return children;
}

export default ProtectedRoute;