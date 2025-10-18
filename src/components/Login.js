// src/components/Login.js
import React, { useState } from "react";
import { apiPost, apiGet, setToken, getToken, clearToken } from "../api";

export default function Login() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("Password123!");
  const [msg, setMsg] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("…logging in");
    try {
      const res = await apiPost("/login", { email, password });
      setToken(res.token);
      setMsg(`✅ Logged in as ${res.user.email}`);
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    }
  }

  async function handleMe() {
    setMsg("…checking profile");
    try {
      const res = await apiGet("/me");
      setMsg(`✅ Token is valid. User: ${res.user.email}`);
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    }
  }

  function handleLogout() {
    clearToken();
    setMsg("✅ Logged out");
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin} style={{ display: "grid", gap: 8 }}>
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%" }}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%" }}
          />
        </label>

        <button type="submit">Log In</button>
      </form>

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={handleMe}>Check Profile</button>
        <button onClick={handleLogout}>Log out</button>
      </div>

      <p style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>{msg}</p>

      <small style={{ color: "#6b7280" }}>
        Stored token (starts with): {getToken().slice(0, 12) || "(none)"}
      </small>
    </div>
  );
}
