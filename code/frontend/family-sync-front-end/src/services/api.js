import axios from "axios";
import { isTokenExpired } from "../utils/auth";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("@FamilySync:token");

    if (token) {
      if (isTokenExpired(token)) {
        localStorage.clear();
        window.location.href = "/auth/start";
        return Promise.reject("Token expirado");
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
