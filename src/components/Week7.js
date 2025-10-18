import React, { useEffect, useState } from "react";

/**
 * Week 7 — Visualization (no affirmations) + Daily Journaling & Gratitude
 * - Autosaves to localStorage (key: "week7-notes")
 */

export default function Week7() {
  const STORAGE_KEY = "week7-notes";

  const [data, setData] = useState({
    weekOverall: "",
    coreValuesReflection: "",
    visualizationInsights: "",

    // per-day fields (plus a daily Visualization Reflection box)
    sunday:     { am: "", noon: "", pm: "", g1: "", g2: "", g3: "", viz: "" },
    monday:     { am: "", noon: "", pm: "", g1: "", g2: "", g3: "", viz: "" },
    tuesday:    { am: "", noon: "", pm: "", g1: "", g2: "", g3: "", viz: "" },
    wednesday:  { am: "", noon: "", pm: "", g1: "", g2: "", g3: "", viz: "" },
    thursday:   { am: "", noon: "", pm: "", g1: "", g2: "", g3: "", viz: "" },
    friday:     { am: "", noon: "", pm: "", g1: "", g2: "", g3: "", viz: "" },
    saturday:   { am: "", noon: "", pm: "", g1: "", g2: "", g3: "", viz: "" },
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setData(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const setField = (path, value) => {
    setData((prev) => {
      const next = structuredClone(prev);
      let ref = next;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      ref[path[path.length - 1]] = value;
      return next;
    });
  };

  const Day = ({ name, title }) => (
    <div style={card}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <label>Morning:</label>
      <textarea style={ta} placeholder="I feel..." value={data[name].am} onChange={(e)=>setField([name,"am"], e.target.value)} />
      <label>Midday:</label>
      <textarea style={ta} placeholder="I feel..." value={data[name].noon} onChange={(e)=>setField([name,"noon"], e.target.value)} />
      <label>Evening:</label>
      <textarea style={ta} placeholder="I feel..." value={data[name].pm} onChange={(e)=>setField([name,"pm"], e.target.value)} />
      <div style={{ marginTop: 8 }}>
        <strong>Daily Gratitude</strong>
        <input style={input} placeholder="1. I am grateful for..." value={data[name].g1} onChange={(e)=>setField([name,"g1"], e.target.value)} />
        <input style={input} placeholder="2. I am grateful for..." value={data[name].g2} onChange={(e)=>setField([name,"g2"], e.target.value)} />
        <input style={input} placeholder="3. I am grateful for..." value={data[name].g3} onChange={(e)=>setField([name,"g3"], e.target.value)} />
      </div>
      <label style={{ marginTop: 8 }}>Visualization Reflection</label>
      <textarea style={ta} placeholder="Reflect on your visualization for today..." value={data[name].viz} onChange={(e)=>setField([name,"viz"], e.target.value)} />
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1>Welcome to Week 7!</h1>
      <p>This week deepens your understanding of your values through the power of visualization. (No affirmations yet.)</p>

      <h2>Weekly Check-in</h2>
      <label>How was your week overall, and how did your journaling & gratitude go?</label>
      <textarea style={taLong} placeholder="Share your experience..." value={data.weekOverall} onChange={(e)=>setField(["weekOverall"], e.target.value)} />

      <label>How was identifying and reflecting on your core values? Any new insights?</label>
      <textarea style={taLong} placeholder="Share your insights..." value={data.coreValuesReflection} onChange={(e)=>setField(["coreValuesReflection"], e.target.value)} />

      <h2>Guided Visualization Exercise</h2>
      <p>Envision your future with 1–2 core values in mind. Engage your senses, feel the alignment, and notice the feeling.</p>

      <h2>At-Home Activities</h2>
      <Day name="sunday" title="Sunday" />
      <Day name="monday" title="Monday" />
      <Day name="tuesday" title="Tuesday" />
      <Day name="wednesday" title="Wednesday" />
      <Day name="thursday" title="Thursday" />
      <Day name="friday" title="Friday" />
      <Day name="saturday" title="Saturday" />

      <p style={{ fontSize: 12, color: "#6b7280" }}>Notes autosave locally on your device.</p>
    </div>
  );
}

const ta = { width: "100%", minHeight: 60, marginBottom: 8 };
const taLong = { width: "100%", minHeight: 100, marginBottom: 16 };
const input = { width: "100%", marginTop: 6, marginBottom: 6 };
const card = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, marginBottom: 12, background: "#fff" };
