"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLebenStore, Habit } from "@/store/useStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@/constants/Icons";

export default function HabitStreaks() {
  const habits = useLebenStore((s: any) => s.habits) as Habit[];
  const toggleHabit = useLebenStore((s: any) => s.toggleHabit);
  const updateHabit = useLebenStore((s: any) => s.updateHabit);
  const [user, setUser] = useState<any>(null);
  const [reminderHabit, setReminderHabit] = useState<string | null>(null);
  const [reminderTime, setReminderTime] = useState<string>("");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  const handleSetReminder = (habitId: string) => {
    if (!reminderTime) return;

    const [hours, minutes] = reminderTime.split(":").map(Number);
    const now = new Date();
    const reminderDate = new Date();
    reminderDate.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, set it for tomorrow
    if (reminderDate <= now) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }

    updateHabit(habitId, { reminderAt: reminderDate.toISOString() });
    setReminderHabit(null);
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
          Habit Streaks
        </h3>
        {!loading && habits.length > 0 && (
          <Link
            href="/habits"
            className="text-[#7c6af0] hover:underline"
            style={{ fontSize: "11px", fontWeight: 600 }}
          >
            Go to Habits
          </Link>
        )}
      </div>

      {habits.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-4 gap-3">
          <PlusIcon />
          <p style={{ fontSize: "11px", color: "#333" }}>
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
            <div key={h.id}>
              <div className="flex items-center justify-between">
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setReminderHabit(reminderHabit === h.id ? null : h.id)
                    }
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "6px",
                      border: h.reminderAt
                        ? "1px solid #7c6af0"
                        : "1px solid transparent",
                      backgroundColor: h.reminderAt
                        ? "rgba(124, 106, 240, 0.15)"
                        : "transparent",
                      color: h.reminderAt ? "#7c6af0" : "#444",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    title={
                      h.reminderAt
                        ? `Reminder set for ${new Date(h.reminderAt).toLocaleTimeString()}`
                        : "Set reminder"
                    }
                  >
                    🔔
                  </button>
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
              </div>

              {/* Reminder time picker */}
              {reminderHabit === h.id && (
                <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
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
                    onClick={() => handleSetReminder(h.id)}
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
                  {h.reminderAt && (
                    <button
                      onClick={() =>
                        updateHabit(h.id, { reminderAt: undefined })
                      }
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
