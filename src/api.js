// Simple fetch-based API helper (no axios needed)
// Decide the base URL depending on where the app is running
const isBrowser = typeof window !== "undefined";
const isLocalhost =
  isBrowser &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

// REACT_APP_API_BASE still wins if present
const envBase = process.env.REACT_APP_API_BASE;
const API_BASE =
  envBase ||
  (isLocalhost
    ? "http://localhost:4000"
    : "https://jb-coach-server.onrender.com");

console.log("API base URL:", API_BASE);

// Internal helper to call the API with fetch
async function request(path, options = {}) {
  const url = API_BASE.replace(/\/+$/, "") + path;
  const res = await fetch(url, {
    credentials: "include", // important for cookies
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) ||
      `Request failed with status ${res.status}`;
    const err = new Error(message);
    err.response = { status: res.status, data };
    throw err;
  }

  return data;
}

export function apiGet(path) {
  return request(path, { method: "GET" });
}

export function apiPost(path, body) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(body || {}),
  });
}

// Helpers for coach/client week data
export function getClientWeek(clientId, week) {
  return apiGet(`/clients/${clientId}/weeks/${week}`);
}

export function saveClientWeek(clientId, week, data) {
  return apiPost(`/clients/${clientId}/weeks/${week}`, data);
}

export function apiLogout() {
  return apiPost("/logout", {});
}
// Legacy token helpers kept for compatibility with older code.
// They don't do anything now because we use httpOnly cookies instead.
export function setToken(_t) {
  // no-op
}
export function getToken() {
  return null;
}
export function clearToken() {
  // no-op
}

export default {
  get: apiGet,
  post: apiPost,
};

