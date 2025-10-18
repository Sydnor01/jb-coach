import React, { useEffect, useState } from "react";

/**
 * Week 19 — Maintain Momentum & Prevent Burnout
 * - Autosaves to localStorage (key: "week19-notes")
 * - Weekly check-in + energy review + burnout signs + self-care strategy
 * - Daily journaling + gratitude + visualization + affirmations + self-care + 30-min walk reflection
 */

export default function Week19() {
  const STORAGE_KEY = "week19-notes";

  const [data, setData] = useState({
    // Weekly check-in
    weeklyExperience: "",
    energyMotivation: "",
    burnoutSigns: "",
    selfCareStrategy: "",
    // Daily blocks
    sunday:     { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", selfCare:"", walk:"" },
    monday:     { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", selfCare:"", walk:"" },
    tuesday:    { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", selfCare:"", walk:"" },
    wednesday:  { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", selfCare:"", walk:"" },
    thursday:   { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", selfCare:"", walk:"" },
    friday:     { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", selfCare:"", walk:"" },
    saturday:   { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", selfCare:"", walk:"" },
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

      <label style={{ marginTop: 8 }}>Self-Care you prioritized today</label>
      <textarea style={ta} placeholder="What did you do for self-care and how did it make you feel?" value={data[name].selfCare} onChange={e=>setField([name,"selfCare"], e.target.value)} />

      <label style={{ marginTop: 8 }}>Physical Activity & Reflection (30-minute walk)</label>
      <textarea style={ta} placeholder="How did the walk feel? Any changes in mood or energy?" value={data[name].walk} onChange={e=>setField([name,"walk"], e.target.value)} />
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1>Welcome to Week 19!</h1>
      <p>Maintain momentum while preventing burnout by pacing yourself and prioritizing well-being.</p>

      <h2>Weekly Check-in</h2>
      <label>How was your week overall, and how did your at-home activities go?</label>
      <textarea
        style={taLong}
        placeholder="Share your experience..."
        value={data.weeklyExperience}
        onChange={e=>setField(["weeklyExperience"], e.target.value)}
      />

      <label>How are your energy levels and motivation in pursuit of your goals?</label>
      <textarea
        style={taLong}
        placeholder="Reflect on your energy and motivation..."
        value={data.energyMotivation}
        onChange={e=>setField(["energyMotivation"], e.target.value)}
      />

      <h2>Recognizing Signs of Burnout</h2>
      <textarea
        style={taLong}
        placeholder="Any signs like fatigue, cynicism, low accomplishment, trouble focusing, irritability, or neglecting self-care?"
        value={data.burnoutSigns}
        onChange={e=>setField(["burnoutSigns"], e.target.value)}
      />

      <h2>Strategies for Maintaining Momentum</h2>
      <textarea
        style={taLong}
        placeholder="List specific steps this week (pacing, self-care blocks, support/delegation, review/adjust, celebrate small wins)…"
        value={data.selfCareStrategy}
        onChange={e=>setField(["selfCareStrategy"], e.target.value)}
      />

      <h2>At-Home Activity</h2>
      <p>Prioritize at least one self-care activity daily and take a 30-minute walk; reflect below.</p>

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
const input = { width: "100%", marginTop: 6, marginBottom: 6, padding: 8 };
const card = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, marginBottom: 12, background: "#fff" };

