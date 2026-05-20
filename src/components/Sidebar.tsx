"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import {
  GridIcon,
  CheckCircleIcon,
  RepeatIcon,
  TrophyIcon,
  ChartIcon,
  HelpIcon,
  GearIcon,
} from "@/constants/Icons";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

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
    <aside className="flex flex-col h-full w-[240px] min-w-[240px] bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] py-7">
      {/* Logo */}
      <div className="px-6 mb-8">
        <span className="font-bold text-white tracking-tight text-[18px]">
          Leben
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-[0.125rem] px-3">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={`/${item.label.toLowerCase()}`}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[1rem] text-left transition-colors duration-200 text-[14px] hover:bg-white/35 ${item.active ? "bg-[#1e1e1e] text-[#f0f0f0] font-medium" : "text-[#666666] hover:text-white"}`}
          >
            <span
              className={`${item.active ? "text-[#f0f0f0]" : "text-[#555555]"}`}
            >
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
          <button className="w-full rounded-[1rem] px-3 py-2.5 text-[13px] font-medium bg-gradient-to-br from-[#2a2a2a] to-[#1e1e1e] border border-[#333333] text-[#cccccc] transition duration-200 hover:opacity-80">
            New Entry
          </button>
        </div>

        {/* Support */}
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[1rem] text-left text-[14px] text-[#555555] transition-colors duration-200 hover:bg-white/5 hover:text-white">
          <HelpIcon />
          Support
        </button>

        {/* Settings */}
        <button
          onClick={() => router.push("/settings")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[1rem] text-left text-[14px] text-[#555555] transition-colors duration-200 hover:bg-white/5 hover:text-white"
        >
          <GearIcon />
          Settings
        </button>
      </div>
    </aside>
  );
}
