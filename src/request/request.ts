import axios from "axios";
import { loadState } from "../storage/store";

const request = axios.create({
  baseURL: import.meta.env.VITE_LOGIN || "https://157.230.248.45:5050/api/v1",
});

request.interceptors.request.use((config) => {
  const role = loadState("role") || localStorage.getItem("role");

  let tokenKey = "";
  if (role === "SUPER ADMIN" || role === "ADMIN") {
    tokenKey = "admin";
  } else if (role === "STORE") {
    tokenKey = "store";
  }

  const token = loadState(tokenKey) || sessionStorage.getItem(tokenKey);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

request.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export { request };
