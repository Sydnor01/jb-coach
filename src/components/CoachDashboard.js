import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "../api";
import LogoutButton from "./LogoutButton";

export default function CoachDashboard() {
const [clients, setClients] = useState([]);
useEffect(() => {
  let alive = true;

  async function fetchClients() {
    try {
      const res = await apiGet("/clients"); // returns { clients: [{id,email}, ...] }
      if (!alive) return;
      const list = (res?.clients || []).map(c => ({
        id: c.id,
        name: c.email || `Client ${c.id}`,
        email: c.email || "",
      }));
      setClients(list);
    } catch (err) {
      console.error("Failed to load clients:", err);
    }
  }

  fetchClients();
  return () => { alive = false; };
}, []);

  const [selectedClient, setSelectedClient] = useState(null);
  const [weekToLoad, setWeekToLoad] = useState(1);
  const [viewerData, setViewerData] = useState(null);
  const [viewerLoading, setViewerLoading] = useState(false);
  const [viewerError, setViewerError] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

const [coachNote, setCoachNote] = useState("");

  // --- Load Week ---
  const loadWeek = async () => {
    if (!selectedClient) return;
    setViewerLoading(true);
    setViewerError("");
    setViewerData(null);
    setSaveMsg("");
    try {
      const json = await apiGet(`/clients/${selectedClient.id}/weeks/${Number(weekToLoad)}`);
      setViewerData(json);
setCoachNote(json?.data?.note ?? "");

    } catch (err) {
      console.error("Load week error:", err);
      setViewerError(err?.message || "Failed to fetch.");
    } finally {
      setViewerLoading(false);
    }
  };

  // --- Save Week ---
  const saveWeek = async () => {
  if (!selectedClient || !weekToLoad) return;
  setSaveMsg("");
  setViewerError("");
  try {
    const clientId = Number(selectedClient.id ?? selectedClient);
    const week = Number(weekToLoad);

    // Save only the note (merge with any existing week fields if present)
    const payload = { ...((viewerData && viewerData.data) || {}), note: coachNote };

    await apiPost(`/clients/${clientId}/weeks/${week}`, payload);

    // Reflect the saved state in the viewer
    setViewerData(prev => ({
      ...(prev || {}),
      data: payload,
      updated_at: new Date().toISOString(),
    }));

    setSaveMsg("Saved ✔");
  } catch (err) {
    console.error("Save week error:", err);
    const msg = err?.response?.data?.error || err?.message || "Failed to save week";
    setViewerError(msg);
  }
};


  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h2>Coach Dashboard</h2>
        <LogoutButton />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label><strong>Select Client:</strong></label>{" "}
        <select
          onChange={(e) => setSelectedClient(clients.find(c => c.id === Number(e.target.value)))}
          value={selectedClient?.id || ""}
        >
          <option value="">-- Choose a client --</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "8px 0" }}>
        <label htmlFor="week-input"><strong>Week #</strong></label>
        <input
          id="week-input"
          type="number"
          min={1}
          value={weekToLoad}
          onChange={(e) => setWeekToLoad(e.target.value)}
          style={{ width: 80 }}
        />
        <button onClick={loadWeek} disabled={viewerLoading}>
          {viewerLoading ? "Loading…" : "Load week"}
        </button>
      </div>
<div style={{ margin: "12px 0" }}>
  <label htmlFor="coach-note"><strong>Coach Note</strong></label>
  <textarea
    id="coach-note"
    rows={5}
    value={coachNote}
    onChange={(e) => setCoachNote(e.target.value)}
    style={{ width: "100%", padding: 8, marginTop: 6 }}
    placeholder="Type your note here…"
  />
</div>

      <button
        onClick={saveWeek}
        disabled={!viewerData || !selectedClient || !weekToLoad}
      >
        Save Week
      </button>
      {saveMsg && <span style={{ marginLeft: 8 }}>{saveMsg}</span>}

      {viewerError && <p style={{ color: "crimson" }}>{viewerError}</p>}

      {viewerData && (
        <pre
          style={{
            background: "#f9f9f9",
            border: "1px solid #ddd",
            padding: "12px",
            marginTop: "16px",
            borderRadius: "8px",
          }}
        >
          {JSON.stringify(viewerData, null, 2)}
        </pre>
      )}
    </div>
  );
}

