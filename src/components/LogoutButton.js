import React from "react";
import { apiPost } from "../api";

// Simple Logout button used in CoachDashboard and WeeksApp
export default function LogoutButton() {
  async function handleLogout() {
    try {
      // Call backend logout to clear cookie
      await apiPost("/logout", {});
    } catch (err) {
      // Even if server fails, we still clear local client state
      console.error("Logout error:", err);
    } finally {
      // Clear local user info and send back to login
      localStorage.removeItem("user");
      window.location.assign("/login");
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      style={{
        padding: "8px 16px",
        background: "#991b1b",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        fontSize: 14,
      }}
    >
      Log Out
    </button>
  );
}
