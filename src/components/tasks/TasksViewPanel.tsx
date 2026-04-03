"use client";

import { useLebenStore } from "@/store/useStore";
import { useState } from "react";
import { AllIcon, CalendarIcon, CheckIcon, ClockIcon } from "../../constants/Icons";

type ViewId = "all" | "today" | "upcoming" | "completed";

const tags = ["#work", "#personal", "#strategy"];

export default function TasksViewPanel() {
  const [activeView, setActiveView] = useState<ViewId>("all");
  const tasks = useLebenStore((s) => s.tasks);

  const today = new Date().toDateString();

  const views: { id: ViewId; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "all",       label: "All",       icon: <AllIcon />,      count: tasks.length },
    { id: "today",     label: "Today",     icon: <CalendarIcon />, count: tasks.filter((t) => new Date(t.date).toDateString() === today).length },
    { id: "upcoming",  label: "Upcoming",  icon: <ClockIcon />,    count: tasks.filter((t) => new Date(t.date) > new Date()).length },
    { id: "completed", label: "Completed", icon: <CheckIcon />,    count: tasks.filter((t) => t.completed).length },
  ];

  return (
    <div
      className="flex flex-col flex-shrink-0 overflow-y-auto"
      style={{
        width: "188px",
        backgroundColor: "#0a0a0a",
        borderRight: "1px solid #161616",
        padding: "22px 12px",
      }}
    >
      {/* Views */}
      <p
        className="uppercase tracking-widest mb-3 px-2"
        style={{ fontSize: "9px", color: "#3a3a3a", letterSpacing: "0.14em" }}
      >
        Views
      </p>

      <div className="space-y-px mb-6">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: activeView === view.id ? "#1a1a1a" : "transparent",
              color: activeView === view.id ? "#f0f0f0" : "#555",
              fontSize: "13px",
            }}
          >
            <span className="flex items-center gap-2">
              <span style={{ color: activeView === view.id ? "#7c6af0" : "#3a3a3a" }}>
                {view.icon}
              </span>
              {view.label}
            </span>
            {view.count !== undefined && (
              <span
                className="rounded-md px-1.5 py-0.5"
                style={{
                  fontSize: "10px",
                  backgroundColor: activeView === view.id ? "#252525" : "#181818",
                  color: activeView === view.id ? "#888" : "#444",
                }}
              >
                {view.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tags */}
      <p
        className="uppercase tracking-widest mb-3 px-2"
        style={{ fontSize: "9px", color: "#3a3a3a", letterSpacing: "0.14em" }}
      >
        Tags
      </p>

      <div className="flex flex-wrap gap-2 px-1">
        {tags.map((tag) => (
          <button
            key={tag}
            className="px-2.5 py-1 rounded-lg transition-colors hover:border-purple-800"
            style={{
              fontSize: "11px",
              color: "#666",
              backgroundColor: "#141414",
              border: "1px solid #222",
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}