import React, { useEffect, useState } from "react";

/**
 * Week 4 — Mindful Noticing + Daily Journaling & Gratitude
 * - Autosaves to localStorage (key: "week4-notes")
 * - Separate journaling areas for each day (morning / midday / evening + 3 gratitude)
 * - Weekly reflections at the top
 */

export default function Week4() {
  const STORAGE_KEY = "week4-notes";

  const [data, setData] = useState({
    // Week in Review
    journalingExperience: "",
    gratitudeExperience: "",

    // Daily sections
    sunday:     { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
    monday:     { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
    tuesday:    { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
    wednesday:  { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
    thursday:   { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
    friday:     { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
    saturday:   { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
  });

  // Load saved
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setData(JSON.parse(saved));
  }, []);

  // Autosave
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Helper
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
      <textarea
        placeholder="I feel..."
        value={data[name].am}
        onChange={(e) => setField([name, "am"], e.target.value)}
        style={ta}
      />

      <label>Midday:</label>
      <textarea
        placeholder="I feel..."
        value={data[name].noon}
        onChange={(e) => setField([name, "noon"], e.target.value)}
        style={ta}
      />

      <label>Evening:</label>
      <textarea
        placeholder="I feel..."
        value={data[name].pm}
        onChange={(e) => setField([name, "pm"], e.target.value)}
        style={ta}
      />

      <div style={{ marginTop: 8 }}>
        <strong>Daily Gratitude</strong>
        <input
          placeholder="1. I am grateful for..."
          value={data[name].g1}
          onChange={(e) => setField([name, "g1"], e.target.value)}
          style={input}
        />
        <input
          placeholder="2. I am grateful for..."
          value={data[name].g2}
          onChange={(e) => setField([name, "g2"], e.target.value)}
          style={input}
        />
        <input
          placeholder="3. I am grateful for..."
          value={data[name].g3}
          onChange={(e) => setField([name, "g3"], e.target.value)}
          style={input}
        />
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1>Welcome to Week 4!</h1>
      <p>
        This week, we transition from deep listening to noticing. We will begin to focus on{" "}
        <strong>clarity and alignment</strong> by exploring your personal values.
      </p>

      <h2>Your Week in Review</h2>
      <label>How was your experience with the daily journaling this past week?</label>
      <textarea
        placeholder="Share your experience..."
        value={data.journalingExperience}
        onChange={(e) => setField(["journalingExperience"], e.target.value)}
        style={taLong}
      />

      <label>How was your experience with the daily gratitude practice?</label>
      <textarea
        placeholder="Reflect on your gratitude practice..."
        value={data.gratitudeExperience}
        onChange={(e) => setField(["gratitudeExperience"], e.target.value)}
        style={taLong}
      />

      <h2>New Exercise: Mindful Noticing</h2>
      <p>
        As you go about your days and continue with your journaling and gratitude, simply notice
        moments when you feel particularly good, authentic, or truly yourself. What values might be
        at play in those moments? No need to write anything formal yet—just observe.
      </p>

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

/* ——— styles ——— */
const ta = { width: "100%", minHeight: 60, marginBottom: 8 };
const taLong = { width: "100%", minHeight: 100, marginBottom: 16 };
const input = { width: "100%", marginTop: 6, marginBottom: 6 };
const card = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  marginBottom: 12,
  background: "#fff",
};
