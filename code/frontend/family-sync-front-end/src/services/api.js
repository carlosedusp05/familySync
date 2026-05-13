import axios from "axios";

const api = axios.create({
  baseURL: "https://tcc-back-q3kw.onrender.com/v1/familysync/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("@FamilySync:token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
