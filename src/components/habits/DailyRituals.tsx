import React, { useState } from "react";
import { GhostCard } from "./GhostCards";
import type { DailyRitualProps, HabitCard } from "../../utils/habits.types";
import { useLebenStore } from "@/store/useStore";

const DailyRituals: React.FC<DailyRitualProps> = ({
  setShowAddHabit,
  habits,
  onSelectedHabitId,
  activeHabit,
  toggleHabit,
}: DailyRitualProps) => {
  const removeHabit = useLebenStore((s: any) => s.removeHabit);
  const updateHabit = useLebenStore((s: any) => s.updateHabit);

  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editSub, setEditSub] = useState("");

  const startEdit = (h: HabitCard) => {
    setEditingHabitId(h.id);
    setEditLabel(h.label);
    setEditSub(h.sub);
  };

  const handleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateHabit(id, { label: editLabel, sub: editSub });
    setEditingHabitId(null);
  };

  return (
    <>
      {/* Daily Rituals */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className="font-bold text-white"
              style={{ fontSize: "18px", letterSpacing: "-0.01em" }}
            >
              Daily Rituals
            </h2>
            <p style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>
              Consistency is the bridge between goals and accomplishment.
            </p>
          </div>
          <button
            onClick={() => setShowAddHabit(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all hover:opacity-80"
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #2a2a2a",
              color: "#ccc",
              fontSize: "12px",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path
                d="M5.5 1v9M1 5.5h9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            Add Habit
          </button>
        </div>

        {habits.length === 0 ? (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid #1e1e1e", backgroundColor: "#131313" }}
          >
            <div
              className="grid gap-4 p-4"
              style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
            >
              {[1, 0.65, 0.35].map((op, i) => (
                <GhostCard key={i} opacity={op} />
              ))}
            </div>
            <div
              className="flex flex-col items-center justify-center py-8 gap-3"
              style={{ borderTop: "1px solid #181818" }}
            >
              <span style={{ fontSize: "28px" }}>🌱</span>
              <p
                className="font-medium"
                style={{ fontSize: "13px", color: "#333" }}
              >
                No habits yet
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#2a2a2a",
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                Click &ldquo;Add Habit&rdquo; above
                <br />
                to build your first ritual.
              </p>
            </div>
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            }}
          >
            {habits.map((habit) => (
              <div
                key={habit.id}
                onClick={() => onSelectedHabitId(habit.id)}
                className="rounded-2xl p-5 cursor-pointer transition-all"
                style={{
                  backgroundColor: "#111",
                  border:
                    activeHabit?.id === habit.id
                      ? `1px solid ${habit.color}55`
                      : "1px solid #1e1e1e",
                  boxShadow:
                    activeHabit?.id === habit.id
                      ? `0 0 0 1px ${habit.color}15`
                      : "none",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="flex items-center justify-center rounded-xl"
                    style={{
                      width: "42px",
                      height: "42px",
                      background: `linear-gradient(135deg,${habit.color}18,${habit.color}08)`,
                      border: `1px solid ${habit.color}22`,
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{habit.icon}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(habit);
                      }}
                      className="hover:opacity-80"
                      style={{
                        color: "#888",
                        fontSize: "14px",
                        background: "transparent",
                        border: "none",
                      }}
                      title="Edit Habit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeHabit(habit.id);
                      }}
                      className="hover:opacity-80"
                      style={{
                        color: "#888",
                        fontSize: "14px",
                        background: "transparent",
                        border: "none",
                      }}
                      title="Delete Habit"
                    >
                      🗑️
                    </button>
                    <div
                      className="flex items-center gap-1 px-2 py-1 rounded-lg"
                      style={{
                        backgroundColor: "rgba(124,106,240,0.08)",
                        border: "1px solid rgba(124,106,240,0.15)",
                      }}
                    >
                      <span style={{ fontSize: "11px" }}>🔥</span>
                      <span
                        className="font-semibold text-white"
                        style={{ fontSize: "12px" }}
                      >
                        {habit.streak}
                      </span>
                    </div>
                  </div>
                </div>

                {editingHabitId === habit.id ? (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-col gap-2 mb-4"
                  >
                    <input
                      autoFocus
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className="rounded-lg px-2 py-1 text-white outline-none"
                      style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        fontSize: "14px",
                      }}
                      placeholder="Habit Label"
                    />
                    <input
                      value={editSub}
                      onChange={(e) => setEditSub(e.target.value)}
                      className="rounded-lg px-2 py-1 text-white outline-none"
                      style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        fontSize: "11px",
                      }}
                      placeholder="Subtext"
                    />
                    <button
                      onClick={(e) => handleSave(habit.id, e)}
                      className="rounded-lg px-2 py-1 font-semibold text-white mt-1 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: habit.color, fontSize: "12px" }}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <p
                      className="font-bold text-white mb-0.5"
                      style={{ fontSize: "15px" }}
                    >
                      {habit.label}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#555",
                        marginBottom: "4px",
                      }}
                    >
                      {habit.sub}
                    </p>
                  </>
                )}
                <p
                  style={{
                    fontSize: "10px",
                    color: "#444",
                    marginBottom: "14px",
                  }}
                >
                  Best: {habit.longestStreak}d
                </p>
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontSize: "10px",
                      color: habit.checked ? habit.color : "#444",
                    }}
                  >
                    {habit.checked ? "Done today ✓" : "Not yet"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHabit(habit.id);
                    }}
                    className="flex items-center justify-center rounded-full transition-all"
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: habit.checked
                        ? `${habit.color}22`
                        : "transparent",
                      border: habit.checked
                        ? `1.5px solid ${habit.color}`
                        : "1.5px solid #333",
                    }}
                  >
                    {habit.checked && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke={habit.color}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DailyRituals;
