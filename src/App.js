import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import CoachDashboard from "./components/CoachDashboard";

export default function App() {
  const [route, setRoute] = useState("home");
  const [hasToken, setHasToken] = useState(!!localStorage.getItem("token"));

  // If the token changes (login/logout), update UI
  useEffect(() => {
    const onStorage = () => setHasToken(!!localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Simple helpers

  const goUserDash = () => setRoute("dashboard");
  const goCoachDash = () => setRoute("coach");
  const logout = () => {
    localStorage.removeItem("token");
    setHasToken(false);
    setRoute("home");
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>JB Coaching App</h1>

        {/* Top-right actions */}
        <div style={{ display: "flex", gap: 8 }}>
          {hasToken ? (
            <>
              <button onClick={goUserDash} style={btn}>Enter Dashboard</button>
              <button onClick={goCoachDash} style={btnOutline}>Coach Dashboard</button>
              <button onClick={logout} style={btnDanger}>Log out</button>
            </>
          ) : null}
        </div>
      </header>

      {/* Body */}
      {route === "coach" && hasToken ? (
        <CoachDashboard />
      ) : route === "dashboard" && hasToken ? (
        <Dashboard />
      ) : (
        <Login />
      )}
    </div>
  );
}

const btn = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #111827",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
};

const btnOutline = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #374151",
  background: "#fff",
  color: "#111827",
  cursor: "pointer",
};

const btnDanger = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #ef4444",
  background: "#ef4444",
  color: "#fff",
  cursor: "pointer",
};
