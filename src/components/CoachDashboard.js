// src/components/CoachDashboard.js
import React, { useMemo, useState } from "react";
import { getClientWeek, saveClientWeek } from "../api";

const mockClients = [
  { id: 101, name: "Alicia Brown", email: "alicia@example.com", currentWeek: 7,  lastActive: "2025-10-01" },
  { id: 102, name: "Ben Carter",   email: "ben@example.com",   currentWeek: 3,  lastActive: "2025-09-29" },
  { id: 103, name: "Chloe Diaz",   email: "chloe@example.com", currentWeek: 12, lastActive: "2025-10-04" },
];

export default function CoachDashboard({ onBack, onLogout }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // Viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [weekToLoad, setWeekToLoad] = useState(1);
  const [viewerLoading, setViewerLoading] = useState(false);
  const [viewerError, setViewerError] = useState("");
  const [viewerData, setViewerData] = useState(null);

  // New: a small coach note editor
  const [coachNote, setCoachNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockClients;
    return mockClients.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      String(c.currentWeek).includes(q)
    );
  }, [query]);

  const selectedClient = useMemo(
    () => mockClients.find(c => c.id === selectedId) || null,
    [selectedId]
  );

  const openViewer = (client) => {
    setViewerOpen(true);
    setViewerError("");
    setViewerData(null);
    setSaveMsg("");
    setCoachNote("");
    setWeekToLoad(client?.currentWeek || 1);
  };

  const loadWeek = async () => {
    if (!selectedClient) return;
    setViewerLoading(true);
    setViewerError("");
    setViewerData(null);
    setSaveMsg("");
    try {
      const json = await getClientWeek(selectedClient.id, Number(weekToLoad));
      setViewerData(json);
      // Pre-fill coach note if present
      const existingNote = json?.data?.note ?? "";
      setCoachNote(existingNote);
    } catch (err) {
      setViewerError(err?.message || "Failed to fetch.");
    } finally {
      setViewerLoading(false);
    }
  };

  const saveNote = async () => {
    if (!selectedClient || !viewerData) return;
    setSaving(true);
    setSaveMsg("");
    try {
      // Merge the current data with the new note
      const merged = {
        ...(viewerData?.data || {}),
        note: coachNote,
      };
      await saveClientWeek(selectedClient.id, Number(weekToLoad), merged);
      setSaveMsg("✅ Saved");
      // Optionally refresh from server so the JSON view reflects it
      const refreshed = await getClientWeek(selectedClient.id, Number(weekToLoad));
      setViewerData(refreshed);
    } catch (err) {
      setSaveMsg("❌ Save failed: " + (err?.message || "unknown error"));
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 2000);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={onBack}>Back</button>
        <button onClick={onLogout}>Log out</button>
      </div>

      <h2>Coach Dashboard</h2>
      <p>✅ Verified</p>
      <p style={{ color: "#374151" }}>
        Coach (current user): {localStorage.getItem("email") || "unknown"}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
        {/* Left: Clients */}
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fff" }}>
          <h3>Clients</h3>
          <input
            placeholder="Search name, email, or week…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: "100%", marginBottom: 10 }}
          />

          <div style={{ display: "grid", gap: 8 }}>
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelectedId(c.id); setViewerOpen(false); }}
                style={{
                  textAlign: "left",
                  padding: 10,
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  background: selectedId === c.id ? "#eef2ff" : "#fff",
                  cursor: "pointer"
                }}
              >
                <div style={{ fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {c.email} • Week {c.currentWeek} • Last active {c.lastActive}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Details + Viewer */}
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fff", minHeight: 400 }}>
          <h3>Client Details</h3>

          {!selectedClient && <p>Select a client from the left.</p>}

          {selectedClient && (
            <>
              <p><strong>Name:</strong> {selectedClient.name}</p>
              <p><strong>Email:</strong> {selectedClient.email}</p>
              <p><strong>Current Week:</strong> {selectedClient.currentWeek}</p>
              <p><strong>Last Active:</strong> {selectedClient.lastActive}</p>

              {!viewerOpen ? (
                <button onClick={() => openViewer(selectedClient)}>Open Week Viewer (read-only)</button>
              ) : (
                <button onClick={() => setViewerOpen(false)}>Close Viewer</button>
              )}

              {viewerOpen && (
                <div style={{ marginTop: 16, padding: 12, border: "1px dashed #d1d5db", borderRadius: 12 }}>
                  <h4>Week Viewer (read-only)</h4>
                  <p>
                    Viewing <strong>{selectedClient.name}</strong>
                  </p>

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

                  {/* Coach note editor (writes to server) */}
                  <div style={{ marginTop: 12 }}>
                    <label><strong>Coach note</strong></label>
                    <textarea
                      value={coachNote}
                      onChange={(e) => setCoachNote(e.target.value)}
                      placeholder="Add a private note about this client’s week…"
                      style={{ width: "100%", minHeight: 80, marginTop: 6 }}
                    />
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                      <button onClick={saveNote} disabled={saving || !viewerData}>
                        {saving ? "Saving…" : "Save note"}
                      </button>
                      {saveMsg && <span style={{ color: saveMsg.startsWith("✅") ? "#065f46" : "#991b1b" }}>{saveMsg}</span>}
                    </div>
                  </div>

                  {/* Raw JSON preview */}
                  {viewerError && (
                    <p style={{ color: "#b91c1c", marginTop: 12 }}>Error: {viewerError}</p>
                  )}

                  {viewerData ? (
                    <pre style={{ background: "#f9fafb", padding: 12, borderRadius: 8, overflowX: "auto", marginTop: 12 }}>
{JSON.stringify(viewerData, null, 2)}
                    </pre>
                  ) : (
                    !viewerLoading && !viewerError && (
                      <p style={{ color: "#6b7280", marginTop: 12 }}>
                        Tip: Click “Load week” to fetch this client’s saved week data (if any).
                      </p>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
