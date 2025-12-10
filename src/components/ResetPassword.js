import React, { useState } from "react";
import { apiPost } from "../api";

// Simple Reset Password page
export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      // Adjust endpoint/body if your backend uses a different shape
      await apiPost("/reset", { token, password });
      setStatus("Your password has been reset. You can now log in.");
    } catch (err) {
      setStatus(
        err?.response?.data?.error ||
          err?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "40px auto", textAlign: "center" }}>
      <h2>JB Coaching App</h2>
      <h3>Reset Password</h3>

      <form onSubmit={handleSubmit}>
        <div style={{ textAlign: "left", marginBottom: 10 }}>
          <label>Reset Token</label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>

        <div style={{ textAlign: "left", marginBottom: 10 }}>
          <label>New Password</label>
          <input
            type="password"
            autoComplete="new-password"
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
          {loading ? "Resetting…" : "Reset Password"}
        </button>
      </form>

      {status && <p style={{ marginTop: 10 }}>{status}</p>}
    </div>
  );
}
