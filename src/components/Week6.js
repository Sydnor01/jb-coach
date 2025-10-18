import React, { useEffect, useState } from "react";

/**
 * Week 6 — Core Values Selection + Daily Journaling & Gratitude
 * - Autosaves to localStorage (key: "week6-notes")
 * - Select values (checkboxes) + write what top values mean to you
 */

const ALL_VALUES = [
  "Achievement","Adaptability","Adventure","Aesthetics","Ambition","Authenticity","Authority","Autonomy","Balance","Beauty","Belonging","Bravery","Caring","Challenge","Clarity","Collaboration","Commitment","Community","Competence","Connection","Contribution","Control","Courage","Creativity","Curiosity","Empathy","Empowerment","Equality","Excellence","Fairness","Faith","Family","Freedom","Friendship","Generosity","Growth","Happiness","Harmony","Health","Honesty","Hope","Humor","Impact","Independence","Influence","Innovation","Integrity","Justice","Kindness","Learning","Loyalty","Mastery","Mindfulness","Openness","Optimism","Passion","Patience","Peace","Performance","Power","Purpose","Recognition","Relationships","Reliability","Resilience","Respect","Responsibility","Risk","Security","Self-Expression","Service","Spirituality","Stability","Success","Support","Trust","Truth","Understanding","Uniqueness","Wisdom"
];

export default function Week6() {
  const STORAGE_KEY = "week6-notes";

  const [data, setData] = useState({
    weekReview: "",
    gratitudePatterns: "",

    selectedValues: [],
    top1: "", top2: "", top3: "", top4: "", top5: "", top6: "", top7: "",

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

  const toggleValue = (val) => {
    setData((prev) => {
      const has = prev.selectedValues.includes(val);
      const selectedValues = has
        ? prev.selectedValues.filter((v) => v !== val)
        : [...prev.selectedValues, val];
      return { ...prev, selectedValues };
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
      <h1>Welcome to Week 6!</h1>
      <p>This week we identify your core values: select 10–15 that resonate, then write 1–2 sentences for your top 5–7.</p>

      <h2>Weekly Check-in</h2>
      <label>How was your week? How did the journaling go?</label>
      <textarea style={taLong} placeholder="Reflect on your week..." value={data.weekReview} onChange={(e)=>setField(["weekReview"], e.target.value)} />

      <label>Did you notice any patterns with your daily gratitude practice?</label>
      <textarea style={taLong} placeholder="Share your observations..." value={data.gratitudePatterns} onChange={(e)=>setField(["gratitudePatterns"], e.target.value)} />

      <h2>Core Values Selection (choose ~10–15)</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 8, marginBottom: 16 }}>
        {ALL_VALUES.map((v) => (
          <label key={v} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={data.selectedValues.includes(v)}
              onChange={() => toggleValue(v)}
            />
            {v}
          </label>
        ))}
      </div>

      <h2>Top 5–7 — What these values mean to you</h2>
      <p style={{ marginTop: -8, color: "#6b7280" }}>Write 1–2 sentences for each (e.g., “Creativity means expressing my unique ideas…”).</p>
      <textarea style={taLong} placeholder="Core Value #1..." value={data.top1} onChange={(e)=>setField(["top1"], e.target.value)} />
      <textarea style={taLong} placeholder="Core Value #2..." value={data.top2} onChange={(e)=>setField(["top2"], e.target.value)} />
      <textarea style={taLong} placeholder="Core Value #3..." value={data.top3} onChange={(e)=>setField(["top3"], e.target.value)} />
      <textarea style={taLong} placeholder="Core Value #4..." value={data.top4} onChange={(e)=>setField(["top4"], e.target.value)} />
      <textarea style={taLong} placeholder="Core Value #5..." value={data.top5} onChange={(e)=>setField(["top5"], e.target.value)} />
      <textarea style={taLong} placeholder="Core Value #6 (optional)..." value={data.top6} onChange={(e)=>setField(["top6"], e.target.value)} />
      <textarea style={taLong} placeholder="Core Value #7 (optional)..." value={data.top7} onChange={(e)=>setField(["top7"], e.target.value)} />

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

