// src/api.js
const API_BASE = "http://localhost:4000";

// --- token helpers ---
const TOKEN_KEY = "jb_token";
export function setToken(t) {
  localStorage.setItem(TOKEN_KEY, t);
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function makeHeaders(isJson = true) {
  const h = {};
  if (isJson) h["Content-Type"] = "application/json";
  const t = getToken();
  if (t) h["Authorization"] = `Bearer ${t}`;
  return h;
}

async function parseJsonOrThrow(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Unexpected response (not JSON). Is the server on port 4000 and the path correct? Response starts with: ${text.slice(
        0,
        120
      )}`
    );
  }
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: makeHeaders(true),
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) {
    const data = await parseJsonOrThrow(res);
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return parseJsonOrThrow(res);
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: makeHeaders(false),
  });
  if (!res.ok) {
    const data = await parseJsonOrThrow(res);
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return parseJsonOrThrow(res);
}

// Convenience wrappers used elsewhere
export async function getClientWeek(clientId, week) {
  return apiGet(`/clients/${clientId}/weeks/${week}`);
}

export async function saveClientWeek(clientId, week, data) {
  return apiPost(`/clients/${clientId}/weeks/${week}`, { data });
}
