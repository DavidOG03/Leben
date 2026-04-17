"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  GearIcon,
  SparkleIcon,
  LockIcon,
} from "@/constants/Icons";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLebenStore } from "@/store/useStore";

const navItems = [
  { label: "Dashboard", icon: <GridIcon />, href: "/" },
  { label: "Tasks", icon: <TaskIcon />, href: "/tasks" },
  { label: "Habits", icon: <HabitIcon />, href: "/habits" },
  { label: "Goals", icon: <GoalIcon />, href: "/goals" },
  { label: "AI Assistant", icon: <AIIcon />, href: "/ai" },
  { label: "Daily Planner", icon: <SparkleIcon />, href: "/planner" },
  { label: "Analytics", icon: <AnalyticsIcon />, href: "/analytics" },
  { label: "Settings", icon: <GearIcon />, href: "/settings" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const userName = user?.user_metadata?.full_name || "Guest";
  const userRole = user ? "Premium Curator" : "Preview Mode";
  const isAuthenticated = !!user;

  const isSidebarOpen = useLebenStore((s: any) => s.isSidebarOpen);
  const toggleSidebar = useLebenStore((s: any) => s.toggleSidebar);

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => toggleSidebar(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full flex flex-col flex-shrink-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
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

          {/* Mobile Close Button */}
          <button
            className="ml-auto flex items-center justify-center w-6 h-6 rounded-md text-[#555] hover:text-white hover:bg-white/10 md:hidden"
            onClick={() => toggleSidebar(false)}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-px overflow-y-auto">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            // const isLocked =
            //   !isAuthenticated &&
            //   (item.href === "/planner" ||
            //    item.href === "/analytics" ||
            //    item.href === "/ai");

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (window.innerWidth < 768) {
                    toggleSidebar(false);
                  }
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors group
                "
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
                {/* {isLocked && (
                  <span className="ml-auto opacity-20 group-hover:opacity-100 transition-opacity">
                    <LockIcon />
                  </span>
                )} */}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 space-y-px">
          <button
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg"
            style={{ color: "#444", fontSize: "12px" }}
          >
            <HelpIcon /> Help
          </button>
          {isAuthenticated ? (
            <button
              onClick={() => {
                useLebenStore.getState().clearStore();
                signOut();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg"
              style={{ color: "#444", fontSize: "12px" }}
            >
              <LogoutIcon /> Logout
            </button>
          ) : (
            <Link
              href="/auth/signin"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors hover:bg-white/5"
              style={{
                color: "#7c6af0",
                fontSize: "12px",
                textDecoration: "none",
              }}
            >
              <LogoutIcon /> Sign In
            </Link>
          )}
        </div>

        {/* User profile */}
        <div
          className="flex items-center gap-2.5 mx-3 mt-3 pt-3"
          style={{ borderTop: "1px solid #1a1a1a" }}
          role="button"
          aria-roledescription="Go to profile"
          onClick={() => router.push("/settings")}
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
              className="text-white font-medium capitalize"
              style={{ fontSize: "12px", lineHeight: 1.3 }}
            >
              {userName}
            </p>
            <p style={{ fontSize: "10px", color: "#444", lineHeight: 1.3 }}>
              {userRole}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
