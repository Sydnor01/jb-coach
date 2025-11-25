import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CoachDashboard from "./components/CoachDashboard";
import WeeksApp from "./components/WeeksApp";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import { apiGet } from "./api";

function RequireRole({ role, children }) {
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  if (!user) return <Navigate to="/login" />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function fetchUser() {
    try {
      // Always try /me — it will succeed if the access_token cookie exists
      const me = await apiGet("/me");
      if (me && (me.id || me.user?.id)) {
        const u = me.user || me; // support either {user:{...}} or {...}
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      } else {
        localStorage.removeItem("user");
      }
    } catch (err) {
      // Not logged in is fine
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }
  fetchUser();
}, []);


  if (loading) return <p>Loading...</p>;

  return (
    
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route
          path="/coach"
          element={
            <RequireRole role="coach">
              <CoachDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/client"
          element={
            <RequireRole role="client">
              <WeeksApp />
            </RequireRole>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    
  );
}
