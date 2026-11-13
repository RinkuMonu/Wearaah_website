import axios from "axios";

// Determine the API base URL dynamically from environment variables
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_BASE_URL;
  if (!envUrl) return "http://localhost:5001/api";
  const clean = envUrl.trim().replace(/\/+$/, "");
  return clean.endsWith("/api") ? clean : `${clean}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
});

/* =====================
   REQUEST INTERCEPTOR
===================== */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

/* =====================
   RESPONSE INTERCEPTOR
===================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.dispatchEvent(new Event("force-logout"));
    }

    return Promise.reject(error);
  }
);

export default api;
