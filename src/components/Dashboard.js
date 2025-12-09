import React, { useEffect, useState } from "react";
import { apiGet } from "../api";
import WeeksPortal from "./WeeksPortal";

export default function Dashboard() {
  const [status, setStatus] = useState("checking"); // checking | ok | error
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // ✅ use apiGet so the Authorization header with your token is sent
        const me = await apiGet("/me");
        if (!mounted) return;
        setUser(me.user);
        setStatus("ok");
      } catch (e) {
        if (!mounted) return;
        setStatus("error");
        setMsg("Invalid or expired token. Please go back and log in again.");
      }
    })();
    return () => { mounted = false; };
  }, []);

  function goBack() {
    window.location.href = "/";
  }

  function logout() {
    localStorage.removeItem("jb_token");
    window.location.href = "/";
  }

  if (status === "checking") {
    return (
      <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
        <h1>JB Coaching App</h1>
        <p>Checking your session…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
        <h1>JB Coaching App</h1>
        <p style={{ color: "#b91c1c" }}>{msg}</p>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={goBack} style={btnPrimary}>Back to Login</button>
        </div>
      </div>
    );
  }

  // status === "ok"
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>JB Coaching App</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={goBack} style={btnGhost}>Back</button>
          <button onClick={logout} style={btnGhost}>Log out</button>
        </div>
      </div>

      <h2>Dashboard</h2>
      <p>✅ Verified</p>
      <p><strong>User:</strong> {user?.email}</p>

      <WeeksPortal />
    </div>
  );
}

const btnPrimary = {
  background: "#4f46e5",
  color: "white",
  padding: "10px 14px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
};

const btnGhost = {
  background: "white",
  color: "#111827",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  cursor: "pointer",
};
