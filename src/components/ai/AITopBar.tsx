"use client";

const BellIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path d="M8.5 2a4.5 4.5 0 00-4.5 4.5v2.8L2.5 11h12l-1.5-1.7V6.5A4.5 4.5 0 008.5 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M6.5 13a2 2 0 004 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const GearIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <circle cx="8.5" cy="8.5" r="2.3" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8.5 1.5v2M8.5 13.5v2M1.5 8.5h2M13.5 8.5h2M3.4 3.4l1.4 1.4M12.2 12.2l1.4 1.4M3.4 13.6l1.4-1.4M12.2 4.8l1.4-1.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export default function AITopBar() {
  return (
    <header
      className="flex items-center justify-between px-7 flex-shrink-0"
      style={{ height: "56px", borderBottom: "1px solid #161616", backgroundColor: "#0a0a0a" }}
    >
      <nav className="flex items-center gap-6">
        <span className="font-bold text-white" style={{ fontSize: "15px", letterSpacing: "-0.01em" }}>Leben</span>
        {["Dashboard", "Workspaces", "Insights"].map((item, i) => (
          <button key={item} className="transition-colors" style={{ fontSize: "13px", color: i === 0 ? "#f0f0f0" : "#555" }}>
            {item}
          </button>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <button className="flex items-center justify-center rounded-lg" style={{ width: "32px", height: "32px", color: "#555" }}><BellIcon /></button>
        <button className="flex items-center justify-center rounded-lg" style={{ width: "32px", height: "32px", color: "#555" }}><GearIcon /></button>
        <div className="rounded-full flex-shrink-0" style={{ width: "32px", height: "32px", background: "linear-gradient(135deg,#3a3a4a,#1e1e2e)", border: "1.5px solid #333", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="2.5" fill="#888" /><path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" fill="#888" /></svg>
        </div>
      </div>
    </header>
  );
}
