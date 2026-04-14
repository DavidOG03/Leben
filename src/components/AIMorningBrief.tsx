"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useLebenStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowRightIcon, SparkleIcon } from "@/constants/Icons";
import AITokenUsage from "./AITokenUsage";
import LimitModal from "./LimitModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BriefData {
  summary: string;
  insights: string[];
}

// ─── Data fetcher (calls secure server-side API route) ───────────────────────

async function fetchMorningBrief(
  tasks: object[],
  habits: object[],
  goals: object[],
  forceRefresh = false,
): Promise<BriefData> {
  const res = await fetch("/api/ai/brief", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tasks, habits, goals, forceRefresh }),
  });

  if (res.status === 429) {
    const { error } = await res.json();
    throw new Error(error ?? "Daily AI limit reached.");
  }
  if (res.status === 503) {
    const { error } = await res.json().catch(() => ({}));
    throw Object.assign(
      new Error(error ?? "AI is busy. Please try again shortly."),
      { code: 503 },
    );
  }
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({}));
    throw new Error(error ?? "Failed to generate brief.");
  }

  const { text } = await res.json();
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as BriefData;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AIMorningBrief() {
  const { tasks, habits, goals } = useLebenStore();
  const router = useRouter();

  const [brief, setBrief] = useState<BriefData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const hasData = tasks.length > 0 || habits.length > 0 || goals.length > 0;

  // Detect auth state
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // Countdown ticker removed — rate limiting now handled server-side

  const handleGenerate = useCallback(
    async (forceRefresh = false) => {
      // Guest guard
      if (!user) {
        router.push("/auth/signin");
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const result = await fetchMorningBrief(
          tasks,
          habits,
          goals,
          forceRefresh,
        );
        setBrief(result);
        setIsUnavailable(false);
      } catch (err: any) {
        console.error("Morning brief failed:", err);
        if (err?.message?.includes("limit reached")) {
          setShowLimitModal(true);
        } else if (
          (err as any)?.code === 503 ||
          err?.message?.toLowerCase().includes("high demand") ||
          err?.message?.toLowerCase().includes("busy")
        ) {
          setIsUnavailable(true);
          setError(null);
        } else {
          setIsUnavailable(false);
        }
        setError(err?.message ?? "Couldn't generate brief. Try again.");
      } finally {
        setLoading(false);
      }
    },
    [tasks, habits, goals, user, router],
  );

  const currentDataStr = JSON.stringify({ tasks, habits, goals });
  const isFirstRun = useRef(true);
  const prevTasksCount = useRef(tasks.length);

  useEffect(() => {
    if (!hasData || !user) {
      setBrief(null);
      return;
    }

    if (isFirstRun.current) {
      isFirstRun.current = false;
      prevTasksCount.current = tasks.length;
      handleGenerate();
    } else {
      if (tasks.length !== prevTasksCount.current) {
        prevTasksCount.current = tasks.length;
        const timeoutId = setTimeout(() => {
          handleGenerate();
        }, 2000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [currentDataStr, hasData, handleGenerate, user, tasks.length]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <LimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
      />
      <div
        className="rounded-2xl p-7 flex flex-col justify-between h-full"
        style={{
          background: "linear-gradient(145deg, #141420 0%, #0f0f18 100%)",
          border: "1px solid #252535",
          minHeight: "260px",
        }}
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-5">
            <div className="flex items-center gap-2">
              <SparkleIcon />
              <span
                className="uppercase tracking-widest font-medium"
                style={{
                  fontSize: "12px",
                  color: "#7c6af0",
                  letterSpacing: "0.14em",
                }}
              >
                AI MORNING BRIEF
              </span>
            </div>
            <AITokenUsage />
          </div>

          {/* Headline */}
          <h2
            className="font-bold leading-tight mb-4"
            style={{
              fontSize: "26px",
              letterSpacing: "-0.02em",
              color: "#f0f0f0",
            }}
          >
            {user ? (
              hasData ? (
                brief ? (
                  brief.summary
                ) : (
                  "Ready to plan your day?"
                )
              ) : (
                <>
                  Welcome to <span style={{ color: "#7c6af0" }}>Leben.</span>
                </>
              )
            ) : (
              <>
                Unlock AI <span style={{ color: "#7c6af0" }}>Insights.</span>
              </>
            )}
          </h2>

          {/* Content area */}
          {user ? (
            hasData ? (
              <div className="space-y-4">
                {loading && (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-3 rounded bg-white/5 w-3/4" />
                    <div className="h-3 rounded bg-white/5 w-1/2" />
                  </div>
                )}

                {error && !loading && !isUnavailable && (
                  <p style={{ fontSize: "13px", color: "#f87171" }}>{error}</p>
                )}

                {isUnavailable && !loading && (
                  <div
                    className="rounded-xl p-4"
                    style={{
                      backgroundColor: "rgba(250, 200, 80, 0.06)",
                      border: "1px solid rgba(250, 200, 80, 0.15)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#facc50",
                        lineHeight: 1.6,
                      }}
                    >
                      ⏳ The AI is experiencing high demand right now. This is
                      temporary — try again in a moment.
                    </p>
                  </div>
                )}

                {brief && !loading && (
                  <div className="flex flex-wrap gap-2">
                    {brief.insights.map((insight, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-md text-[10px] border font-medium tracking-tight"
                        style={{
                          background: "rgba(124, 106, 240, 0.08)",
                          color: "#7c6af0",
                          borderColor: "rgba(124, 106, 240, 0.2)",
                        }}
                      >
                        {insight.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}

                {!brief && !loading && !error && (
                  <p
                    style={{ fontSize: "13px", color: "#555", lineHeight: 1.7 }}
                  >
                    Your AI morning brief will appear here. Hit the button below
                    to generate it.
                  </p>
                )}
              </div>
            ) : (
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7 }}>
                Your AI morning brief will appear here once you&apos;ve added
                tasks, habits, and goals. Start by creating your first task.
              </p>
            )
          ) : (
            <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7 }}>
              Sign in to analyze your productivity, get daily insights, and let
              AI organize your schedule for maximum energy.
            </p>
          )}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3 mt-6">
          {user ? (
            hasData ? (
              <>
                {!brief && (error || isUnavailable) && (
                  <button
                    onClick={() => handleGenerate(true)}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg, #7c6af0, #5a4fd4)",
                      boxShadow: "0 10px 20px -10px rgba(124, 106, 240, 0.4)",
                      color: "#fff",
                      fontSize: "14px",
                    }}
                  >
                    {loading ? "Generating..." : "Retry Brief"}
                    {!loading && <SparkleIcon />}
                  </button>
                )}

                {brief && (
                  <Link
                    href="/planner"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(135deg, #7c6af0, #5a4fd4)",
                      boxShadow: "0 10px 20px -10px rgba(124, 106, 240, 0.4)",
                      color: "#fff",
                      fontSize: "14px",
                      textDecoration: "none",
                    }}
                  >
                    Plan My Day
                    <ArrowRightIcon />
                  </Link>
                )}

                {brief && !loading && (
                  <button
                    onClick={() => handleGenerate(true)}
                    className="px-4 py-3 rounded-xl font-medium transition-opacity hover:opacity-70"
                    style={{
                      background: "transparent",
                      border: "1px solid #2a2a2a",
                      color: "#555",
                      fontSize: "13px",
                    }}
                  >
                    Regenerate
                  </button>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/tasks"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-opacity hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #2e2e2e, #1e1e1e)",
                    border: "1px solid #3a3a3a",
                    color: "#f0f0f0",
                    fontSize: "13px",
                    textDecoration: "none",
                  }}
                >
                  Create first task
                  <ArrowRightIcon />
                </Link>
                <Link
                  href="/habits"
                  className="px-5 py-2.5 rounded-lg font-medium transition-opacity hover:opacity-70"
                  style={{
                    background: "transparent",
                    border: "1px solid #2a2a2a",
                    color: "#666",
                    fontSize: "13px",
                    textDecoration: "none",
                  }}
                >
                  Set up habits
                </Link>
              </>
            )
          ) : (
            <Link
              href="/auth/signin"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #7c6af0, #5a4fd4)",
                boxShadow: "0 10px 20px -10px rgba(124, 106, 240, 0.4)",
                color: "#fff",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Sign In to Unlock
              <ArrowRightIcon />
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
