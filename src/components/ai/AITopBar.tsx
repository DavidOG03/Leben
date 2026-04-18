"use client";

import { GearIcon } from "@/constants/Icons";
import NotificationBell from "../shared/NotificationBell";
import { useLebenStore } from "@/store/useStore";

export default function AITopBar() {
  const toggleSidebar = useLebenStore((s: any) => s.toggleSidebar);

  return (
    <header
      className="flex items-center justify-between px-4 sm:px-7 flex-shrink-0"
      style={{
        height: "56px",
        borderBottom: "1px solid #161616",
        backgroundColor: "#0a0a0a",
      }}
    >
      <nav className="flex items-center gap-3">
        {/* ── Hamburger — mobile only, toggles AppSidebar ── */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-lg text-[#555] hover:text-white hover:bg-white/5 transition-colors"
          onClick={() => toggleSidebar(true)}
          aria-label="Open navigation"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <span
          className="font-bold text-white"
          style={{ fontSize: "15px", letterSpacing: "-0.01em" }}
        >
          Leben
        </span>
      </nav>

      <div className="flex items-center gap-3">
        <NotificationBell />
        <div
          role="button"
          aria-roledescription="go to profile page"
          className="rounded-full flex-shrink-0"
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
