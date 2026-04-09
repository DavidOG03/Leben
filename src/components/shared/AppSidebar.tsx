"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/supabase/authActions";
import {
  GridIcon,
  TaskIcon,
  HabitIcon,
  GoalIcon,
  AIIcon,
  AnalyticsIcon,
  SettingsIcon,
  HelpIcon,
  LogoutIcon,
  PlusIcon,
  GearIcon,
} from "@/constants/Icons";

const navItems = [
  { label: "Dashboard", icon: <GridIcon />, href: "/" },
  { label: "Tasks", icon: <TaskIcon />, href: "/tasks" },
  { label: "Habits", icon: <HabitIcon />, href: "/habits" },
  { label: "Goals", icon: <GoalIcon />, href: "/goals" },
  { label: "Daily Planner", icon: <AIIcon />, href: "/planner" },
  { label: "Analytics", icon: <AnalyticsIcon />, href: "/analytics" },
  { label: "Settings", icon: <GearIcon />, href: "/settings" },
];

interface AppSidebarProps {
  newEntryLabel?: string;
  userName?: string;
  userRole?: string;
  showUser?: boolean;
}

export default function AppSidebar({
  newEntryLabel = "New Entry",
  userName = "Alex Rivera",
  userRole = "Premium Curator",
  showUser = false,
}: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col h-full flex-shrink-0"
      style={{
        width: "190px",
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
            background: "linear-gradient(135deg,#3a3060,#252040)",
            border: "1px solid #3a3060",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect
              x="1.5"
              y="1.5"
              width="4.5"
              height="4.5"
              rx="1"
              fill="#9d8ff5"
            />
            <rect
              x="8"
              y="1.5"
              width="4.5"
              height="4.5"
              rx="1"
              fill="#7c6af0"
              opacity="0.6"
            />
            <rect
              x="1.5"
              y="8"
              width="4.5"
              height="4.5"
              rx="1"
              fill="#7c6af0"
              opacity="0.6"
            />
            <rect
              x="8"
              y="8"
              width="4.5"
              height="4.5"
              rx="1"
              fill="#9d8ff5"
              opacity="0.4"
            />
          </svg>
        </div>
        <span
          className="font-bold text-white"
          style={{ fontSize: "16px", letterSpacing: "-0.02em" }}
        >
          Leben
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-px overflow-y-auto">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: active ? "#1e1e1e" : "transparent",
                color: active ? "#f0f0f0" : "#555",
                fontSize: "13px",
                fontWeight: active ? 500 : 400,
                textDecoration: "none",
              }}
            >
              <span style={{ color: active ? "#7c6af0" : "#444" }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* New Entry */}
      <div className="px-4 mt-4 mb-3">
        <button
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg"
          style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            color: "#888",
            fontSize: "12px",
          }}
        >
          <PlusIcon /> {newEntryLabel}
        </button>
      </div>

      {/* Bottom */}
      <div className="px-3 space-y-px">
        <button
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg"
          style={{ color: "#444", fontSize: "12px" }}
        >
          <HelpIcon /> Help
        </button>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg"
          style={{ color: "#444", fontSize: "12px" }}
        >
          <LogoutIcon /> Logout
        </button>
      </div>

      {/* User profile (optional) */}
      {showUser && (
        <div
          className="flex items-center gap-2.5 mx-3 mt-3 pt-3"
          style={{ borderTop: "1px solid #1a1a1a" }}
        >
          <div
            className="rounded-full flex-shrink-0"
            style={{
              width: "30px",
              height: "30px",
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
          <div>
            <p
              className="text-white font-medium"
              style={{ fontSize: "12px", lineHeight: 1.3 }}
            >
              {userName}
            </p>
            <p style={{ fontSize: "10px", color: "#444", lineHeight: 1.3 }}>
              {userRole}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
