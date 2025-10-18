import React, { useEffect, useState } from "react";

/**
 * Week 18 — Limiting Beliefs → Challenge & Reframe
 * - Autosaves to localStorage (key: "week18-notes")
 * - Weekly check-in + walking reflection
 * - Identify limiting beliefs, gather evidence, alternative views, past wins, and affirm strengths
 * - Daily journaling + gratitude + visualization + affirmations + 30-min walk reflection
 */

export default function Week18() {
  const STORAGE_KEY = "week18-notes";

  const [data, setData] = useState({
    // Weekly check-in
    weeklyExperience: "",
    walkingRoutine: "",
    // Limiting beliefs work
    limitingBeliefsList: "",
    evidenceAgainst: "",
    alternativeInterpretations: "",
    pastSuccesses: "",
    strengthsAffirmed: "",
    // Daily blocks
    sunday:     { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", walk:"" },
    monday:     { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", walk:"" },
    tuesday:    { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", walk:"" },
    wednesday:  { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", walk:"" },
    thursday:   { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", walk:"" },
    friday:     { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", walk:"" },
    saturday:   { am:"", noon:"", pm:"", g1:"", g2:"", g3:"", viz:"", aff:"", walk:"" },
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
      <h1>Welcome to Week 18!</h1>
      <p>Reinforce self-belief by identifying, challenging, and reframing limiting beliefs.</p>

      <h2>Weekly Check-in</h2>
      <label>How was your week overall, and how did your at-home activities go?</label>
      <textarea
        style={taLong}
        placeholder="Share your experience..."
        value={data.weeklyExperience}
        onChange={e=>setField(["weeklyExperience"], e.target.value)}
      />

      <label>Were you able to take a 30-minute walk each day? How did you feel afterward?</label>
      <textarea
        style={taLong}
        placeholder="Reflect on your walking routine..."
        value={data.walkingRoutine}
        onChange={e=>setField(["walkingRoutine"], e.target.value)}
      />

      <h2>Identifying & Exploring Limiting Beliefs</h2>
      <textarea
        style={taLong}
        placeholder="List doubts/negative self-talk/limiting beliefs that surfaced…"
        value={data.limitingBeliefsList}
        onChange={e=>setField(["limitingBeliefsList"], e.target.value)}
      />

      <h3>Challenge & Reframe</h3>
      <label>Identifying the Evidence (that contradicts the belief)</label>
      <textarea
        style={taLong}
        placeholder="What facts, feedback, or examples weaken this belief?"
        value={data.evidenceAgainst}
        onChange={e=>setField(["evidenceAgainst"], e.target.value)}
      />

      <label>Alternative Interpretations</label>
      <textarea
        style={taLong}
        placeholder="What are kinder, more empowering ways to see this situation?"
        value={data.alternativeInterpretations}
        onChange={e=>setField(["alternativeInterpretations"], e.target.value)}
      />

      <label>Focus on Past Successes</label>
      <textarea
        style={taLong}
        placeholder="Recall times you overcame similar challenges or achieved meaningful goals."
        value={data.pastSuccesses}
        onChange={e=>setField(["pastSuccesses"], e.target.value)}
      />

      <label>Affirm Your Strengths</label>
      <textarea
        style={taLong}
        placeholder="Write affirming statements that directly counter the negative belief."
        value={data.strengthsAffirmed}
        onChange={e=>setField(["strengthsAffirmed"], e.target.value)}
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
const input = { width: "100%", marginTop: 6, marginBottom: 6, padding: 8 };
const card = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, marginBottom: 12, background: "#fff" };
