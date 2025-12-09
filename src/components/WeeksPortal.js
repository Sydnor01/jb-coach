import React from "react";
import WeeksApp from "./WeeksApp";

/**
 * Simple portal that embeds your existing Weeks UI.
 * No array destructuring or fancy state here — just render.
 */
export default function WeeksPortal() {
  return (
    <div style={{ marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>Weeks Portal</h3>
      <p style={{ color: "#6b7280", marginTop: -6 }}>
        Protected by login ✅ — Your weeks UI is embedded below.
      </p>
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fff" }}>
        <WeeksApp />
      </div>
    </div>
  );
}
