"use client";

import { useState } from "react";
import { HABIT_COLORS, HABIT_ICONS } from "@/constants/habits";
import type { HabitCard } from "../../utils/habits.types";

interface AddHabitModalProps {
  onAdd: (h: HabitCard) => void;
  onClose: () => void;
}

export default function AddHabitModal({ onAdd, onClose }: AddHabitModalProps) {
  const [label, setLabel] = useState("");
  const [sub, setSub] = useState("");
  const [icon, setIcon] = useState("🎯");
  const [color, setColor] = useState(HABIT_COLORS[0]);

  const handleAdd = () => {
    if (!label.trim()) return;
    onAdd({
      id: `h${Date.now()}`,
      label: label.trim(),
      sub: sub.trim() || "Daily habit",
      streak: 0,
      longestStreak: 0,
      color,
      icon,
      checked: false,
      history: [],
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="rounded-2xl p-6 w-full max-w-sm"
        style={{ backgroundColor: "#111", border: "1px solid #2a2a2a" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-white" style={{ fontSize: "16px" }}>
            New Habit
          </h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-all hover:opacity-70"
            style={{
              width: "28px",
              height: "28px",
              backgroundColor: "#1a1a1a",
              border: "1px solid #2a2a2a",
              color: "#666",
              fontSize: "16px",
              lineHeight: 1,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p
          style={{
            fontSize: "11px",
            color: "#555",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Icon
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {HABIT_ICONS.map((ic) => (
            <button
              key={ic}
              onClick={() => setIcon(ic)}
              className="flex items-center justify-center rounded-lg transition-all"
              style={{
                width: "36px",
                height: "36px",
                fontSize: "18px",
                backgroundColor: icon === ic ? "#2a2a3a" : "#1a1a1a",
                border: icon === ic ? "1px solid #7c6af0" : "1px solid #2a2a2a",
              }}
            >
              {ic}
            </button>
          ))}
        </div>

        <p
          style={{
            fontSize: "11px",
            color: "#555",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Color
        </p>
        <div className="flex gap-2 mb-4">
          {HABIT_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className="rounded-full transition-all"
              style={{
                width: "22px",
                height: "22px",
                backgroundColor: c,
                outline: color === c ? `2px solid ${c}` : "none",
                outlineOffset: "2px",
              }}
            />
          ))}
        </div>

        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Habit name (e.g. Cold Shower)"
          className="w-full rounded-xl px-4 py-3 text-white outline-none mb-3 placeholder:text-gray-600"
          style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #2a2a2a",
            fontSize: "13px",
          }}
        />
        <input
          value={sub}
          onChange={(e) => setSub(e.target.value)}
          placeholder="Target (e.g. 5 mins every morning)"
          className="w-full rounded-xl px-4 py-3 text-white outline-none mb-5 placeholder:text-gray-600"
          style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #2a2a2a",
            fontSize: "13px",
          }}
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl py-2.5 font-semibold"
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #2a2a2a",
              color: "#666",
              fontSize: "13px",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 rounded-xl py-2.5 font-semibold"
            style={{
              backgroundColor: label.trim() ? "#7c6af0" : "#2a2a2a",
              color: label.trim() ? "#fff" : "#555",
              fontSize: "13px",
            }}
          >
            Add Habit
          </button>
        </div>
      </div>
    </div>
  );
}
