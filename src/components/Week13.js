import React, { useEffect, useState } from "react";

/**
 * Week 13 — Mindset & Affirmations
 * - Autosaves to localStorage (key: "week13-notes")
 * - Weekly check-in + mindset section
 * - Daily journaling + gratitude + visualization + affirmations
 */

export default function Week13() {
  const STORAGE_KEY = "week13-notes";

  const [data, setData] = useState({
    // Weekly check-in
    weeklyExperience: "",
    actionPlanProgress: "",
    mindsetNotes: "",
    // Daily blocks
    sunday:     { am: "", noon: "", pm: "", g1: "", g2: "", g3: "", viz: "", aff: "" },
    monday:     { am: "", noon: "", pm: "", g1: "", g2: "", g3: "", viz: "", aff: "" },
    tuesday:    { am: "", noon: "", pm: "", g1: "", g2: "", g3: "", viz: "", aff: "" },
    wednesday:  { am: "", noon: "", pm: "", g1: "", g2: "", g3: "", viz: "", aff: "" },
    thursday:   { am: "", noon: "", pm: "", g1: "", g2: "", g3: "", viz: "", aff: "" },
    friday:     { am: "", noon: "", pm: "", g1: "", g2: "", g3: "", viz: "", aff: "" },
    saturday:   { am: "", noon: "", pm: "", g1: "", g2: "", g3: "", viz: "", aff: "" },
  });

  // Load once
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setData(JSON.parse(saved));
  }, []);

  // Autosave
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const setField = (path, value) => {
    setData(prev => {
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
      <textarea style={ta} placeholder="I feel..." value={data[name].am} onChange={e=>setField([name,"am"], e.target.value)} />

      <label>Midday:</label>
      <textarea style={ta} placeholder="I feel..." value={data[name].noon} onChange={e=>setField([name,"noon"], e.target.value)} />

      <label>Evening:</label>
      <textarea style={ta} placeholder="I feel..." value={data[name].pm} onChange={e=>setField([name,"pm"], e.target.value)} />

      <div style={{ marginTop: 8 }}>
        <strong>Daily Gratitude</strong>
        <input  style={input} placeholder="1. I am grateful for..." value={data[name].g1} onChange={e=>setField([name,"g1"], e.target.value)} />
        <input  style={input} placeholder="2. I am grateful for..." value={data[name].g2} onChange={e=>setField([name,"g2"], e.target.value)} />
        <input  style={input} placeholder="3. I am grateful for..." value={data[name].g3} onChange={e=>setField([name,"g3"], e.target.value)} />
      </div>

      <label style={{ marginTop: 8 }}>Visualization Reflection</label>
      <textarea style={ta} placeholder="Reflect on your visualization for today..." value={data[name].viz} onChange={e=>setField([name,"viz"], e.target.value)} />

      <label style={{ marginTop: 8 }}>Affirmation Practice</label>
      <textarea style={ta} placeholder="Reflect on your affirmations for today..." value={data[name].aff} onChange={e=>setField([name,"aff"], e.target.value)} />
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1>Welcome to Week 13!</h1>
      <p>Strengthen a consistent action mindset by introducing <strong>affirmations</strong>.</p>

      <h2>Weekly Check-in</h2>
      <label>How was your week overall? How did your journaling, gratitude, and visualization exercises go?</label>
      <textarea
        style={taLong}
        placeholder="Share your experience..."
        value={data.weeklyExperience}
        onChange={e=>setField(["weeklyExperience"], e.target.value)}
      />

      <label>What were your initial experiences with implementing your action plan?</label>
      <textarea
        style={taLong}
        placeholder="Reflect on your progress..."
        value={data.actionPlanProgress}
        onChange={e=>setField(["actionPlanProgress"], e.target.value)}
      />

      <h2>Mindset & Consistency</h2>
      <textarea
        style={taLong}
        placeholder="Notes about limiting beliefs, self-talk, or mindset shifts you want to practice this week…"
        value={data.mindsetNotes}
        onChange={e=>setField(["mindsetNotes"], e.target.value)}
      />

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
const taLong = { width: "100%", minHeight: 110, marginBottom: 16 };
const input = { width: "100%", marginTop: 6, marginBottom: 6 };
const card = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, marginBottom: 12, background: "#fff" };
