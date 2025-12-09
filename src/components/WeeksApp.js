import React, { useState, Suspense } from "react";
import LogoutButton from "./LogoutButton";
/**
 * Dynamic Weeks loader
 * - Lazily imports ./Week1.js … ./Week24.js on demand.
 * - If a week file is missing or has an error, shows a friendly placeholder.
 * - Works great once your WeekN files exist and default-export a component.
 */

const WEEK_COUNT = 24;

// Create a lazy component per week number
const PAGES = {};
for (let n = 1; n <= WEEK_COUNT; n++) {
  // Webpack will code-split these automatically
  PAGES[n] = React.lazy(() => import(`./Week${n}.js`));
}

// Simple error boundary to catch missing week files / render errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // Optional: log error somewhere
    // console.error("Week load error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={box}>
          <h3 style={{ marginTop: 0 }}>Couldn’t load this week</h3>
          <p style={{ margin: 0 }}>
            The component for this week wasn’t found or failed to load.
            Make sure <code>src/components/WeekX.js</code> exists and default-exports a React component.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function WeeksApp() {
  const [week, setWeek] = useState(1);
  const Selected = PAGES[week];

  return (
    <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12, background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <LogoutButton />
<strong>Jump to week:</strong>
        <select
          value={week}
          onChange={(e) => setWeek(parseInt(e.target.value, 10))}
          style={sel}
        >
        
  {Array.from({ length: WEEK_COUNT }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              Week {n}
            </option>
          ))}
        </select>
      </div>

      <Suspense fallback={<div style={box}>Loading Week {week}…</div>}>
        <ErrorBoundary>
          <Selected />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

const sel = {
  padding: "8px 10px",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
};

const box = {
  border: "1px dashed #cbd5e1",
  padding: 16,
  borderRadius: 12,
  background: "#f8fafc",
};
