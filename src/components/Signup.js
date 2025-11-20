import React, { useState } from "react";
import { apiPost, apiGet } from "../api";

// Simple signup page – creates a user and then routes by role
export default function Signup({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client"); // default to client
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // hit /signup on the backend
      const res = await apiPost("/signup", { name, email, password, role });

      if (!res || !res.user) {
        throw new Error(res?.error || "Signup failed");
      }

      const u = res.user;
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));

      // optional: verify session
      try {
        await apiGet("/me");
      } catch {}

      setSuccess("Account created successfully!");

      // route by role
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
        "Signup failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>
      <h2>JB Coaching App</h2>
      <h3>Create Account</h3>

      <form onSubmit={handleSubmit}>
        <div style={{ textAlign: "left", marginBottom: 10 }}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>

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

        <div style={{ textAlign: "left", marginBottom: 10 }}>
          <label>Password</label>
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>

        <div style={{ textAlign: "left", marginBottom: 16 }}>
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          >
            <option value="client">Client</option>
            <option value="coach">Coach</option>
          </select>
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
          {loading ? "Creating account…" : "Sign Up"}
        </button>
      </form>

      {error && <p style={{ color: "crimson", marginTop: 10 }}>{error}</p>}
      {success && (
        <p style={{ color: "green", marginTop: 10 }}>{success}</p>
      )}
    </div>
  );
}
