"use client";

import { useState } from "react";
import { useLebenStore } from "@/store/useStore";
import { CheckIcon, EmptyIcon, TrashIcon } from "../../constants/Icons";



export default function TaskList() {
  const tasks = useLebenStore((s) => s.tasks);
  const toggleTask = useLebenStore((s) => s.toggleTask);
  const deleteTask = useLebenStore((s) => s.deleteTask);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid #1e1e1e", backgroundColor: "#131313" }}
    >
      {tasks.length === 0 ? (
        <>
          {/* Ghost skeleton rows */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-4"
              style={{ borderBottom: i < 3 ? "1px solid #181818" : "none", opacity: 1 - i * 0.2 }}
            >
              <div className="rounded flex-shrink-0" style={{ width: "18px", height: "18px", backgroundColor: "#1a1a1a", border: "1px solid #222", borderRadius: "5px" }} />
              <div className="flex-1 space-y-2">
                <div className="rounded" style={{ width: `${220 - i * 30}px`, height: "10px", backgroundColor: "#1a1a1a" }} />
                <div className="rounded" style={{ width: "90px", height: "8px", backgroundColor: "#161616" }} />
              </div>
              <div className="rounded" style={{ width: "44px", height: "18px", backgroundColor: "#171717" }} />
            </div>
          ))}

          {/* Empty state message */}
          <div className="flex flex-col items-center justify-center py-10 gap-3" style={{ borderTop: "1px solid #181818" }}>
            <EmptyIcon />
            <p className="font-medium" style={{ fontSize: "13px", color: "#333" }}>No tasks yet</p>
            <p style={{ fontSize: "12px", color: "#2a2a2a", textAlign: "center", lineHeight: 1.6 }}>
              Type above to add your first task<br />and start building momentum.
            </p>
          </div>
        </>
      ) : (
        tasks.map((task, i) => (
          <div
            key={task.id}
            className="flex items-center gap-4 px-5 py-4 group transition-colors hover:bg-white/[0.02]"
            style={{ borderBottom: i < tasks.length - 1 ? "1px solid #181818" : "none" }}
            onMouseEnter={() => setHoveredId(task.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Checkbox */}
            <button
              onClick={() => toggleTask(task.id)}
              className="flex-shrink-0 flex items-center justify-center transition-all"
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "5px",
                border: task.completed ? "1px solid #3a7a4a" : "1px solid #2a2a2a",
                backgroundColor: task.completed ? "#1e3d26" : "#1a1a1a",
                color: task.completed ? "#4caf70" : "transparent",
              }}
            >
              {task.completed && <CheckIcon />}
            </button>

            {/* Title */}
            <span
              className="flex-1 transition-all"
              style={{
                fontSize: "13px",
                color: task.completed ? "#444" : "#ccc",
                textDecoration: task.completed ? "line-through" : "none",
                lineHeight: 1.4,
              }}
            >
              {task.title}
            </span>

            {/* Tag badge */}
            <span
              className="rounded px-2 py-0.5"
              style={{
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.05em",
                backgroundColor: task.tag === "WORK" ? "#1a1f2e" : "#1e1a2a",
                color: task.tag === "WORK" ? "#4a7abf" : "#8a5abf",
                border: `1px solid ${task.tag === "WORK" ? "#1e2a42" : "#2a1e42"}`,
              }}
            >
              {task.tag}
            </span>

            {/* Date */}
            <span style={{ fontSize: "11px", color: "#333", whiteSpace: "nowrap" }}>
              {task.date}
            </span>

            {/* Delete button */}
            <button
              onClick={() => deleteTask(task.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "26px",
                height: "26px",
                borderRadius: "6px",
                border: "1px solid transparent",
                backgroundColor: "transparent",
                color: "#444",
                cursor: "pointer",
                flexShrink: 0,
                opacity: hoveredId === task.id ? 1 : 0,
                transition: "opacity 0.15s, color 0.15s, background-color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget;
                btn.style.color = "#e85555";
                btn.style.backgroundColor = "rgba(232,85,85,0.1)";
                btn.style.borderColor = "rgba(232,85,85,0.2)";
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget;
                btn.style.color = "#444";
                btn.style.backgroundColor = "transparent";
                btn.style.borderColor = "transparent";
              }}
              aria-label="Delete task"
            >
              <TrashIcon />
            </button>
          </div>
        ))
      )}
    </div>
  );
}