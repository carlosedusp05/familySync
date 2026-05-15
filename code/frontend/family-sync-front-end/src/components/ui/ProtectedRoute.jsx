import { Navigate, Outlet } from "react-router-dom";
import { isTokenExpired } from "../../utils/auth";
import Cookies from "js-cookie";

function ProtectedRoute() {
  const token = Cookies.get("@FamilySync:token");

  if (!token || isTokenExpired(token)) {
    Cookies.remove("@FamilySync:token");
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
