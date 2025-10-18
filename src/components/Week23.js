import React, { useEffect, useState } from "react";

/**
 * Week 23 — Questions, Commitments & Preparing for the Ongoing Journey
 * - Autosaves to localStorage (key: "week23-notes")
 * - Weekly check-in + remaining questions
 * - Reinforcing future commitment (excitement, values, habits, vision, accountability)
 * - Daily journaling + gratitude + visualization + affirmations + 30-min walk reflection
 */

export default function Week23() {
  const STORAGE_KEY = "week23-notes";

  const [data, setData] = useState({
    // Weekly check-in
    weeklyExperience: "",
    remainingQuestions: "",

    // Reinforcing future commitment
    excitementFuture: "",
    honorValuesPlan: "",
    keyHabits: "",
    futureVision: "",
    accountabilityPlan: "",

    // Dailies
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
      <h1>Welcome to Week 23!</h1>
      <p>Address remaining questions, reinforce your commitments, and prepare for your ongoing journey.</p>

      <h2>Weekly Check-in</h2>
      <label>How was your week overall, and how did your at-home activities go?</label>
      <textarea
        style={taLong}
        placeholder="Share your experience..."
        value={data.weeklyExperience}
        onChange={e=>setField(["weeklyExperience"], e.target.value)}
      />
      <label>As the program nears its end, what remaining questions, concerns, or areas would you like to discuss?</label>
      <textarea
        style={taLong}
        placeholder="Share your thoughts or questions..."
        value={data.remainingQuestions}
        onChange={e=>setField(["remainingQuestions"], e.target.value)}
      />

      <h2>Reinforcing Future Commitment</h2>
      <label>What are you most excited about in terms of your continued progress?</label>
      <textarea
        style={taLong}
        placeholder="Describe your excitement for the future..."
        value={data.excitementFuture}
        onChange={e=>setField(["excitementFuture"], e.target.value)}
      />
      <label>How will you continue honoring your core values in daily life and decisions?</label>
      <textarea
        style={taLong}
        placeholder="Explain your plan..."
        value={data.honorValuesPlan}
        onChange={e=>setField(["honorValuesPlan"], e.target.value)}
      />
      <label>What key habits/routines will you maintain to support well-being and goals?</label>
      <textarea
        style={taLong}
        placeholder="List your key habits..."
        value={data.keyHabits}
        onChange={e=>setField(["keyHabits"], e.target.value)}
      />
      <label>Your vision for the next 6–12 months—and how you’ll move toward it:</label>
      <textarea
        style={taLong}
        placeholder="Describe your future vision..."
        value={data.futureVision}
        onChange={e=>setField(["futureVision"], e.target.value)}
      />
      <label>Self-accountability structures you’ll put in place:</label>
      <textarea
        style={taLong}
        placeholder="Describe your accountability plan..."
        value={data.accountabilityPlan}
        onChange={e=>setField(["accountabilityPlan"], e.target.value)}
      />

      <h2>At-Home Activity</h2>
      <p>Continue your daily practices and your 30-minute walk; reflect below.</p>

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
