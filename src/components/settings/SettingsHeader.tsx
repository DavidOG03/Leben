"use client";

import { useLebenStore } from "@/store/useStore";
import NotificationBell from "../shared/NotificationBell";

const tabs = ["Profile"];

export default function SettingsHeader() {
  const toggleSidebar = useLebenStore((s: any) => s.toggleSidebar);
  return (
    <header
      className="flex items-center justify-between px-4 md:px-7 flex-shrink-0 relative z-30"
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
        <span className="font-bold text-white" style={{ fontSize: "15px" }}>
          Settings
        </span>
        <nav className="flex items-center gap-1">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className="px-3 py-1.5"
              style={{ fontSize: "13px", color: i === 0 ? "#f0f0f0" : "#555" }}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <NotificationBell />
      </div>
    </header>
  );
}
