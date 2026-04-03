import React from "react";
import { HabitCard, WeeklyProgressProps } from "../../utils/habits.types";

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({
  habits,
}: WeeklyProgressProps) => {
  return (
    <>
      {/* Weekly Progress */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "#111", border: "1px solid #1e1e1e" }}
      >
        <p
          className="font-semibold text-white mb-4"
          style={{ fontSize: "14px" }}
        >
          Weekly Progress
        </p>
        {habits.length === 0 ? (
          <>
            <div
              className="flex items-end gap-2 mb-3"
              style={{ height: "70px" }}
            >
              {[0.3, 0.45, 0.4, 0.55, 0.35, 0.25, 0.2].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${h * 100}%`,
                    backgroundColor: "#1a1a1a",
                    borderRadius: "3px 3px 2px 2px",
                  }}
                />
              ))}
            </div>
            <p style={{ fontSize: "12px", color: "#333" }}>
              No data yet — start checking off habits
            </p>
          </>
        ) : (
          <>
            <div
              className="flex items-end gap-2 mb-4"
              style={{ height: "70px" }}
            >
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
                const h = [30, 45, 40, 55, 85, 35, 20][i];
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full"
                      style={{
                        height: `${h}%`,
                        background:
                          i === 4
                            ? "linear-gradient(180deg,#9d8ff5,#7c6af0)"
                            : "#1e1e1e",
                        borderRadius: "3px 3px 2px 2px",
                      }}
                    />
                    <span style={{ fontSize: "9px", color: "#444" }}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span style={{ fontSize: "12px", color: "#555" }}>
                  Daily Average
                </span>
                <span style={{ fontSize: "12px", color: "#aaa" }}>
                  {(habits.length * 0.7).toFixed(1)} habits
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: "12px", color: "#555" }}>
                  Best Streak
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#7c6af0",
                    fontWeight: 600,
                  }}
                >
                  {Math.max(
                    0,
                    ...habits.map((h: HabitCard) => h.longestStreak),
                  )}{" "}
                  days
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default WeeklyProgress;
