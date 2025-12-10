import React, { useState } from "react";
import { apiPost } from "../api";

// Simple placeholder Forgot Password page
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      // Adjust endpoint later if your backend uses a different path
      await apiPost("/forgot", { email });
      setStatus("If an account exists for this email, a reset link was sent.");
    } catch (err) {
      setStatus(
        err?.response?.data?.error ||
          err?.message ||
          "Unable to process request."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "40px auto", textAlign: "center" }}>
      <h2>JB Coaching App</h2>
      <h3>Forgot Password</h3>

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
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>

      {status && <p style={{ marginTop: 10 }}>{status}</p>}
    </div>
  );
}
