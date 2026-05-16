import { Navigate, Outlet } from "react-router-dom";
import { isTokenExpired } from "../../utils/auth";
import Cookies from "js-cookie";

function ProtectedRoute() {
  const token = Cookies.get("familysync_token");

  if (!token || isTokenExpired(token)) {
    Cookies.remove("familysync_token", { path: "/" });
    localStorage.clear();
    return <Navigate to="/auth/start" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
