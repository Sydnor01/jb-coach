import React, { useState } from "react";
import { apiPost, apiGet } from "../api";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault(); // stop full page refresh
    setError("");
    setLoading(true);

    try {
      // 1) hit /login (sets cookie on success)
      const res = await apiPost("/login", { email, password });
      if (!res?.success || !res?.user) {
        throw new Error("Login failed");
      }

      // 2) trust server’s /login response, set user & route
      const u = res.user;
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));

      // (optional) verify session
      try {
        await apiGet("/me");
      } catch {}

      // 3) redirect by role using full-page navigation
      if (u.role === "coach") {
        window.location.assign("/coach");
      } else {
        window.location.assign("/client");
      }
    } catch (err) {
      const msg =
        (err &&
          err.response &&
          err.response.data &&
          err.response.data.error) ||
        err?.message ||
        "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
      // keep email/password so they don’t disappear
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "40px auto", textAlign: "center" }}>
      <h2>JB Coaching App</h2>
      <h3>Log In</h3>
      

      <form onSubmit={handleSubmit}>
        <div style={{ textAlign: "left", marginBottom: 10 }}>
          <label>Email</label>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>

        <div style={{ textAlign: "left", marginBottom: 16 }}>
          <label>Password</label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            background: "#111827",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Signing in…" : "Log In"}
        </button>
      </form>

      {error && <p style={{ color: "crimson", marginTop: 10 }}>{error}</p>}

      <p style={{ marginTop: 8 }}>
        <a
          href="/forgot"
          style={{ color: "#2563eb", textDecoration: "none" }}
        >
          Forgot password?
        </a>
      </p>

      <p style={{ marginTop: 12 }}>
        Don’t have an account?{" "}
        <a
          href="/signup"
          style={{ color: "#10b981", textDecoration: "none" }}
        >
          Create one
        </a>
      </p>
    </div>
  );
}
