"use client";

import { useLebenStore } from "@/store/useStore";

// const tabs = ["All Goals", "Active", "Milestones", "Archive"];

export default function GoalsHeader() {
  const toggleSidebar = useLebenStore((s: any) => s.toggleSidebar);
  return (
    <header
      className="flex items-center justify-between px-4 md:px-7 flex-shrink-0"
      style={{
        height: "58px",
        borderBottom: "1px solid #161616",
        backgroundColor: "#0a0a0a",
      }}
    >
      <div className="flex items-center gap-3 md:gap-6">
        {/* Mobile Hamburger Menu */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10"
          onClick={() => toggleSidebar(true)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <span className="font-bold text-white" style={{ fontSize: "15px" }}>
          Goal Tracker
        </span>
        {/* <nav className="flex items-center gap-1">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className="px-3 py-1.5 rounded-lg transition-colors"
              style={{
                fontSize: "12px",
                color: i === 0 ? "#f0f0f0" : "#555",
                backgroundColor: i === 0 ? "#1a1a1a" : "transparent",
                borderBottom: i === 0 ? "2px solid #7c6af0" : "none",
              }}
            >
              {tab}
            </button>
          ))}
        </nav> */}
      </div>
      <div className="hidden md:flex items-center gap-3">
        <button
          className="flex items-center justify-center rounded-lg"
          style={{ width: "32px", height: "32px", color: "#555" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle
              cx="7"
              cy="7"
              r="5"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path
              d="M11 11l3 3"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button
          className="flex items-center justify-center rounded-lg"
          style={{ width: "32px", height: "32px", color: "#555" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM2.5 14a6 6 0 0111 0"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {/* <button className="px-4 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-90" style={{ background: "#f0f0f0", color: "#0a0a0a", fontSize: "12px" }}>
          UPGRADE
        </button> */}
        <div
          className="rounded-full"
          style={{
            width: "32px",
            height: "32px",
            background: "linear-gradient(135deg,#3a3a4a,#1e1e2e)",
            border: "1.5px solid #333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="6" r="2.5" fill="#888" />
            <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" fill="#888" />
          </svg>
        </div>
      </div>
    </header>
  );
}
