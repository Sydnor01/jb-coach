import axios from "axios";

// Decide the base URL depending on where the app is running
const isBrowser = typeof window !== "undefined";
const isLocalhost =
  isBrowser && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

// If you ever set REACT_APP_API_BASE, it still wins.
// Otherwise: localhost in dev, Render URL in production.
const envBase = process.env.REACT_APP_API_BASE;
const API_BASE = envBase || (isLocalhost
  ? "http://localhost:4000"
  : "https://jb-coach-server.onrender.com"
);

console.log("API base URL:", API_BASE);

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // important for cookies
});

export function apiGet(path) {
  return api.get(path).then((res) => res.data);
}

export function apiPost(path, body) {
  return api.post(path, body).then((res) => res.data);
}

export function apiLogout() {
  return apiPost("/logout", {});
}

export default api;

