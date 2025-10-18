import React, { useEffect, useState } from "react";

export default function Week1() {
  const STORAGE_KEY = "week1-notes";

  const [data, setData] = useState({
    story: "",
    present: "",
    sunday: { am: "", noon: "", pm: "" },
    monday: { am: "", noon: "", pm: "" },
    tuesday: { am: "", noon: "", pm: "" },
    wednesday: { am: "", noon: "", pm: "" },
    thursday: { am: "", noon: "", pm: "" },
    friday: { am: "", noon: "", pm: "" },
    saturday: { am: "", noon: "", pm: "" },
  });

  // Load saved notes
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

  const Day = ({ name }) => (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, marginBottom: 12, background: "#fff" }}>
      <h3>{name[0].toUpperCase() + name.slice(1)}</h3>
      <label>Morning:</label>
      <textarea
        placeholder="I feel..."
        value={data[name].am}
        onChange={e => setField([name, "am"], e.target.value)}
        style={{ width: "100%", minHeight: 60, marginBottom: 8 }}
      />
      <label>Midday:</label>
      <textarea
        placeholder="I feel..."
        value={data[name].noon}
        onChange={e => setField([name, "noon"], e.target.value)}
        style={{ width: "100%", minHeight: 60, marginBottom: 8 }}
      />
      <label>Evening:</label>
      <textarea
        placeholder="I feel..."
        value={data[name].pm}
        onChange={e => setField([name, "pm"], e.target.value)}
        style={{ width: "100%", minHeight: 60 }}
      />
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1>Welcome to Week 1!</h1>
      <p>The journey to <strong>clarity, alignment, goal setting, and achievement</strong> begins here.</p>

      <h2>Your Past & Present</h2>
      <label>Share your story...</label>
      <textarea
        placeholder="What has your life been like up until now? Key moments?"
        value={data.story}
        onChange={e => setField(["story"], e.target.value)}
        style={{ width: "100%", minHeight: 100, marginBottom: 12 }}
      />
      <label>Reflect on your present...</label>
      <textarea
        placeholder="Describe your current life. What brings joy? What feels out of alignment?"
        value={data.present}
        onChange={e => setField(["present"], e.target.value)}
        style={{ width: "100%", minHeight: 100, marginBottom: 24 }}
      />

      <h2>Week 1 Exercise: Journaling</h2>
      {["sunday","monday","tuesday","wednesday","thursday","friday","saturday"].map(d => (
        <Day key={d} name={d} />
      ))}
      <p style={{ fontSize: 12, color: "#6b7280" }}>Notes autosave locally on your device.</p>
    </div>
  );
}

