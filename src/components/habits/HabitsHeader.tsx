"use client";

import { useLebenStore } from "@/store/useStore";

// const tabs = ["Today", "Weekly", "Monthly"];

export default function HabitsHeader() {
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
      <div className="flex items-center gap-3 md:gap-6 w-full">
        {/* Mobile Hamburger Menu */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10"
          onClick={() => toggleSidebar(true)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <span
          className="font-bold text-white hidden sm:block"
          style={{ fontSize: "15px" }}
        >
          Habit Tracker
        </span>
        {/* <nav className="flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className="px-3 py-1 rounded-lg transition-colors"
              style={{
                fontSize: "13px",
                color: i === 0 ? "#f0f0f0" : "#555",
                borderBottom: i === 0 ? "2px solid #7c6af0" : "none",
              }}
            >
              {tab}
            </button>
          ))}
        </nav> */}
      </div>
      <div className="hidden md:flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{
            backgroundColor: "#141414",
            border: "1px solid #1e1e1e",
            width: "180px",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke="#444" strokeWidth="1.2" />
            <path
              d="M9 9l2.5 2.5"
              stroke="#444"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span style={{ fontSize: "12px", color: "#3a3a3a" }}>
            Search habits...
          </span>
        </div>
        <button
          className="flex items-center justify-center"
          style={{ width: "30px", height: "30px", color: "#555" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2a4.5 4.5 0 00-4.5 4.5v2.8L2 11h12l-1.5-1.7V6.5A4.5 4.5 0 008 2z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            <path
              d="M6 13a2 2 0 004 0"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button
          className="flex items-center justify-center"
          style={{ width: "30px", height: "30px", color: "#555" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2l1.5 4L14 8l-4.5 1.5L8 14l-1.5-4.5L2 8l4.5-1.5L8 2z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
