"use client";

import { BellIcon, SearchIcon, SparkleIcon } from "@/constants/Icons";
import { useRouter } from "next/navigation";
import { useLebenStore } from "@/store/useStore";
import NotificationBell from "../shared/NotificationBell";

export default function TasksHeader() {
  const router = useRouter();
  const toggleSidebar = useLebenStore((s: any) => s.toggleSidebar);
  return (
    <header
      className="flex items-center justify-between px-6 flex-shrink-0 w-full"
      style={{
        height: "56px",
        backgroundColor: "#0a0a0a",
        borderBottom: "1px solid #161616",
      }}
    >
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

      {/* Spacer for desktop to keep items aligned right */}
      <div className="hidden md:block flex-1" />

      {/* Search bar — centred in design */}
      {/* <div className="flex-1 flex justify-center">
        <div
          className="flex items-center gap-2.5 px-4 py-2 rounded-lg"
          style={{
            backgroundColor: "#131313",
            border: "1px solid #1e1e1e",
            width: "340px",
          }}
        >
          <span style={{ color: "#3a3a3a" }}>
            <SearchIcon />
          </span>
          <span style={{ fontSize: "12px", color: "#3a3a3a" }}>
            Search tasks, habits, or files...
          </span>
        </div>
      </div> */}

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
        <span
          className="font-bold tracking-widest"
          style={{
            fontSize: "11px",
            color: "#333",
            letterSpacing: "0.18em",
            marginLeft: "4px",
          }}
        >
          LEBEN
        </span>
      </div>
    </header>
  );
}
