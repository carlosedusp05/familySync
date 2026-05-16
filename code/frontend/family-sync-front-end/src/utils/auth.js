import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const getUserFromToken = () => {
  const token = Cookies.get("familysync_token");
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

export const logout = () => {
  Cookies.remove("familysync_token", { path: "/" });
  window.location.href = "/auth/login";
};
