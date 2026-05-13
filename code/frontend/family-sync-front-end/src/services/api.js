import axios from "axios";

const api = axios.create({
  baseURL: "https://tcc-back-q3kw.onrender.com/v1/familysync/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
