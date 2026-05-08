import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const isAuthenticated =
    localStorage.getItem("@FamilySync:isAuthenticated") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
