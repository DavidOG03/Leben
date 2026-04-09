"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useLebenStore } from "@/store/useStore";
import { GoogleGenAI } from "@google/genai";
import { executeWithRateLimit, generateOpenAiRateLimitError } from "@/lib/ai/withRateLimit";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BriefData {
  summary: string;
  insights: string[];
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M7 1l1.5 4.5L13 7l-4.5 1.5L7 13l-1.5-4.5L1 7l4.5-1.5L7 1z"
      stroke="#7c6af0"
      strokeWidth="1.2"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M2 7h10M8 3l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Data fetcher ─────────────────────────────────────────────────────────────

async function fetchMorningBrief(
  tasks: object[],
  habits: object[],
  goals: object[],
  onWait?: (sec: number) => void
): Promise<BriefData> {
  const prompt = `
You are an AI productivity assistant for an app called Leben.

Given the user's current tasks, habits, and goals, write a short morning brief.

Respond ONLY with valid JSON. No markdown, no backticks, no explanation.

{
  "summary": "One sentence describing the day ahead based on their actual tasks",
  "insights": [
    "Insight 1 - specific to their data, max 12 words",
    "Insight 2 - specific to their data, max 12 words"
  ]
}

User data:
Tasks: ${JSON.stringify(tasks)}
Habits: ${JSON.stringify(habits)}
Goals: ${JSON.stringify(goals)}
`;

  const geminiCall = async () => {
    const ai = new GoogleGenAI({
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
    });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const raw = response.text ?? "";
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean) as BriefData;
  };

  const openAiCall = async () => {
    const openAiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: prompt }],
        }),
      },
    );

    if (!openAiResponse.ok) {
      throw generateOpenAiRateLimitError(openAiResponse);
    }

    const data = await openAiResponse.json();
    const raw = data.choices[0].message.content ?? "";
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean) as BriefData;
  };

  return executeWithRateLimit(geminiCall, openAiCall, onWait);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AIMorningBrief() {
  const { tasks, habits, goals } = useLebenStore();
  const router = useRouter();

  const [brief, setBrief] = useState<BriefData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waitCountdown, setWaitCountdown] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  const hasData = tasks.length > 0 || habits.length > 0 || goals.length > 0;

  // Detect auth state
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // Countdown ticker
  useEffect(() => {
    if (waitCountdown !== null && waitCountdown > 0) {
      const timer = setTimeout(() => setWaitCountdown(waitCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (waitCountdown === 0) {
      setWaitCountdown(null);
    }
  }, [waitCountdown]);

  const handleGenerate = useCallback(async () => {
    // Guest guard
    if (!user) {
      router.push("/auth/signin");
      return;
    }
    setLoading(true);
    setError(null);
    setWaitCountdown(null);

    try {
      const result = await fetchMorningBrief(tasks, habits, goals, (sec) =>
        setWaitCountdown(sec)
      );
      setBrief(result);
    } catch (err) {
      console.error("Morning brief failed:", err);
      setError("Couldn't generate brief. Try again.");
    } finally {
      setLoading(false);
    }
  }, [tasks, habits, goals, user, router]);

  const currentDataStr = JSON.stringify({ tasks, habits, goals });
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (!hasData || !user) {
      setBrief(null);
      return;
    }

    if (isFirstRun.current) {
      isFirstRun.current = false;
      handleGenerate();
    } else {
      const timeoutId = setTimeout(() => {
        handleGenerate();
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [currentDataStr, hasData, handleGenerate, user]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="rounded-2xl p-7 flex flex-col justify-between"
      style={{
        background: "linear-gradient(145deg, #141420 0%, #0f0f18 100%)",
        border: "1px solid #252535",
        minHeight: "260px",
      }}
    >
      <div>
        <div className="flex items-center gap-2 mb-5">
          {/* <SparkleIcon /> */}
          <span
            className="uppercase tracking-widest font-medium"
            style={{
              fontSize: "12px",
              color: "#7c6af0",
              letterSpacing: "0.14em",
            }}
          >
            Welcome to Leben
          </span>
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
              brief ? brief.summary : "Ready to plan your day?"
            ) : (
              <>Welcome to <span style={{ color: "#7c6af0" }}>Leben.</span></>
            )
          ) : (
            <>Unlock AI <span style={{ color: "#7c6af0" }}>Insights.</span></>
          )}
        </h2>

        {/* Content area */}
        {user ? (
          hasData ? (
            <div className="space-y-4">
              {waitCountdown !== null && waitCountdown > 0 && (
                <div
                  className="px-3 py-2 text-[12px] font-medium border rounded-lg animate-pulse"
                  style={{
                    color: "#d97706",
                    backgroundColor: "rgba(245, 158, 11, 0.05)",
                    borderColor: "rgba(245, 158, 11, 0.2)"
                  }}
                >
                  Quota exceeded. Analyzing gently... retrying in {waitCountdown}s.
                </div>
              )}

              {loading && waitCountdown === null && (
                <div className="space-y-2 animate-pulse">
                  <div className="h-3 rounded bg-white/5 w-3/4" />
                  <div className="h-3 rounded bg-white/5 w-1/2" />
                </div>
              )}

              {error && !loading && (
                <p style={{ fontSize: "13px", color: "#f87171" }}>{error}</p>
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
                <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7 }}>
                  Your AI morning brief will appear here. Hit the button below to generate it.
                </p>
              )}
            </div>
          ) : (
            <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7 }}>
              Your AI morning brief will appear here once you&apos;ve added tasks,
              habits, and goals. Start by creating your first task.
            </p>
          )
        ) : (
          <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7 }}>
            Sign in to analyze your productivity, get daily insights, and let AI
            organize your schedule for maximum energy.
          </p>
        )}
      </div>

      {/* CTAs */}
      <div className="flex items-center gap-3 mt-6">
        {user ? (
          hasData ? (
            <>
              {!brief && error && (
                <button
                  onClick={handleGenerate}
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
                  onClick={handleGenerate}
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
  );
}
