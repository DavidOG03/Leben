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
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  return (
    <div
      className="rounded-2xl p-6 flex flex-col"
      style={{
        background: "linear-gradient(145deg, #121212 0%, #0e0e0e 100%)",
        border: "1px solid #1e1e1e",
        minHeight: "200px",
      }}
      role="button"
      aria-roledescription="go to task"
      onClick={() => router.push("/habits")}
    >
      <h3
        className="font-semibold text-white mb-5"
        style={{ fontSize: "15px" }}
      >
        Habit Streaks
      </h3>

      {!user ? (
        <div className="flex-1 flex flex-col items-center justify-center py-4 gap-3">
          <p
            style={{
              fontSize: "12px",
              color: "#555",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            Consistency is key.
            <br />
            Sign in to track your streaks.
          </p>
          <Link
            href="/auth/signin"
            className="px-4 py-2 rounded-lg transition-colors hover:bg-[#7c6af0]/10"
            style={{
              fontSize: "12px",
              color: "#7c6af0",
              border: "1px solid #7c6af040",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Sign In to Track
          </Link>
        </div>
      ) : habits.length === 0 ? (
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
                    🔥 {h.longestStreak} day streak
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
