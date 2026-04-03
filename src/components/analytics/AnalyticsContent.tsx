"use client";

const weekData = [
  { day: "Mon", tasks: 6, habits: 4, focus: 3.5 },
  { day: "Tue", tasks: 8, habits: 5, focus: 5.0 },
  { day: "Wed", tasks: 5, habits: 3, focus: 2.5 },
  { day: "Thu", tasks: 9, habits: 6, focus: 6.5 },
  { day: "Fri", tasks: 12, habits: 7, focus: 7.0 },
  { day: "Sat", tasks: 4, habits: 4, focus: 2.0 },
  { day: "Sun", tasks: 3, habits: 2, focus: 1.5 },
];

const statCards = [
  { label: "Tasks Completed", val: "248", sub: "+18% vs last month", up: true },
  { label: "Habit Consistency", val: "94%", sub: "+2.4% vs last week", up: true },
  { label: "Focus Hours", val: "62h", sub: "-4% vs last month", up: false },
  { label: "Goals Active", val: "5", sub: "2 near deadline", up: null },
];

const topHabits = [
  { name: "Hydrate", pct: 97, color: "#4a90d9" },
  { name: "Meditation", pct: 88, color: "#9d7af0" },
  { name: "Reading", pct: 75, color: "#d4a24a" },
  { name: "Exercise", pct: 62, color: "#4caf7d" },
];

const goalProgress = [
  { name: "Launch SaaS", pct: 82, color: "#7c6af0" },
  { name: "Master Spanish", pct: 64, color: "#4a90d9" },
  { name: "Marathon 2024", pct: 38, color: "#d4a24a" },
  { name: "Financial Freedom", pct: 15, color: "#4caf7d" },
];

function BarChart() {
  const maxTasks = Math.max(...weekData.map((d) => d.tasks));
  return (
    <div>
      <div className="flex items-end gap-3" style={{ height: "120px" }}>
        {weekData.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col gap-0.5 justify-end" style={{ height: "100px" }}>
              <div className="w-full rounded-sm" style={{ height: `${(d.focus / 7) * 80}%`, background: "#1e1e3a", borderRadius: "3px 3px 2px 2px", minHeight: "3px" }} />
              <div className="w-full rounded-sm" style={{ height: `${(d.tasks / maxTasks) * 60}%`, background: "linear-gradient(180deg,#9d8ff5,#7c6af0)", borderRadius: "3px 3px 2px 2px", minHeight: "4px" }} />
            </div>
            <span style={{ fontSize: "9px", color: "#3a3a3a", letterSpacing: "0.06em" }}>{d.day}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3">
        {[
          { color: "#7c6af0", label: "Tasks" },
          { color: "#1e1e3a", label: "Focus Hours" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="rounded-sm" style={{ width: "10px", height: "10px", backgroundColor: color }} />
            <span style={{ fontSize: "10px", color: "#555" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendLine({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const norm = (v: number) => ((v - min) / (max - min || 1)) * 40 + 5;
  const w = 120;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${50 - norm(v)}`).join(" ");
  return (
    <svg width={w} height="55" viewBox={`0 0 ${w} 55`} fill="none">
      <polyline points={points} stroke="#7c6af0" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <polyline points={`0,55 ${points} ${w},55`} stroke="none" fill="rgba(124,106,240,0.08)" />
    </svg>
  );
}

export default function AnalyticsContent() {
  return (
    <main className="flex-1 overflow-y-auto" style={{ padding: "28px 32px", backgroundColor: "#0a0a0a" }}>
      {/* Stat cards */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl p-5" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
            <p style={{ fontSize: "11px", color: "#555", marginBottom: "8px" }}>{s.label}</p>
            <p className="font-black text-white" style={{ fontSize: "28px", letterSpacing: "-0.025em", lineHeight: 1 }}>{s.val}</p>
            <div className="flex items-center gap-1.5 mt-2">
              {s.up !== null && (
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  {s.up ? (
                    <path d="M1 8l3-3 2 2 4-5" stroke="#4caf7d" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <path d="M1 3l3 3 2-2 4 5" stroke="#e85555" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  )}
                </svg>
              )}
              <span style={{ fontSize: "11px", color: s.up === true ? "#4caf7d" : s.up === false ? "#e85555" : "#555" }}>{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main chart + breakdowns */}
      <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Activity Chart */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-white" style={{ fontSize: "14px" }}>Weekly Activity</h3>
              <p style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>Tasks completed & focus hours</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ backgroundColor: "rgba(74,207,125,0.1)", border: "1px solid rgba(74,207,125,0.2)" }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 7l2.5-2.5 2 2L9 1" stroke="#4caf7d" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontSize: "10px", color: "#4caf7d", fontWeight: 500 }}>+18% week</span>
            </div>
          </div>
          <BarChart />
        </div>

        {/* Productivity Score trend */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
          <h3 className="font-semibold text-white mb-1" style={{ fontSize: "14px" }}>Productivity Score</h3>
          <p style={{ fontSize: "11px", color: "#555", marginBottom: "16px" }}>30-day efficiency trend</p>
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="font-black text-white" style={{ fontSize: "36px", letterSpacing: "-0.03em", lineHeight: 1 }}>85</p>
              <p style={{ fontSize: "11px", color: "#7c6af0", marginTop: "4px" }}>+12% from last month</p>
            </div>
            <TrendLine data={[60, 65, 58, 70, 74, 71, 78, 80, 76, 82, 85, 83, 85]} />
          </div>
          <div className="mt-4 space-y-2.5">
            {[
              { label: "Deep Work Sessions", val: "22", max: 30 },
              { label: "Avg Daily Score", val: "78", max: 100 },
            ].map(({ label, val, max }) => (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <span style={{ fontSize: "11px", color: "#555" }}>{label}</span>
                  <span style={{ fontSize: "11px", color: "#888" }}>{val}/{max}</span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: "3px", backgroundColor: "#1a1a1a" }}>
                  <div className="h-full rounded-full" style={{ width: `${(+val / max) * 100}%`, background: "linear-gradient(90deg,#5a4fd4,#7c6af0)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Habit breakdown + Goal breakdown + Insights */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
        {/* Top habits */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
          <h3 className="font-semibold text-white mb-4" style={{ fontSize: "14px" }}>Top Habits</h3>
          <div className="space-y-3">
            {topHabits.map((h) => (
              <div key={h.name}>
                <div className="flex justify-between mb-1.5">
                  <span style={{ fontSize: "12px", color: "#ccc" }}>{h.name}</span>
                  <span style={{ fontSize: "11px", color: "#666" }}>{h.pct}%</span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: "3px", backgroundColor: "#1a1a1a" }}>
                  <div className="h-full rounded-full" style={{ width: `${h.pct}%`, backgroundColor: h.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goal progress */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
          <h3 className="font-semibold text-white mb-4" style={{ fontSize: "14px" }}>Goal Progress</h3>
          <div className="space-y-3">
            {goalProgress.map((g) => (
              <div key={g.name}>
                <div className="flex justify-between mb-1.5">
                  <span style={{ fontSize: "12px", color: "#ccc" }}>{g.name}</span>
                  <span style={{ fontSize: "11px", color: "#666" }}>{g.pct}%</span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: "3px", backgroundColor: "#1a1a1a" }}>
                  <div className="h-full rounded-full" style={{ width: `${g.pct}%`, backgroundColor: g.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center rounded-lg" style={{ width: "26px", height: "26px", background: "rgba(124,106,240,0.15)", border: "1px solid rgba(124,106,240,0.2)" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1.5l1.1 3.3L11 6l-3.9 1.2L6 10.5l-1.1-3.3L1 6l3.9-1.2L6 1.5z" stroke="#7c6af0" strokeWidth="1" strokeLinejoin="round" /></svg>
            </div>
            <h3 className="font-semibold text-white" style={{ fontSize: "14px" }}>AI Insights</h3>
          </div>
          <div className="space-y-3">
            {[
              { text: "You're 14% more productive in morning sessions. Schedule deep work before noon.", icon: "🌅" },
              { text: "Habit streaks peak on Tuesdays — consider scheduling harder tasks mid-week.", icon: "📈" },
              { text: "Launch SaaS is 3 days ahead of schedule. Maintain current velocity.", icon: "🚀" },
            ].map((insight, i) => (
              <div key={i} className="flex gap-2.5 rounded-xl p-3" style={{ backgroundColor: "#161616", border: "1px solid #1e1e1e" }}>
                <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>{insight.icon}</span>
                <p style={{ fontSize: "11px", color: "#888", lineHeight: 1.5 }}>{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
