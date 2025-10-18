import React, { useEffect, useState } from "react";

/**
 * Week 24 — Celebration, Empowerment & Looking Ahead
 * - Autosaves to localStorage (key: "week24-notes")
 * - Weekly check-in
 * - Acknowledging & celebrating achievements
 * - Transformations, insights, tools you applied, values-aligned changes
 * - Looking ahead: intentions, prioritizing values, accountability
 * - Daily journaling + gratitude + visualization + affirmations + 30-min walk reflection
 */

export default function Week24() {
  const STORAGE_KEY = "week24-notes";

  const [data, setData] = useState({
    // Weekly check-in
    weeklyExperience: "",

    // Celebrations & reflections
    proudAchievements: "",
    mindsetShifts: "",
    insightsAlignmentClarityGoals: "",
    toolsAppliedExamples: "",
    valuesAlignedChanges: "",

    // Looking ahead
    immediateIntentions: "",
    prioritizeValuesPlan: "",
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
      <h1>Welcome to Week 24!</h1>
      <p><strong>Congratulations!</strong> Celebrate your journey and set clear intentions for what comes next.</p>

      <h2>Weekly Check-in</h2>
      <label>How was your final week in the program? How did your at-home activities go?</label>
      <textarea
        style={taLong}
        placeholder="Share your experience..."
        value={data.weeklyExperience}
        onChange={e=>setField(["weeklyExperience"], e.target.value)}
      />

      <h2>Acknowledging & Celebrating Achievements</h2>
      <label>Looking back over the past six months, what are you most proud of accomplishing?</label>
      <textarea
        style={taLong}
        placeholder="Reflect on your achievements..."
        value={data.proudAchievements}
        onChange={e=>setField(["proudAchievements"], e.target.value)}
      />
      <label>What shifts have you noticed in mindset, behaviors, or overall well-being?</label>
      <textarea
        style={taLong}
        placeholder="Describe your transformations..."
        value={data.mindsetShifts}
        onChange={e=>setField(["mindsetShifts"], e.target.value)}
      />
      <label>How have you grown in alignment, clarity, goal setting, and achievement?</label>
      <textarea
        style={taLong}
        placeholder="Share your insights..."
        value={data.insightsAlignmentClarityGoals}
        onChange={e=>setField(["insightsAlignmentClarityGoals"], e.target.value)}
      />
      <label>Specific examples of tools/strategies you successfully applied:</label>
      <textarea
        style={taLong}
        placeholder="Give examples of your progress..."
        value={data.toolsAppliedExamples}
        onChange={e=>setField(["toolsAppliedExamples"], e.target.value)}
      />
      <label>How has your life changed to better align with your core values and vision?</label>
      <textarea
        style={taLong}
        placeholder="Describe the positive changes..."
        value={data.valuesAlignedChanges}
        onChange={e=>setField(["valuesAlignedChanges"], e.target.value)}
      />

      <h2>Looking Ahead with Intention</h2>
      <label>Your immediate intentions for continuing to move toward your vision:</label>
      <textarea
        style={taLong}
        placeholder="Describe your intentions..."
        value={data.immediateIntentions}
        onChange={e=>setField(["immediateIntentions"], e.target.value)}
      />
      <label>How you will continue to prioritize your core values day-to-day:</label>
      <textarea
        style={taLong}
        placeholder="Explain your plan..."
        value={data.prioritizeValuesPlan}
        onChange={e=>setField(["prioritizeValuesPlan"], e.target.value)}
      />
      <label>Self-accountability structures you’ll put in place:</label>
      <textarea
        style={taLong}
        placeholder="Describe your accountability plan..."
        value={data.accountabilityPlan}
        onChange={e=>setField(["accountabilityPlan"], e.target.value)}
      />

      <h2>At-Home Activity</h2>
      <p>Continue all of your daily practices and your 30-minute walk; reflect below.</p>

      <Day name="sunday" title="Sunday" />
      <Day name="monday" title="Monday" />
      <Day name="tuesday" title="Tuesday" />
      <Day name="wednesday" title="Wednesday" />
      <Day name="thursday" title="Thursday" />
      <Day name="friday" title="Friday" />
      <Day name="saturday" title="Saturday" />

      <p style={{ fontSize: 12, color: "#6b7280" }}>
        Notes autosave locally on your device. “I know that you will have continued success. I am available if you need
        to reach out as you continue your journey.”
      </p>
    </div>
  );
}

const ta = { width: "100%", minHeight: 60, marginBottom: 8 };
const taLong = { width: "100%", minHeight: 110, marginBottom: 16 };
const input = { width: "100%", marginTop: 6, marginBottom: 6, padding: 8 };
const card = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, marginBottom: 12, background: "#fff" };
