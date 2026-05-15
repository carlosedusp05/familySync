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
  const token = Cookies.get("@FamilySync:token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

export const logout = () => {
  Cookies.remove("@FamilySync:token");
  window.location.href = "/auth/login";
};
