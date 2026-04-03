"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RepeatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 5h9a3 3 0 010 6H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5 2L2 5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 8h-9a3 3 0 010-6h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M11 11l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 11V13M5 15h6M3 2H1v2a4 4 0 003 3.87M13 2h2v2a4 4 0 01-3 3.87M5 2h6v5a3 3 0 01-6 0V2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 12l4-4 3 3 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HelpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 6a2 2 0 114 0c0 1-1 1.5-2 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
  </svg>
);

const GearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <GridIcon />, active: true },
  { label: "Tasks", icon: <CheckCircleIcon /> },
  { label: "Habits", icon: <RepeatIcon /> },
  { label: "Goals", icon: <TrophyIcon /> },
  { label: "Analytics", icon: <ChartIcon /> },
];

export default function Sidebar() {
  const router = useRouter();
  return (
    <aside
      className="flex flex-col h-full"
      style={{
        width: "240px",
        minWidth: "240px",
        backgroundColor: "#0d0d0d",
        borderRight: "1px solid #1e1e1e",
        padding: "28px 0",
      }}
    >
      {/* Logo */}
      <div className="px-6 mb-8">
        <span
          className="font-bold text-white tracking-tight"
          style={{ fontSize: "18px", letterSpacing: "-0.02em" }}
        >
          Leben
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={`/${item.label.toLowerCase()}`}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors"
            style={{
              backgroundColor: item.active ? "#1e1e1e" : "transparent",
              color: item.active ? "#f0f0f0" : "#666666",
              fontSize: "14px",
              fontWeight: item.active ? 500 : 400,
            }}
          >
            <span style={{ color: item.active ? "#f0f0f0" : "#555555" }}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 mt-auto space-y-1">
        {/* New Entry button */}
        <div className="px-3 mb-4">
          <button
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              background: "linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%)",
              border: "1px solid #333333",
              color: "#cccccc",
              fontSize: "13px",
            }}
          >
            New Entry
          </button>
        </div>

        {/* Support */}
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left"
          style={{ color: "#555555", fontSize: "14px" }}
        >
          <HelpIcon />
          Support
        </button>

        {/* Settings */}
        <button
        onClick={() => router.push("/settings")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left"
          style={{ color: "#555555", fontSize: "14px" }}
        >
          <GearIcon />
          Settings
        </button>
      </div>
    </aside>
  );
}
