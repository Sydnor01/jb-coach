import React, { useEffect, useState } from "react";

/**
 * Week 20 — Resilience & Adaptability
 * - Autosaves to localStorage (key: "week20-notes")
 * - Weekly check-in + unexpected changes + resilience/adaptability strategies
 * - Challenge & resilience reflection
 * - Daily journaling + gratitude + visualization + affirmations + 30-min walk reflection
 */

export default function Week20() {
  const STORAGE_KEY = "week20-notes";

  const [data, setData] = useState({
    // Weekly check-in
    weeklyExperience: "",
    newChanges: "",
    // Strategies section
    supportSystem: "",
    selfCompassion: "",
    focusControl: "",
    lessonsFromSetbacks: "",
    perspective: "",
    growthMindset: "",
    newIdeasFlexibility: "",
    // Challenge reflection
    challengeSituation: "",
    strategiesApplied: "",
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
      <h1>Welcome to Week 20!</h1>
      <p>Reinforce resilience and adaptability to navigate change with confidence.</p>

      <h2>Weekly Check-in</h2>
      <label>How was your week overall? How did your at-home activities go?</label>
      <textarea
        style={taLong}
        placeholder="Share your experience..."
        value={data.weeklyExperience}
        onChange={e=>setField(["weeklyExperience"], e.target.value)}
      />

      <label>Have any unexpected changes or challenges arisen this week?</label>
      <textarea
        style={taLong}
        placeholder="Reflect on any new challenges or changes..."
        value={data.newChanges}
        onChange={e=>setField(["newChanges"], e.target.value)}
      />

      <h2>Strategies for Resilience & Adaptability</h2>
      <label>Develop a Strong Support System</label>
      <textarea
        style={taLong}
        placeholder="Who can you rely on? How will you lean on them this week?"
        value={data.supportSystem}
        onChange={e=>setField(["supportSystem"], e.target.value)}
      />

      <label>Practice Self-Compassion</label>
      <textarea
        style={taLong}
        placeholder="What would kindness to yourself look like right now?"
        value={data.selfCompassion}
        onChange={e=>setField(["selfCompassion"], e.target.value)}
      />

      <label>Focus on What You Can Control</label>
      <textarea
        style={taLong}
        placeholder="List controllables (habits, schedule, communication, boundaries)…"
        value={data.focusControl}
        onChange={e=>setField(["focusControl"], e.target.value)}
      />

      <label>Learn from Setbacks</label>
      <textarea
        style={taLong}
        placeholder="What are the lessons or adjustments you can extract?"
        value={data.lessonsFromSetbacks}
        onChange={e=>setField(["lessonsFromSetbacks"], e.target.value)}
      />

      <label>Maintain Perspective</label>
      <textarea
        style={taLong}
        placeholder="How does this fit into your larger journey and vision?"
        value={data.perspective}
        onChange={e=>setField(["perspective"], e.target.value)}
      />

      <label>Embrace a Growth Mindset</label>
      <textarea
        style={taLong}
        placeholder="Where can effort, learning, and iteration move you forward?"
        value={data.growthMindset}
        onChange={e=>setField(["growthMindset"], e.target.value)}
      />

      <label>Be Open to New Ideas & Practice Flexibility</label>
      <textarea
        style={taLong}
        placeholder="Which plans can bend? Any new approaches to try?"
        value={data.newIdeasFlexibility}
        onChange={e=>setField(["newIdeasFlexibility"], e.target.value)}
      />

      <h2>Challenge & Resilience Reflection</h2>
      <label>Describe a situation this week where you needed to be resilient or adaptable.</label>
      <textarea
        style={taLong}
        placeholder="Describe the situation…"
        value={data.challengeSituation}
        onChange={e=>setField(["challengeSituation"], e.target.value)}
      />

      <label>Which one or two strategies above did you apply? How did it help?</label>
      <textarea
        style={taLong}
        placeholder="Write how you navigated it and what you learned…"
        value={data.strategiesApplied}
        onChange={e=>setField(["strategiesApplied"], e.target.value)}
      />

      <h2>At-Home Activity</h2>
      <p>Continue daily practices and note moments requiring resilience or adaptability.</p>

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
