"use client";

import { useState, useRef, useEffect } from "react";
import { useLebenStore } from "@/store/useStore";
import {
  CheckIcon,
  EmptyIcon,
  TrashIcon,
  EditIcon,
  BellIcon,
} from "../../constants/Icons";
import ReminderPicker from "../shared/ReminderPicker";

export default function TaskList() {
  const tasks = useLebenStore((s) => s.tasks);
  const toggleTask = useLebenStore((s) => s.toggleTask);
  const deleteTask = useLebenStore((s) => s.deleteTask);
  const updateTask = useLebenStore((s) => s.updateTask);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [reminderEditingId, setReminderEditingId] = useState<string | null>(null);
  // Mobile: which task's action menu is open
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) inputRef.current.focus();
  }, [editingId]);

  const startEditing = (task: any) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setOpenMenuId(null);
  };

  const saveEdit = () => {
    if (editingId && editTitle.trim()) {
      updateTask(editingId, { title: editTitle.trim() });
    }
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const handleSetReminder = (taskId: string, isoDate: string | undefined) => {
    updateTask(taskId, { reminderAt: isoDate });
    setReminderEditingId(null);
    setOpenMenuId(null);
  };

  return (
    <div
      className="rounded-xl"
      style={{ border: "1px solid #1e1e1e", backgroundColor: "#131313" }}
    >
      {tasks.length === 0 ? (
        <>
          {/* Ghost skeleton rows */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-4"
              style={{
                borderBottom: i < 3 ? "1px solid #181818" : "none",
                opacity: 1 - i * 0.2,
              }}
            >
              <div
                className="rounded flex-shrink-0"
                style={{
                  width: "18px",
                  height: "18px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #222",
                  borderRadius: "5px",
                }}
              />
              <div className="flex-1 space-y-2">
                <div
                  className="rounded"
                  style={{ width: `${220 - i * 30}px`, height: "10px", backgroundColor: "#1a1a1a" }}
                />
                <div
                  className="rounded"
                  style={{ width: "90px", height: "8px", backgroundColor: "#161616" }}
                />
              </div>
              <div
                className="rounded"
                style={{ width: "44px", height: "18px", backgroundColor: "#171717" }}
              />
            </div>
          ))}

          <div
            className="flex flex-col items-center justify-center py-10 gap-3"
            style={{ borderTop: "1px solid #181818" }}
          >
            <EmptyIcon />
            <p className="font-medium" style={{ fontSize: "13px", color: "#333" }}>
              No tasks yet
            </p>
            <p style={{ fontSize: "12px", color: "#2a2a2a", textAlign: "center", lineHeight: 1.6 }}>
              Type above to add your first task
              <br />
              and start building momentum.
            </p>
          </div>
        </>
      ) : (
        tasks.map((task, i) => (
          <div
            key={task.id}
            className="group transition-colors hover:bg-white/[0.02]"
            style={{
              borderBottom: i < tasks.length - 1 ? "1px solid #181818" : "none",
              position: "relative",
            }}
          >
            {/* ── Main row ────────────────────────────────────── */}
            <div className="flex items-center gap-3 px-4 py-3.5">
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

              {/* Priority dot */}
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  backgroundColor:
                    task.priority === "high" ? "#e85555" : task.priority === "low" ? "#55e855" : "#e8a855",
                  boxShadow: `0 0 6px ${task.priority === "high" ? "#e85555" : task.priority === "low" ? "#55e855" : "#e8a855"}44`,
                }}
              />

              {/* Title — takes all remaining space */}
              <div className="flex-1 min-w-0">
                {editingId === task.id ? (
                  <input
                    ref={inputRef}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="w-full bg-transparent text-[#ccc] outline-none"
                    style={{ fontSize: "13px", borderBottom: "1px solid #3a3a9e" }}
                  />
                ) : (
                  <span
                    onDoubleClick={() => startEditing(task)}
                    className="block truncate cursor-text transition-all"
                    style={{
                      fontSize: "13px",
                      color: task.completed ? "#444" : "#ccc",
                      textDecoration: task.completed ? "line-through" : "none",
                      lineHeight: 1.4,
                    }}
                  >
                    {task.title}
                  </span>
                )}

                {/* Reminder indicator under title on mobile */}
                {task.reminderAt && (
                  <div className="flex items-center gap-1 mt-0.5 text-[#7c6af0]" style={{ fontSize: "9px" }}>
                    <BellIcon />
                    <span>
                      {new Date(task.reminderAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                )}
              </div>

              {/* Tag — hidden on very small screens, shown md+ */}
              <span
                className="hidden sm:inline-block rounded px-2 py-0.5 shrink-0"
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

              {/* ── Desktop actions (visible on hover) ─────────── */}
              <div className="hidden sm:flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setReminderEditingId(reminderEditingId === task.id ? null : task.id)}
                  className={`flex items-center justify-center w-[26px] h-[26px] rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-white/5 ${task.reminderAt ? "text-[#7c6af0]" : "text-[#444]"}`}
                  aria-label="Set reminder"
                >
                  <BellIcon />
                </button>
                <button
                  onClick={() => startEditing(task)}
                  className="flex items-center justify-center w-[26px] h-[26px] rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-white/5 hover:text-[#7c6af0] text-[#444]"
                  aria-label="Edit task"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="flex items-center justify-center w-[26px] h-[26px] rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 text-[#444]"
                  aria-label="Delete task"
                >
                  <TrashIcon />
                </button>
              </div>

              {/* ── Mobile: vertical dots menu toggle ────────────── */}
              <button
                className="sm:hidden flex items-center justify-center w-[28px] h-[28px] rounded-lg text-[#555] hover:text-[#aaa] hover:bg-white/5 transition-colors shrink-0"
                onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}
                aria-label="More actions"
              >
                {/* Three vertical dots */}
                <svg width="14" height="14" viewBox="0 0 4 16" fill="currentColor">
                  <circle cx="2" cy="2" r="1.5" />
                  <circle cx="2" cy="8" r="1.5" />
                  <circle cx="2" cy="14" r="1.5" />
                </svg>
              </button>
            </div>

            {/* ── Mobile action strip (slides in below row) ─────── */}
            {openMenuId === task.id && (
              <div
                className="sm:hidden flex items-center gap-2 px-4 pb-3"
                style={{ borderTop: "1px solid #1a1a1a" }}
              >
                <button
                  onClick={() => setReminderEditingId(reminderEditingId === task.id ? null : task.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${task.reminderAt ? "bg-[#7c6af0]/15 text-[#7c6af0] border border-[#7c6af0]/20" : "bg-white/[0.04] text-[#666] border border-[#222]"}`}
                >
                  <BellIcon /> Reminder
                </button>
                <button
                  onClick={() => startEditing(task)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-white/[0.04] text-[#666] border border-[#222] transition-all hover:text-[#7c6af0] hover:border-[#7c6af0]/20"
                >
                  <EditIcon /> Edit
                </button>
                <button
                  onClick={() => { deleteTask(task.id); setOpenMenuId(null); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-red-500/5 text-red-500/60 border border-red-500/10 transition-all hover:bg-red-500/10 hover:text-red-400"
                >
                  <TrashIcon /> Delete
                </button>

                {/* Tag shown in mobile strip */}
                <span
                  className="ml-auto rounded px-2 py-1 shrink-0"
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    backgroundColor: task.tag === "WORK" ? "#1a1f2e" : "#1e1a2a",
                    color: task.tag === "WORK" ? "#4a7abf" : "#8a5abf",
                    border: `1px solid ${task.tag === "WORK" ? "#1e2a42" : "#2a1e42"}`,
                  }}
                >
                  {task.tag}
                </span>
              </div>
            )}

            {/* Reminder Picker Popup */}
            {reminderEditingId === task.id && (
              <div className="absolute right-0 top-full mt-2 z-50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                <ReminderPicker
                  initialValue={task.reminderAt}
                  onSave={(val) => handleSetReminder(task.id, val)}
                  onClose={() => setReminderEditingId(null)}
                />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
