"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLebenStore } from "@/store/useStore";
import NotificationBell from "../shared/NotificationBell";
import { Suspense } from "react";

const TABS = [
  { key: "habits", label: "Habits" },
  { key: "reading", label: "Reading" },
  { key: "finance", label: "Finance" },
  { key: "goals", label: "Goals" },
];

function TrackersHeaderInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "habits";
  const toggleSidebar = useLebenStore((s: any) => s.toggleSidebar);
  const userFullName = useLebenStore((s: any) => s.userFullName);

  return (
    <header
      className="flex items-center justify-between px-4 md:px-7 flex-shrink-0 gap-3"
      style={{
        height: "58px",
        borderBottom: "1px solid #161616",
        backgroundColor: "#0a0a0a",
      }}
    >
      <div className="flex items-center gap-3 md:gap-5 flex-1 min-w-0">
        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 flex-shrink-0"
          onClick={() => toggleSidebar(true)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <span className="font-bold text-white flex-shrink-0 hidden sm:block" style={{ fontSize: "15px" }}>
          Trackers
        </span>

        {/* Tab bar */}
        <nav className="flex items-center gap-1 overflow-x-auto flex-1 min-w-0" style={{ scrollbarWidth: "none" }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => router.push(`/trackers?tab=${tab.key}`)}
              className="flex-shrink-0 px-3 py-1 transition-colors"
              style={{
                fontSize: "13px",
                color: activeTab === tab.key ? "#f0f0f0" : "#555",
                borderBottom: activeTab === tab.key ? "2px solid #7c6af0" : "2px solid transparent",
                paddingBottom: "2px",
              }}
            >
              {tab.label}
              {tab.key === "finance" && (
                <span
                  className="ml-1.5 px-1 rounded"
                  style={{ fontSize: "8px", backgroundColor: "#1e1e1e", color: "#555", verticalAlign: "middle" }}
                >
                  SOON
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <NotificationBell />
        <div
          className="rounded-full cursor-pointer"
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

export default function TrackersHeader() {
  return (
    <Suspense fallback={<div style={{ height: "58px", borderBottom: "1px solid #161616", backgroundColor: "#0a0a0a" }} />}>
      <TrackersHeaderInner />
    </Suspense>
  );
}
