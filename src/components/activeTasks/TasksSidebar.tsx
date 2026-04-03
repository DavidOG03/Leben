"use client";

import Link from "next/link";

const GridIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

const CheckCircleIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle
      cx="7" cy="7" r="5.5"
      stroke={filled ? "#7c6af0" : "currentColor"}
      strokeWidth="1.3"
      fill={filled ? "rgba(124,106,240,0.15)" : "none"}
    />
    <path
      d="M4.5 7l2 2 3.5-3.5"
      stroke={filled ? "#7c6af0" : "currentColor"}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RepeatIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 4h8a2.5 2.5 0 010 5H2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M4 1.5L2 4l2 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1.5c0 1.5-2 2.5-2 4.5a2 2 0 004 0c0-2-2-3-2-4.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M3 2H1.5v1.5A3 3 0 004 6.5M11 2h1.5v1.5A3 3 0 0110 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M5 13.5h4M7 10v3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const ChartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1.5 10.5l3-3.5L7 9.5l3-6 2.5 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GearIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.7 2.7l1 1M10.3 10.3l1 1M2.7 11.3l1-1M10.3 3.7l1-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const HelpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M5.5 5a1.5 1.5 0 013 0c0 .8-.75 1.2-1.5 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="7" cy="10" r=".6" fill="currentColor" />
  </svg>
);

const navItems = [
  { label: "Dashboard", icon: <GridIcon />, href: "/" },
  { label: "Tasks", icon: <CheckCircleIcon filled />, href: "/tasks", active: true },
  { label: "Habits", icon: <RepeatIcon />, href: "/habits" },
  { label: "Goals", icon: <TrophyIcon />, href: "/goals" },
  { label: "Analytics", icon: <ChartIcon />, href: "/analytics" },
];

export default function TasksSidebar() {
  return (
    <aside
      className="flex flex-col h-full flex-shrink-0"
      style={{
        width: "188px",
        backgroundColor: "#0d0d0d",
        borderRight: "1px solid #1a1a1a",
        padding: "20px 0",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 mb-7">
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{
            width: "28px",
            height: "28px",
            background: "linear-gradient(135deg, #3a3060, #252040)",
            border: "1px solid #3a3060",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1.5" y="1.5" width="4.5" height="4.5" rx="1" fill="#9d8ff5" />
            <rect x="8" y="1.5" width="4.5" height="4.5" rx="1" fill="#7c6af0" opacity="0.6" />
            <rect x="1.5" y="8" width="4.5" height="4.5" rx="1" fill="#7c6af0" opacity="0.6" />
            <rect x="8" y="8" width="4.5" height="4.5" rx="1" fill="#9d8ff5" opacity="0.4" />
          </svg>
        </div>
        <span
          className="font-bold text-white tracking-tight"
          style={{ fontSize: "16px", letterSpacing: "-0.02em" }}
        >
          Leben
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-px">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: item.active ? "#1e1e1e" : "transparent",
              color: item.active ? "#f0f0f0" : "#555",
              fontSize: "13px",
              fontWeight: item.active ? 500 : 400,
              textDecoration: "none",
            }}
          >
            <span style={{ color: item.active ? "#7c6af0" : "#444" }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* New Entry */}
      <div className="px-4 mb-4">
        <button
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg transition-opacity hover:opacity-80"
          style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            color: "#888",
            fontSize: "12px",
          }}
        >
          <span style={{ fontSize: "16px", lineHeight: 1, color: "#666" }}>+</span>
          New Entry
        </button>
      </div>

      {/* Bottom links */}
      <div className="px-3 space-y-px">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg" style={{ color: "#444", fontSize: "12px" }}>
          <GearIcon /> Settings
        </button>
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg" style={{ color: "#444", fontSize: "12px" }}>
          <HelpIcon /> Support
        </button>
      </div>

      {/* User profile */}
      <div
        className="flex items-center gap-2.5 mx-3 mt-3 px-3 py-2.5 rounded-lg"
        style={{ borderTop: "1px solid #1a1a1a", paddingTop: "14px", marginTop: "12px" }}
      >
        <div
          className="rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            width: "30px",
            height: "30px",
            background: "linear-gradient(135deg, #3a3a4a, #1e1e2e)",
            border: "1.5px solid #333",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="6" r="2.5" fill="#888" />
            <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" fill="#888" />
          </svg>
        </div>
        <div>
          <p className="text-white font-medium" style={{ fontSize: "12px", lineHeight: 1.3 }}>Alex Rivera</p>
          <p style={{ fontSize: "10px", color: "#444", lineHeight: 1.3 }}>Digital Curator</p>
        </div>
      </div>
    </aside>
  );
}
