import React, { useEffect, useState } from "react";

/**
 * Week 5 — Core Values (Best Self Moments) + Daily Journaling & Gratitude
 * - Autosaves to localStorage (key: "week5-notes")
 */

export default function Week5() {
  const STORAGE_KEY = "week5-notes";

  const [data, setData] = useState({
    // Week in Review
    weekOverall: "",
    journalingPatterns: "",
    gratitudeHighlights: "",

    // New Exercise: My Best Self Moments
    moment1: "",
    moment2: "",
    moment3: "",

    // Daily
    sunday:     { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
    monday:     { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
    tuesday:    { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
    wednesday:  { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
    thursday:   { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
    friday:     { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
    saturday:   { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
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
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1>Welcome to Week 5!</h1>
      <p>This week, we will transition to defining your core values by noticing your “Best Self Moments.”</p>

      <h2>Your Week in Review</h2>
      <label>How was your week overall, and how did journaling and gratitude feel?</label>
      <textarea style={taLong} placeholder="Share your experience..." value={data.weekOverall} onChange={(e)=>setField(["weekOverall"], e.target.value)} />

      <label>Did you notice any patterns in your daily journaling?</label>
      <textarea style={taLong} placeholder="Reflect on any patterns or recurring themes..." value={data.journalingPatterns} onChange={(e)=>setField(["journalingPatterns"], e.target.value)} />

      <label>What were some of the things you were grateful for this past week?</label>
      <textarea style={taLong} placeholder="List some of the things you were grateful for..." value={data.gratitudeHighlights} onChange={(e)=>setField(["gratitudeHighlights"], e.target.value)} />

      <h2>New Exercise: My Best Self Moments</h2>
      <label>Moment 1:</label>
      <textarea style={taLong} placeholder="Describe a moment you felt your best this week..." value={data.moment1} onChange={(e)=>setField(["moment1"], e.target.value)} />
      <label>Moment 2:</label>
      <textarea style={taLong} placeholder="Describe a second moment..." value={data.moment2} onChange={(e)=>setField(["moment2"], e.target.value)} />
      <label>Moment 3:</label>
      <textarea style={taLong} placeholder="Describe a third moment..." value={data.moment3} onChange={(e)=>setField(["moment3"], e.target.value)} />

      <h2>At-Home Exercises</h2>
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
