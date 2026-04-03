"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* ── Icons ─────────────────────────────────────────── */
const GridIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="1" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
    <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
    <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
    <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);
const TaskIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3" />
    <path d="M4.5 7.5l2.2 2.2L10.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const HabitIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M2 5h9a3 3 0 010 6H2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M5 2L2 5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const GoalIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 1.5c0 1.8-2.5 3-2.5 5.5a2.5 2.5 0 005 0c0-2.5-2.5-3.7-2.5-5.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M3 2.5H1.5V4A3.5 3.5 0 005 7.3M12 2.5h1.5V4A3.5 3.5 0 0110 7.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M5.5 13.5h4M7.5 11v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const AIIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 1.5l1.4 4.2L13.5 7l-4.6 1.3L7.5 13.5l-1.4-5.2L1.5 7l4.6-1.3L7.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);
const AnalyticsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M1.5 11.5l3.5-4 2.5 2.5 4-6.5 2 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const SettingsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="2.2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M7.5 1.5v1.8M7.5 11.7v1.8M1.5 7.5h1.8M11.7 7.5h1.8M3.2 3.2l1.3 1.3M10.5 10.5l1.3 1.3M3.2 11.8l1.3-1.3M10.5 4.5l1.3-1.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const HelpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M5.5 5.5a1.5 1.5 0 013 0c0 .8-.8 1.3-1.5 2.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="7" cy="10" r=".65" fill="currentColor" />
  </svg>
);
const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M5.5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M9.5 9.5L13 7l-3.5-2.5M13 7H5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const PlusIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const navItems = [
  { label: "Dashboard", icon: <GridIcon />, href: "/" },
  { label: "Tasks", icon: <TaskIcon />, href: "/tasks" },
  { label: "Habits", icon: <HabitIcon />, href: "/habits" },
  { label: "Goals", icon: <GoalIcon />, href: "/goals" },
  { label: "AI Assistant", icon: <AIIcon />, href: "/ai" },
  { label: "Analytics", icon: <AnalyticsIcon />, href: "/analytics" },
  { label: "Settings", icon: <SettingsIcon />, href: "/settings" },
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
      style={{ width: "190px", backgroundColor: "#0d0d0d", borderRight: "1px solid #1a1a1a", padding: "20px 0" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 mb-7">
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{ width: "28px", height: "28px", background: "linear-gradient(135deg,#3a3060,#252040)", border: "1px solid #3a3060" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1.5" y="1.5" width="4.5" height="4.5" rx="1" fill="#9d8ff5" />
            <rect x="8" y="1.5" width="4.5" height="4.5" rx="1" fill="#7c6af0" opacity="0.6" />
            <rect x="1.5" y="8" width="4.5" height="4.5" rx="1" fill="#7c6af0" opacity="0.6" />
            <rect x="8" y="8" width="4.5" height="4.5" rx="1" fill="#9d8ff5" opacity="0.4" />
          </svg>
        </div>
        <span className="font-bold text-white" style={{ fontSize: "16px", letterSpacing: "-0.02em" }}>Leben</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-px overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
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
              <span style={{ color: active ? "#7c6af0" : "#444" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* New Entry */}
      <div className="px-4 mt-4 mb-3">
        <button
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg"
          style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#888", fontSize: "12px" }}
        >
          <PlusIcon /> {newEntryLabel}
        </button>
      </div>

      {/* Bottom */}
      <div className="px-3 space-y-px">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg" style={{ color: "#444", fontSize: "12px" }}>
          <HelpIcon /> Help
        </button>
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg" style={{ color: "#444", fontSize: "12px" }}>
          <LogoutIcon /> Logout
        </button>
      </div>

      {/* User profile (optional) */}
      {showUser && (
        <div className="flex items-center gap-2.5 mx-3 mt-3 pt-3" style={{ borderTop: "1px solid #1a1a1a" }}>
          <div className="rounded-full flex-shrink-0" style={{ width: "30px", height: "30px", background: "linear-gradient(135deg,#3a3a4a,#1e1e2e)", border: "1.5px solid #333", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="2.5" fill="#888" /><path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" fill="#888" /></svg>
          </div>
          <div>
            <p className="text-white font-medium" style={{ fontSize: "12px", lineHeight: 1.3 }}>{userName}</p>
            <p style={{ fontSize: "10px", color: "#444", lineHeight: 1.3 }}>{userRole}</p>
          </div>
        </div>
      )}
    </aside>
  );
}
