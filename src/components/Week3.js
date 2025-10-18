import React, { useEffect, useState } from "react";

/**
 * Week 3 — Daily Journaling & Gratitude
 * - Autosaves all inputs to localStorage (key: "week3-notes")
 * - Separate journaling areas for each day (morning / midday / evening + 3 gratitude)
 * - Simple review prompts at the top
 */

export default function Week3() {
  const STORAGE_KEY = "week3-notes";

  const [data, setData] = useState({
    // Week in Review
    experience: "",
    workFamily: "",
    wellbeing: "",
    journalingInsights: "",

    // Daily sections
    sunday:     { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
    monday:     { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
    tuesday:    { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
    wednesday:  { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
    thursday:   { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
    friday:     { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
    saturday:   { am: "", noon: "", pm: "", g1: "", g2: "", g3: "" },
  });

  // Load saved notes
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setData(JSON.parse(saved));
  }, []);

  // Autosave on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Helper to update nested fields
  const setField = (path, value) => {
    setData((prev) => {
      const next = structuredClone(prev);
      let ref = next;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      ref[path[path.length - 1]] = value;
      return next;
    });
  };

  // Reusable day block
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
      <h1>Welcome to Week 3!</h1>
      <p>
        This week, we'll continue to build trust and gather more information through deep listening.
        We'll also begin to observe patterns as we introduce the powerful practice of gratitude.
      </p>

      <h2>Your Week in Review</h2>
      <label>Overall, how was your week? What were some key moments or feelings?</label>
      <textarea
        placeholder="Share your experience..."
        value={data.experience}
        onChange={(e) => setField(["experience"], e.target.value)}
        style={taLong}
      />

      <label>How are things with your work and your family?</label>
      <textarea
        placeholder="Reflect on your professional and personal life..."
        value={data.workFamily}
        onChange={(e) => setField(["workFamily"], e.target.value)}
        style={taLong}
      />

      <label>How would you describe your overall well-being, sleep, and physical state this week?</label>
      <textarea
        placeholder="Consider your health and energy..."
        value={data.wellbeing}
        onChange={(e) => setField(["wellbeing"], e.target.value)}
        style={taLong}
      />

      <label>
        How was your experience with the daily journaling from last week? Did you gain any insights?
      </label>
      <textarea
        placeholder="Share your thoughts on journaling..."
        value={data.journalingInsights}
        onChange={(e) => setField(["journalingInsights"], e.target.value)}
        style={taLong}
      />

      <h2>Week 3 Exercise: Daily Journaling & Gratitude</h2>
      <p><strong>The Power of Gratitude</strong> — Practicing gratitude can reduce stress, improve sleep,
        and increase overall well-being by shifting focus to what is abundant in your life.</p>

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
