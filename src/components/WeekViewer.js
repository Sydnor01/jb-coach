import React, { useEffect, useState } from "react";

/**
 * Props:
 * - client: { id, name, email }
 * - week: number
 *
 * Reads: GET /clients/:id/weeks/:week  (Authorization: Bearer <token>)
 * Shows: loading, error, or the saved week payload (simple read-only view)
 */
export default function WeekViewer({ client, week }) {
  const [state, setState] = useState({
    loading: true,
    error: "",
    data: null,
  });

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");
      if (!token) {
        setState({ loading: false, error: "Not logged in.", data: null });
        return;
      }
      try {
        setState((s) => ({ ...s, loading: true, error: "" }));
        const res = await fetch(
          `http://localhost:4000/clients/${client.id}/weeks/${week}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (res.status === 404) {
          setState({
            loading: false,
            error: "",
            data: { message: "No saved data yet for this week." },
          });
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Request failed (${res.status})`);
        }

        const json = await res.json();
        setState({ loading: false, error: "", data: json });
      } catch (err) {
        setState({
          loading: false,
          error: err?.message || "Failed to load week data.",
          data: null,
        });
      }
    }

    load();
  }, [client.id, week]);

  if (state.loading) return <p>Loading week {week}…</p>;
  if (state.error) return <p style={{ color: "#b91c1c" }}>Error: {state.error}</p>;

  // Simple read-only view. We’ll pretty it up after it works.
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
      <h4 style={{ marginTop: 0 }}>
        Viewing {client.name} — Week {week}
      </h4>
      <pre
        style={{
          background: "#f8fafc",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: 12,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          margin: 0,
        }}
      >
        {JSON.stringify(state.data, null, 2)}
      </pre>
    </div>
  );
}
