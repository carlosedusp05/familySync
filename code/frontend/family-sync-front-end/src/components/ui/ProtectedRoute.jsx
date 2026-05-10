import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const isAuthenticated =
    localStorage.getItem("@FamilySync:isAuthenticated") === "true";

  const isAccount = localStorage.getItem("@FamilySync:isAuthenticated");

  if (!isAuthenticated && !isAccount.id_usuario) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
