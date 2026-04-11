"use client";

import { useLebenStore, Task } from "@/store/useStore";
import { CheckIcon, TrashIcon, EditIcon } from "../../constants/Icons";
import { useState, useRef, useEffect } from "react";

export default function KanbanView() {
  const tasks = useLebenStore((s) => s.tasks);
  const toggleTask = useLebenStore((s) => s.toggleTask);
  const deleteTask = useLebenStore((s) => s.deleteTask);
  const updateTask = useLebenStore((s) => s.updateTask);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = () => {
    if (editingId && editTitle.trim()) {
      updateTask(editingId, { title: editTitle.trim() });
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const columns = [
    { title: "To Do", filter: (t: Task) => !t.completed },
    { title: "Completed", filter: (t: Task) => t.completed },
  ];

  return (
    <div className="grid grid-cols-2 gap-6 h-full min-h-[400px]">
      {columns.map((col) => {
        const colTasks = tasks.filter(col.filter);
        return (
          <div key={col.title} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#444]">
                {col.title}{" "}
                <span className="ml-1 text-[#2a2a2a]">({colTasks.length})</span>
              </h3>
            </div>

            <div
              className="flex-1 rounded-2xl p-3 flex flex-col gap-3"
              style={{ backgroundColor: "#111", border: "1px solid #1a1a1a" }}
            >
              {colTasks.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p style={{ fontSize: "11px", color: "#2a2a2a" }}>No tasks</p>
                </div>
              ) : (
                colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl transition-all group relative"
                    style={{
                      backgroundColor: "#161616",
                      border: "1px solid #222",
                    }}
                    onMouseEnter={() => setHoveredId(task.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              task.priority === "high"
                                ? "#e85555"
                                : task.priority === "low"
                                  ? "#55e855"
                                  : "#e8a855",
                            boxShadow: `0 0 6px ${task.priority === "high" ? "#e85555" : task.priority === "low" ? "#55e855" : "#e8a855"}44`,
                          }}
                        />
                        <span
                          className="rounded px-1.5 py-0.5"
                          style={{
                            fontSize: "9px",
                            fontWeight: 700,
                            letterSpacing: "0.02em",
                            backgroundColor:
                              task.tag === "WORK"
                                ? "rgba(74, 122, 191, 0.1)"
                                : "rgba(138, 90, 191, 0.1)",
                            color: task.tag === "WORK" ? "#4a7abf" : "#8a5abf",
                            border: `1px solid ${task.tag === "WORK" ? "rgba(74, 122, 191, 0.2)" : "rgba(138, 90, 191, 0.2)"}`,
                          }}
                        >
                          {task.tag}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Edit button (optional hidden, but maybe good for consistency) */}
                        <button
                          onClick={() => startEditing(task)}
                          className="flex items-center justify-center p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-white/5 hover:text-[#7c6af0] text-[#333]"
                          aria-label="Edit task"
                        >
                          <EditIcon />
                        </button>

                        <button
                          onClick={() => toggleTask(task.id)}
                          className="flex items-center justify-center transition-all"
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "5px",
                            border: task.completed
                              ? "1px solid #3a7a4a"
                              : "1px solid #333",
                            backgroundColor: task.completed
                              ? "#1e3d26"
                              : "#1a1a1a",
                            color: task.completed ? "#4caf70" : "transparent",
                          }}
                        >
                          {task.completed && <CheckIcon />}
                        </button>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className="flex items-center justify-center p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 text-[#333]"
                          aria-label="Delete task"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>

                    <p
                      onDoubleClick={() => startEditing(task)}
                      style={{
                        fontSize: "13px",
                        color: task.completed ? "#555" : "#eee",
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                        lineHeight: 1.5,
                        marginBottom: "4px",
                      }}
                    >
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
                          className="w-full bg-transparent text-[#eee] outline-none border-b border-[#3a3a9e]"
                        />
                      ) : (
                        task.title
                      )}
                    </p>

                    <p
                      style={{
                        fontSize: "10px",
                        color: "#333",
                        marginTop: "8px",
                      }}
                    >
                      {task.date}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
