"use client";

const ranges = ["7D", "30D", "90D", "1Y"];

export default function AnalyticsHeader() {
  return (
    <header
      className="flex items-center justify-between px-7 flex-shrink-0"
      style={{ height: "58px", borderBottom: "1px solid #161616", backgroundColor: "#0a0a0a" }}
    >
      <div className="flex items-center gap-6">
        <span className="font-bold text-white" style={{ fontSize: "15px" }}>Analytics</span>
        <nav className="flex items-center gap-1">
          {["Overview", "Productivity", "Goals", "Habits"].map((tab, i) => (
            <button key={tab} className="px-3 py-1.5 rounded-lg" style={{ fontSize: "12px", color: i === 0 ? "#f0f0f0" : "#555", backgroundColor: i === 0 ? "#1a1a1a" : "transparent" }}>
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        {ranges.map((r, i) => (
          <button key={r} className="px-3 py-1.5 rounded-lg" style={{ fontSize: "11px", color: i === 1 ? "#f0f0f0" : "#555", backgroundColor: i === 1 ? "#1e1e1e" : "transparent", border: i === 1 ? "1px solid #2a2a2a" : "none" }}>
            {r}
          </button>
        ))}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg ml-2" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#888", fontSize: "12px" }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1h10v2L7 7v4l-2-1V7L1 3V1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
          Filter
        </button>
      </div>
    </header>
  );
}
