import React, { useEffect, useState } from "react";

/**
 * Week 11 — Action Planning
 * - Autosaves to localStorage (key: "week11-notes")
 * - Weekly check-in + Action Plan builder
 * - Daily journaling + gratitude + visualization + affirmations
 */

export default function Week11() {
  const STORAGE_KEY = "week11-notes";

  const [data, setData] = useState({
    weeklyExperience: "",
    goalsFeeling: "",
    // Action Planning
    smartGoal: "",
    steps: "",
    resources: "",
    obstacles: "",
    timeBlocks: "",
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
      <h1>Welcome to Week 11!</h1>
      <p>Create a clear <strong>Action Plan</strong> for your SMART goals.</p>

      <h2>Weekly Check-in</h2>
      <label>How was your week overall? How did you feel about finalizing your SMART goals?</label>
      <textarea
        style={taLong}
        placeholder="Share your experience..."
        value={data.weeklyExperience}
        onChange={e=>setField(["weeklyExperience"], e.target.value)}
      />

      <label>How do your SMART goals feel now that they are clearly defined?</label>
      <textarea
        style={taLong}
        placeholder="Reflect on your new goals..."
        value={data.goalsFeeling}
        onChange={e=>setField(["goalsFeeling"], e.target.value)}
      />

      <h2>Action Planning</h2>
      <label>SMART Goal</label>
      <textarea
        style={taLong}
        placeholder="e.g., I will increase my public speaking skills by taking an online course and giving one presentation at a local meetup by the end of the quarter."
        value={data.smartGoal}
        onChange={e=>setField(["smartGoal"], e.target.value)}
      />

      <label>Action Plan Steps</label>
      <textarea
        style={taLong}
        placeholder={"e.g.,\n1) Research and select an online course by next Friday.\n2) Block out two hours a week in my calendar.\n3) Identify three local meetups I could speak at..."}
        value={data.steps}
        onChange={e=>setField(["steps"], e.target.value)}
      />

      <label>Resources & Support Needed</label>
      <textarea
        style={taLong}
        placeholder="People, tools, information, budget, time…"
        value={data.resources}
        onChange={e=>setField(["resources"], e.target.value)}
      />

      <label>Potential Obstacles & Contingencies</label>
      <textarea
        style={taLong}
        placeholder="What might get in the way, and what will you do instead?"
        value={data.obstacles}
        onChange={e=>setField(["obstacles"], e.target.value)}
      />

      <label>Time Blocking (When will you do the work?)</label>
      <textarea
        style={taLong}
        placeholder="Days/times you’ll reserve for these steps."
        value={data.timeBlocks}
        onChange={e=>setField(["timeBlocks"], e.target.value)}
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
