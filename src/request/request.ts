import axios from "axios";
import { loadState } from "../store/store";

const request = axios.create({
  baseURL: import.meta.env.VITE_LOGIN,
});

request.interceptors.request.use((config) => {
  const admintoken = loadState("admin");
  if (admintoken) {
    config.headers.Authorization = `Bearer ${admintoken}`;
  }
  return config;
});
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.status == 403 || error.status == 401) {
      localStorage.removeItem("token");
      window.location.href == "/";
    }
  }
);

export { request };
