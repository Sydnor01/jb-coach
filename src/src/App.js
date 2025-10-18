import React from "react";
import Login from "./components/Login";

export default function App() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
      <h1 style={{ marginTop: 12 }}>JB Coaching App</h1>
      <Login />
    </div>
  );
}
