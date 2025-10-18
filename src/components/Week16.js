import React, { useEffect, useState } from "react";

/**
 * Week 16 — Progress Review & Mind–Body Connection
 * - Autosaves to localStorage (key: "week16-notes")
 * - Weekly progress review & adjustments
 * - Daily journaling + gratitude + visualization + affirmations + 30-min walk reflection
 */

export default function Week16() {
  const STORAGE_KEY = "week16-notes";

  const [data, setData] = useState({
    // Weekly check-in & review
    weeklyExperience: "",
    motivationScore: "",
    progressReview: "",
    challengesLessons: "",
    adjustments: "",
    movementPlan: "",
    // Daily blocks
    sunday:     { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", walk:"" },
    monday:     { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", walk:"" },
    tuesday:    { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", walk:"" },
    wednesday:  { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", walk:"" },
    thursday:   { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", walk:"" },
    friday:     { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", walk:"" },
    saturday:   { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", walk:"" },
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
        <input style={input} placeholder="1. I am grateful for..." value={data[name].g1} onChange={e=>setField([name,"g1"], e.target.value)} />
        <input style={input} placeholder="2. I am grateful for..." value={data[name].g2} onChange={e=>setField([name,"g2"], e.target.value)} />
        <input style={input} placeholder="3. I am grateful for..." value={data[name].g3} onChange={e=>setField([name,"g3"], e.target.value)} />
      </div>

      <label style={{ marginTop: 8 }}>Visualization Reflection</label>
      <textarea style={ta} placeholder="Reflect on your visualization for today..." value={data[name].viz} onChange={e=>setField([name,"viz"], e.target.value)} />

      <label style={{ marginTop: 8 }}>Affirmation Practice</label>
      <textarea style={ta} placeholder="Reflect on your affirmations for today..." value={data[name].aff} onChange={e=>setField([name,"aff"], e.target.value)} />

      <label style={{ marginTop: 8 }}>Physical Activity & Reflection (30-minute walk)</label>
      <textarea style={ta} placeholder="How did the walk feel? Any changes in mood or energy?" value={data[name].walk} onChange={e=>setField([name,"walk"], e.target.value)} />
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1>Welcome to Week 16!</h1>
      <p>Evaluate progress, make adjustments, and integrate the mind–body connection with movement.</p>

      <h2>Weekly Check-in</h2>
      <label>How was your week, and how did your at-home activities go?</label>
      <textarea
        style={taLong}
        placeholder="Share your experience..."
        value={data.weeklyExperience}
        onChange={e=>setField(["weeklyExperience"], e.target.value)}
      />

      <label>On a scale of 1–10, how motivated and confident do you feel?</label>
      <input
        style={input}
        placeholder="e.g., 7/10 motivated, 6/10 confident"
        value={data.motivationScore}
        onChange={e=>setField(["motivationScore"], e.target.value)}
      />

      <h2>Comprehensive Progress Review</h2>
      <label>Looking back at your SMART goals, what progress have you made? What successes are you most proud of?</label>
      <textarea
        style={taLong}
        placeholder="Reflect on your progress and successes..."
        value={data.progressReview}
        onChange={e=>setField(["progressReview"], e.target.value)}
      />

      <label>What challenges have you encountered consistently? What have you learned so far?</label>
      <textarea
        style={taLong}
        placeholder="Reflect on challenges and lessons learned..."
        value={data.challengesLessons}
        onChange={e=>setField(["challengesLessons"], e.target.value)}
      />

      <label>Where might adjustments help (timelines, breaking goals down, alternative strategies)?</label>
      <textarea
        style={taLong}
        placeholder="Suggest potential adjustments..."
        value={data.adjustments}
        onChange={e=>setField(["adjustments"], e.target.value)}
      />

      <h2>Integrating Body Movement</h2>
      <textarea
        style={taLong}
        placeholder="How will you integrate movement this week? (e.g., daily 30-min walk, stretch breaks)"
        value={data.movementPlan}
        onChange={e=>setField(["movementPlan"], e.target.value)}
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
const input = { width: "100%", marginTop: 6, marginBottom: 10, padding: 8 };
const card = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, marginBottom: 12, background: "#fff" };
