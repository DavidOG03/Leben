"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLebenStore } from "@/store/useStore";
import { deriveGoalStats, Goal, Milestone } from "@/utils/goals.types";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GoalProgress() {
  const goals = useLebenStore((s: any) => s.goals) as Goal[];
  const toggleMilestone = useLebenStore((s: any) => s.toggleMilestone);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

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
        Goal Progress
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
            Vision requires focus.
            <br />
            Sign in to track your goals.
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
      ) : goals.length === 0 ? (
        <div className="flex flex-col items-center gap-2 mt-auto pt-2">
          <p style={{ fontSize: "11px", color: "#333" }}>No goals added yet</p>
          <Link
            href="/goals"
            className="px-4 py-1.5 rounded-lg transition-opacity hover:opacity-80"
            style={{
              fontSize: "11px",
              color: "#666",
              border: "1px solid #222",
              textDecoration: "none",
            }}
          >
            Create a goal
          </Link>
        </div>
      ) : (
        <div className="space-y-6 flex-1 pr-1">
          {goals.slice(0, 2).map((g) => {
            const { progress } = deriveGoalStats(g);
            return (
              <div key={g.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "14px" }}>{g.icon}</span>
                    <span
                      className="font-medium text-white truncate"
                      style={{ fontSize: "13px", maxWidth: "120px" }}
                    >
                      {g.title}
                    </span>
                  </div>
                  <span
                    style={{ fontSize: "11px", color: "#888", fontWeight: 500 }}
                  >
                    {progress}%
                  </span>
                </div>
                <div
                  className="rounded-full overflow-hidden mb-3"
                  style={{ height: "3px", backgroundColor: "#1e1e1e" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      background: "linear-gradient(90deg,#5a4fd4,#7c6af0)",
                    }}
                  />
                </div>
                {/* Milestones toggles (limit to first 2 active or pending) */}
                <div className="space-y-1.5">
                  {g.milestones.slice(0, 3).map((m: Milestone) => (
                    <button
                      key={m.id}
                      onClick={() => toggleMilestone(g.id, m.id)}
                      className="flex items-center gap-2 w-full text-left transition-colors hover:opacity-80"
                    >
                      <div
                        className="flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-200"
                        style={{
                          width: "14px",
                          height: "14px",
                          backgroundColor: m.done
                            ? "rgba(124,106,240,0.2)"
                            : "transparent",
                          border: m.done
                            ? "1px solid #7c6af0"
                            : "1px solid #333",
                        }}
                      >
                        {m.done && (
                          <svg
                            width="7"
                            height="7"
                            viewBox="0 0 8 8"
                            fill="none"
                          >
                            <path
                              d="M1.5 4l1.8 1.8L6.5 2"
                              stroke="#7c6af0"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className="truncate"
                        style={{
                          fontSize: "11px",
                          color: m.done ? "#888" : "#666",
                        }}
                      >
                        {m.label}
                      </span>
                    </button>
                  ))}
                  <button
                    className="flex items-center gap-2 w-full text-left transition-colors hover:opacity-80"
                    onClick={() => {
                      router.push("/goals");
                    }}
                  >
                    <span
                      className="truncate"
                      style={{
                        fontSize: "11px",
                        color: "#666",
                      }}
                    >
                      {g.milestones.length - 1} more
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
          {goals.length > 2 && (
            <div className="text-center mt-2">
              <Link
                href="/goals"
                className="transition-opacity hover:opacity-80"
                style={{
                  fontSize: "11px",
                  color: "#666",
                  textDecoration: "none",
                }}
              >
                See all {goals.length} goals
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
