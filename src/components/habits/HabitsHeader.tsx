"use client";

import { SparkleIcon } from "@/constants/Icons";
import { useLebenStore } from "@/store/useStore";
import NotificationBell from "../shared/NotificationBell";
import { useRouter } from "next/navigation";

// const tabs = ["Today", "Weekly", "Monthly"];

export default function HabitsHeader() {
  const toggleSidebar = useLebenStore((s: any) => s.toggleSidebar);
  const router = useRouter();
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
      <div className="flex items-center gap-3">
        {/* Right icons + wordmark */}
        <div className="flex items-center gap-3">
          <NotificationBell />
          <button
            className="flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
            style={{ width: "32px", height: "32px", color: "#555" }}
            onClick={() => router.push("/planner")}
          >
            <SparkleIcon />
          </button>
        </div>
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
          onClick={() => router.push("/settings")}
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
