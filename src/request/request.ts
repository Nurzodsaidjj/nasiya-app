import axios from "axios";
import { loadState } from "../storage/store";

const request = axios.create({
  baseURL: import.meta.env.VITE_LOGIN || "https://157.230.248.45:5050/api/v1",
});

request.interceptors.request.use((config) => {
  const adminToken = loadState("admin");
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("admin");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export { request };
