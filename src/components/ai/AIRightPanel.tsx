"use client";

const focusItems = [
  { label: "Deep Work: Q3 Vision", time: "10:00 AM – 1:00 PM", accent: true },
  { label: "Marketing Sync", time: "2:30 PM – 3:15 PM", accent: false },
];

export default function AIRightPanel() {
  return (
    <aside
      className="flex flex-col flex-shrink-0 overflow-y-auto"
      style={{ width: "240px", backgroundColor: "#0c0c0c", padding: "24px 16px" }}
    >
      {/* Today's Focus */}
      <div className="mb-6">
        <p className="uppercase tracking-widest mb-4" style={{ fontSize: "9px", color: "#3a3a3a", letterSpacing: "0.14em" }}>
          Today&apos;s Focus
        </p>
        <div className="space-y-3">
          {focusItems.map((item) => (
            <div
              key={item.label}
              className="px-3 py-3 rounded-xl"
              style={{
                backgroundColor: "#111",
                border: "1px solid #1a1a1a",
                borderLeft: item.accent ? "3px solid #7c6af0" : "3px solid #2a2a2a",
              }}
            >
              <p className="font-semibold text-white" style={{ fontSize: "13px" }}>{item.label}</p>
              <p style={{ fontSize: "11px", color: "#555", marginTop: "3px" }}>{item.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Intelligence Insights visual */}
      <div className="rounded-xl overflow-hidden mb-6" style={{ border: "1px solid #1a1a1a" }}>
        {/* Abstract visual placeholder */}
        <div
          className="flex items-center justify-center"
          style={{ height: "100px", background: "linear-gradient(135deg,#0a0a18,#12102a)", position: "relative" }}
        >
          {/* Neural network SVG decoration */}
          <svg width="160" height="80" viewBox="0 0 160 80" fill="none" className="opacity-60">
            {/* Lines */}
            {[[20,40,80,20],[20,40,80,40],[20,40,80,60],[80,20,140,40],[80,40,140,40],[80,60,140,40]].map(([x1,y1,x2,y2],i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3a2faa" strokeWidth="0.8" />
            ))}
            {/* Nodes */}
            {[[20,40],[80,20],[80,40],[80,60],[140,40]].map(([cx,cy],i) => (
              <circle key={i} cx={cx} cy={cy} r={i===4?6:3.5} fill={i===4?"#7c6af0":"#4a3faa"} opacity={i===4?1:0.8} />
            ))}
          </svg>
        </div>
        <div className="px-4 py-3" style={{ backgroundColor: "#111" }}>
          <p className="font-semibold text-white" style={{ fontSize: "13px" }}>Intelligence Insights</p>
          <p style={{ fontSize: "11px", color: "#555", marginTop: "4px", lineHeight: 1.5 }}>
            Your productivity is 14% higher during morning sessions this month.
          </p>
        </div>
      </div>

      {/* System Load */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-2">
          <p className="uppercase tracking-widest" style={{ fontSize: "9px", color: "#3a3a3a", letterSpacing: "0.14em" }}>System Load</p>
          <span style={{ fontSize: "10px", color: "#7c6af0", fontWeight: 500 }}>Optimal</span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: "3px", backgroundColor: "#1a1a1a" }}>
          <div className="h-full rounded-full" style={{ width: "38%", background: "linear-gradient(90deg,#5a4fd4,#7c6af0)" }} />
        </div>
      </div>
    </aside>
  );
}
