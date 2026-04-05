"use client";

import Link from "next/link";
import { useLebenStore, Habit } from "@/store/useStore";

export default function HabitStreaks() {
  const habits = useLebenStore((s: any) => s.habits) as Habit[];
  const toggleHabit = useLebenStore((s: any) => s.toggleHabit);

  return (
    <div
      className="rounded-2xl p-6 flex flex-col"
      style={{
        background: "linear-gradient(145deg, #121212 0%, #0e0e0e 100%)",
        border: "1px solid #1e1e1e",
        minHeight: "200px",
      }}
    >
      <h3
        className="font-semibold text-white mb-5"
        style={{ fontSize: "15px" }}
      >
        Habit Streaks
      </h3>

      {habits.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-4 gap-3">
          <p style={{ fontSize: "11px", color: "#333", marginTop: "8px" }}>
            No habits tracked yet
          </p>
          <Link
            href="/habits"
            className="px-4 py-1.5 rounded-lg transition-opacity hover:opacity-80"
            style={{
              fontSize: "11px",
              color: "#666",
              border: "1px solid #222",
              textDecoration: "none",
            }}
          >
            Set up habits
          </Link>
        </div>
      ) : (
        <div className="w-full flex-1 flex flex-col gap-4">
          {habits.slice(0, 3).map((h: Habit) => (
            <div key={h.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="rounded-lg flex items-center justify-center text-lg"
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: "#181818",
                    border: "1px solid #1e1e1e",
                    color: h.color,
                  }}
                >
                  {h.icon}
                </div>
                <div className="space-y-1">
                  <div
                    className="font-medium text-white"
                    style={{ fontSize: "13px" }}
                  >
                    {h.label}
                  </div>
                  <div style={{ fontSize: "11px", color: "#666" }}>
                    🔥 {h.streak} day streak
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleHabit(h.id)}
                className="rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
                style={{
                  width: "42px",
                  height: "26px",
                  border: "1px solid #1e1e1e",
                  backgroundColor: h.checked ? h.color : "#161616",
                  color: h.checked ? "#fff" : "#555",
                  fontSize: "12px",
                }}
              >
                {h.checked ? "✓" : "○"}
              </button>
            </div>
          ))}
          {habits.length > 3 && (
            <Link
              href="/habits"
              className="mt-auto pt-2 text-center transition-opacity hover:opacity-80"
              style={{
                fontSize: "11px",
                color: "#666",
                textDecoration: "none",
              }}
            >
              See all {habits.length} habits
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
