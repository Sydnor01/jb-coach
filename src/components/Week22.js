import React, { useEffect, useState } from "react";

/**
 * Week 22 — Self-Reliance & Strategies for Continued Growth
 * - Autosaves to localStorage (key: "week22-notes")
 * - Weekly check-in + new challenges
 * - Identifying internal resources (strengths, skills/tools, motivation, self-awareness)
 * - Strategies for continued growth
 * - Daily journaling + gratitude + visualization + affirmations + 30-min walk reflection
 */

export default function Week22() {
  const STORAGE_KEY = "week22-notes";

  const [data, setData] = useState({
    // Weekly check-in
    weeklyExperience: "",
    newChanges: "",

    // Identifying internal resources
    strengths: "",
    skillsTools: "",
    motivationSources: "",
    selfAwarenessGrowth: "",

    // Strategies for continued growth
    goalSettingReview: "",
    selfReflectionHabits: "",
    ongoingLearning: "",
    supportiveNetwork: "",
    experimentationMindset: "",

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
      <h1>Welcome to Week 22!</h1>
      <p>Build self-reliance and lock in strategies for continued growth.</p>

      <h2>Weekly Check-in</h2>
      <label>How was your week, and how did your at-home activities go?</label>
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

      <h2>Identifying Your Internal Resources</h2>
      <label>Key strengths you’ve discovered or developed:</label>
      <textarea
        style={taLong}
        placeholder="e.g., resilience, self-compassion, focus, persistence…"
        value={data.strengths}
        onChange={e=>setField(["strengths"], e.target.value)}
      />
      <label>Skills or tools you now feel confident using:</label>
      <textarea
        style={taLong}
        placeholder="e.g., reframing, limiting-belief work, SMART goals, affirmations…"
        value={data.skillsTools}
        onChange={e=>setField(["skillsTools"], e.target.value)}
      />
      <label>Internal sources of motivation and resilience to draw upon:</label>
      <textarea
        style={taLong}
        placeholder="e.g., values-aligned vision, support system, purpose statements…"
        value={data.motivationSources}
        onChange={e=>setField(["motivationSources"], e.target.value)}
      />
      <label>How your self-awareness has grown (and how you’ll use it):</label>
      <textarea
        style={taLong}
        placeholder="e.g., early signs of overwhelm → take a walk, breathe, re-plan…"
        value={data.selfAwarenessGrowth}
        onChange={e=>setField(["selfAwarenessGrowth"], e.target.value)}
      />

      <h2>Strategies for Continued Growth</h2>
      <label>Goal Setting & Review</label>
      <textarea
        style={taLong}
        placeholder="Cadence for setting/reviewing SMART goals (weekly/monthly)…"
        value={data.goalSettingReview}
        onChange={e=>setField(["goalSettingReview"], e.target.value)}
      />
      <label>Self-Reflection Practices</label>
      <textarea
        style={taLong}
        placeholder="Journaling, gratitude, visualization, affirmations—your plan to maintain them…"
        value={data.selfReflectionHabits}
        onChange={e=>setField(["selfReflectionHabits"], e.target.value)}
      />
      <label>Ongoing Learning</label>
      <textarea
        style={taLong}
        placeholder="Books, courses, mentors—what will you explore next?"
        value={data.ongoingLearning}
        onChange={e=>setField(["ongoingLearning"], e.target.value)}
      />
      <label>Supportive Network</label>
      <textarea
        style={taLong}
        placeholder="People/communities that align with your values and goals…"
        value={data.supportiveNetwork}
        onChange={e=>setField(["supportiveNetwork"], e.target.value)}
      />
      <label>Experimentation & Growth Mindset</label>
      <textarea
        style={taLong}
        placeholder="Ways you’ll try new things and treat setbacks as learning…"
        value={data.experimentationMindset}
        onChange={e=>setField(["experimentationMindset"], e.target.value)}
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

