import React, { useEffect, useState } from "react";

/**
 * Week 21 — Review the Journey & Solidify Learnings
 * - Autosaves to localStorage (key: "week21-notes")
 * - Weekly check-in + resilience reflection
 * - Starting-point reflections + mapping the journey + solidifying key learnings
 * - Daily journaling + gratitude + visualization + affirmations + 30-min walk reflection
 */

export default function Week21() {
  const STORAGE_KEY = "week21-notes";

  const [data, setData] = useState({
    // Weekly check-in
    weeklyExperience: "",
    resilienceExperience: "",
    // Reflecting on the starting point
    initialGoals: "",
    initialChallenges: "",
    initialAlignmentClarity: "",
    // Mapping the journey
    keyInsightsValuesAlignment: "",
    visionImpact: "",
    goalSettingTakeaways: "",
    habitInfluence: "",
    bigChallengesLessons: "",
    // Solidifying learnings
    mostImportantLessons: "",
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
      <h1>Welcome to Week 21!</h1>
      <p>Review your journey, highlight insights, and solidify what you’ve learned.</p>

      <h2>Weekly Check-in</h2>
      <label>How was your week overall, and how did your at-home activities go?</label>
      <textarea
        style={taLong}
        placeholder="Share your experience..."
        value={data.weeklyExperience}
        onChange={e=>setField(["weeklyExperience"], e.target.value)}
      />

      <label>How did it feel to consciously apply your resilience and adaptability strategies?</label>
      <textarea
        style={taLong}
        placeholder="Reflect on your experience..."
        value={data.resilienceExperience}
        onChange={e=>setField(["resilienceExperience"], e.target.value)}
      />

      <h2>Reflecting on the Starting Point</h2>
      <label>What were your initial goals and aspirations?</label>
      <textarea
        style={taLong}
        placeholder="Recall your early aspirations..."
        value={data.initialGoals}
        onChange={e=>setField(["initialGoals"], e.target.value)}
      />
      <label>What were some of the key challenges you were facing at that time?</label>
      <textarea
        style={taLong}
        placeholder="Remember your initial hurdles..."
        value={data.initialChallenges}
        onChange={e=>setField(["initialChallenges"], e.target.value)}
      />
      <label>How were you feeling about your level of alignment and clarity?</label>
      <textarea
        style={taLong}
        placeholder="Recall your feelings at the start..."
        value={data.initialAlignmentClarity}
        onChange={e=>setField(["initialAlignmentClarity"], e.target.value)}
      />

      <h2>Mapping the Journey</h2>
      <label>Key insights from alignment and identifying core values:</label>
      <textarea
        style={taLong}
        placeholder="Reflect on your key insights..."
        value={data.keyInsightsValuesAlignment}
        onChange={e=>setField(["keyInsightsValuesAlignment"], e.target.value)}
      />
      <label>Impact of gaining clarity and defining your vision:</label>
      <textarea
        style={taLong}
        placeholder="Describe the impact of your vision..."
        value={data.visionImpact}
        onChange={e=>setField(["visionImpact"], e.target.value)}
      />
      <label>Takeaways from goal setting and action planning:</label>
      <textarea
        style={taLong}
        placeholder="Share your takeaways on goals..."
        value={data.goalSettingTakeaways}
        onChange={e=>setField(["goalSettingTakeaways"], e.target.value)}
      />
      <label>How journaling, gratitude, visualization, and affirmations influenced your mindset:</label>
      <textarea
        style={taLong}
        placeholder="Reflect on your habits..."
        value={data.habitInfluence}
        onChange={e=>setField(["habitInfluence"], e.target.value)}
      />
      <label>Biggest challenges you overcame and lessons learned:</label>
      <textarea
        style={taLong}
        placeholder="Describe challenges and lessons learned..."
        value={data.bigChallengesLessons}
        onChange={e=>setField(["bigChallengesLessons"], e.target.value)}
      />

      <h2>Solidifying Key Learnings</h2>
      <textarea
        style={taLong}
        placeholder="What are the most important lessons about yourself, your values, your goals, and transformation?"
        value={data.mostImportantLessons}
        onChange={e=>setField(["mostImportantLessons"], e.target.value)}
      />

      <h2>At-Home Activity</h2>
      <p>Continue daily practices and your 30-minute walk; reflect below.</p>

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
