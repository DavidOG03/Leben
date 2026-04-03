"use client";

const BoltIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M7.5 1L2 7.5h4.5L5 12l6.5-7H7L7.5 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M4 6.5l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <rect x="1" y="2" width="11" height="9.5" rx="1.3" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1 5h11M4 1v2M9 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const FocusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <circle cx="6.5" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1 1v3h3M9 1h3v3M1 9v3h3M9 12h3V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const HistoryIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M1.5 6.5A5 5 0 106.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M1.5 2v4.5H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 4v3l2 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const navItems = [
  { label: "Quick Prompt", icon: <BoltIcon />, active: true },
  { label: "Smart Tasks", icon: <CheckIcon /> },
  { label: "Calendar", icon: <CalIcon /> },
  { label: "Focus Mode", icon: <FocusIcon /> },
  { label: "History", icon: <HistoryIcon /> },
];

const prompts = [
  { title: "Plan my day", sub: "Daily focus mapping" },
  { title: "Weekly review", sub: "Metric aggregation" },
  { title: "Summarize goals", sub: "Quarterly alignment" },
  { title: "Identify focus blocks", sub: "Calendar optimization" },
];

export default function AILeftPanel() {
  return (
    <aside
      className="flex flex-col flex-shrink-0 overflow-y-auto"
      style={{ width: "250px", borderRight: "1px solid #161616", backgroundColor: "#0c0c0c", padding: "24px 0" }}
    >
      {/* AI identity */}
      <div className="flex items-center gap-3 px-5 mb-6">
        <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: "40px", height: "40px", background: "linear-gradient(135deg,#4a3fcc,#2d2480)", border: "1px solid rgba(124,106,240,0.4)" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2l2 5.5L16 9l-5 1.5L9 16l-2-5.5L2 9l5-1.5L9 2z" stroke="white" strokeWidth="1.3" strokeLinejoin="round" /></svg>
        </div>
        <div>
          <p className="font-bold text-white" style={{ fontSize: "14px", letterSpacing: "-0.01em" }}>Leben AI</p>
          <p style={{ fontSize: "11px", color: "#555" }}>Productivity Engine</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 mb-6 space-y-px">
        {navItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left"
            style={{ backgroundColor: item.active ? "#1e1e1e" : "transparent", color: item.active ? "#f0f0f0" : "#555", fontSize: "13px", fontWeight: item.active ? 500 : 400 }}
          >
            <span style={{ color: item.active ? "#7c6af0" : "#444" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Quick Prompts */}
      <div className="px-5 flex-1">
        <p className="uppercase tracking-widest mb-3" style={{ fontSize: "9px", color: "#3a3a3a", letterSpacing: "0.14em" }}>Quick Prompts</p>
        <div className="space-y-2">
          {prompts.map((p) => (
            <button
              key={p.title}
              className="w-full text-left rounded-xl px-4 py-3 transition-colors hover:border-purple-900"
              style={{ backgroundColor: "#141414", border: "1px solid #1e1e1e" }}
            >
              <p className="font-medium text-white" style={{ fontSize: "13px" }}>{p.title}</p>
              <p style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{p.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Pro upgrade */}
      <div className="mx-4 mt-5 rounded-xl p-4" style={{ backgroundColor: "#121220", border: "1px solid #252535" }}>
        <p className="font-semibold mb-1" style={{ fontSize: "11px", color: "#7c6af0", letterSpacing: "0.06em", textTransform: "uppercase" }}>Pro Upgrade</p>
        <p style={{ fontSize: "11px", color: "#666", lineHeight: 1.5, marginBottom: "12px" }}>Unlock advanced neural processing for faster insights.</p>
        <button className="w-full py-2 rounded-lg font-semibold transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg,#5a4fd4,#7c6af0)", color: "white", fontSize: "12px" }}>
          Upgrade Now
        </button>
      </div>
    </aside>
  );
}
