"use client";

import { useLebenStore } from "@/store/useStore";
import Link from "next/link";
import { CheckIcon, PlusIcon, TrashIcon } from "../constants/Icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TodaysFocus() {
  const tasks = useLebenStore((s) => s.tasks);
  const isSyncing = useLebenStore((s) => s.isSyncing);
  const toggleTask = useLebenStore((s) => s.toggleTask);
  const deleteTask = useLebenStore((s) => s.deleteTask);
  const updateTask = useLebenStore((s) => s.updateTask);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reminderTask, setReminderTask] = useState<string | null>(null);
  const [reminderTime, setReminderTime] = useState<string>("");
  const router = useRouter();

  const handleSetReminder = (taskId: string) => {
    if (!reminderTime) return;
    
    const [hours, minutes] = reminderTime.split(":").map(Number);
    const now = new Date();
    const reminderDate = new Date();
    reminderDate.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, set it for tomorrow
    if (reminderDate <= now) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }

    updateTask(taskId, { reminderAt: reminderDate.toISOString() });
    setReminderTask(null);
    setReminderTime("");
  };

  return (
    <div
      className="rounded-2xl p-6 flex flex-col"
      style={{
        background: "linear-gradient(145deg, #121212 0%, #0e0e0e 100%)",
        border: "1px solid #1e1e1e",
        minHeight: "200px",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-white" style={{ fontSize: "15px" }}>
          Today&apos;s Focus
        </h3>
        {!(loading || isSyncing) && tasks.length > 0 && (
          <Link
            href="/tasks"
            className="text-[#7c6af0] hover:underline"
            style={{ fontSize: "11px", fontWeight: 600 }}
          >
            Go to Tasks
          </Link>
        )}
      </div>

      {(loading || isSyncing) ? (
        <div className="flex-1 flex flex-col gap-4 animate-pulse px-5 py-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-[18px] h-[18px] rounded-[5px] bg-white/5" />
              <div className="flex-1 h-3 rounded bg-white/5" />
              <div className="w-10 h-4 rounded bg-white/5" />
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <>
          {/* Empty state */}
          <div className="flex-1 flex flex-col items-center justify-center py-4 gap-3">
            <PlusIcon />
            <p
              style={{
                fontSize: "12px",
                color: "#333",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              No tasks yet
            </p>
            <Link
              href="/tasks"
              className="px-4 py-1.5 rounded-lg transition-opacity hover:opacity-80"
              style={{
                fontSize: "11px",
                color: "#666",
                border: "1px solid #222",
                textDecoration: "none",
              }}
            >
              Add your first task
            </Link>
          </div>
        </>
      ) : (
        tasks.map((task, i) => (
          <div key={task.id}>
            <div
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]"
              style={{
                borderBottom: i < tasks.length - 1 ? "1px solid #181818" : "none",
              }}
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
                  border: task.completed
                    ? "1px solid #3a7a4a"
                    : "1px solid #2a2a2a",
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

              <div className="flex flex-col gap-2 items-end">
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
                <span
                  style={{
                    fontSize: "11px",
                    color: "#333",
                    whiteSpace: "nowrap",
                  }}
                >
                  {task.date}
                </span>
              </div>

              {/* Reminder button */}
              <button
                onClick={() => setReminderTask(reminderTask === task.id ? null : task.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "26px",
                  height: "26px",
                  borderRadius: "6px",
                  border: task.reminderAt ? "1px solid #7c6af0" : "1px solid transparent",
                  backgroundColor: task.reminderAt ? "rgba(124, 106, 240, 0.15)" : "transparent",
                  color: task.reminderAt ? "#7c6af0" : "#444",
                  cursor: "pointer",
                  flexShrink: 0,
                  opacity: hoveredId === task.id ? 1 : 0,
                  transition: "opacity 0.15s, color 0.15s, background-color 0.15s, border-color 0.15s",
                  fontSize: "14px",
                }}
                title={task.reminderAt ? `Reminder set for ${new Date(task.reminderAt).toLocaleTimeString()}` : "Set reminder"}
              >
                🔔
              </button>

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
                  transition:
                    "opacity 0.15s, color 0.15s, background-color 0.15s, border-color 0.15s",
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

            {/* Reminder time picker */}
            {reminderTask === task.id && (
              <div className="px-5 py-3 bg-white/[0.02] flex items-center gap-2 border-t border-white/[0.05]">
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "4px",
                    border: "1px solid #333",
                    backgroundColor: "#0a0a0a",
                    color: "#ccc",
                    fontSize: "12px",
                  }}
                />
                <button
                  onClick={() => handleSetReminder(task.id)}
                  disabled={!reminderTime}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "4px",
                    border: "1px solid #7c6af0",
                    backgroundColor: reminderTime ? "#7c6af0" : "transparent",
                    color: "#fff",
                    fontSize: "12px",
                    cursor: reminderTime ? "pointer" : "not-allowed",
                    opacity: reminderTime ? 1 : 0.5,
                  }}
                >
                  Set
                </button>
                {task.reminderAt && (
                  <button
                    onClick={() => updateTask(task.id, { reminderAt: undefined })}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "4px",
                      border: "1px solid #555",
                      backgroundColor: "transparent",
                      color: "#999",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
