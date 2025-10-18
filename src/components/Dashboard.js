import React, { useEffect, useState } from "react";
import WeeksPortal from "./WeeksPortal";

/**
 * Protected area (now renders the Weeks portal after token verify).
 */
export default function Dashboard() {
  const [status, setStatus] = useState("Checking token…");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("No token found. Please log in.");
      return;
    }
    (async () => {
      try {
        const res = await fetch("http://localhost:4000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
          setStatus("✅ Verified");
        } else {
          setStatus(data?.error || "Token invalid.");
        }
      } catch {
        setStatus("Network/server error.");
      }
    })();
  }, []);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12, background: "#fff" }}>
        <h2 style={{ marginTop: 0 }}>Dashboard</h2>
        <p>{status}</p>
        {user && (
          <div style={{ marginTop: 8 }}>
            <div><strong>ID:</strong> {user.id}</div>
            <div><strong>Email:</strong> {user.email}</div>
          </div>
        )}
      </div>

      {/* Mount point for your (protected) Weeks UI */}
      {status === "✅ Verified" && <WeeksPortal />}
    </div>
  );
}
