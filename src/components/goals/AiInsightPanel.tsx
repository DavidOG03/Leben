"use client";

import { useState, useCallback } from "react";
import { Goal, deriveGoalStats, Milestone } from "@/utils/goals.types";
import { Book } from "@/store/bookSlice";
import { unifiedAiCall } from "@/lib/ai/unifiedClient";

interface AIInsightPanelProps {
  goals: Goal[];
  books: Book[];
}

interface InsightResult {
  headline: string;
  detail: string;
  focusItem: string;
}

const EMPTY_STATE_TEXT =
  "Add goals or books to unlock AI-powered insights about your progress and next best actions.";

export default function AIInsightPanel({ goals, books }: AIInsightPanelProps) {
  const [insight, setInsight] = useState<InsightResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsight = useCallback(async () => {
    if (goals.length === 0 && books.length === 0) return;
    setLoading(true);
    setError(null);

    // Build a compact snapshot of each goal to minimize tokens
    const snapshot = goals.map((g) => {
      const { progress, status, daysLeft } = deriveGoalStats(g);
      const doneMilestones = g.milestones
        .filter((m: Milestone) => m.done)
        .map((m: Milestone) => m.label);
      const pendingMilestones = g.milestones
        .filter((m: Milestone) => !m.done)
        .map((m: Milestone) => m.label);
      return {
        title: g.title,
        progress,
        status,
        daysLeft,
        doneMilestones,
        pendingMilestones,
      };
    });

    const bookSnapshot = books.map((b) => ({
      title: b.title,
      status: b.status,
      currentPage: b.currentPage,
      totalPages: b.totalPages,
    }));

    const prompt = `
You are a focused productivity coach. Analyze these goals and books to return a JSON object only — no markdown, no explanation:
{
  "headline": "One short punchy sentence (max 10 words) about what the user should do next",
  "detail": "Two sentences: which goal or book needs attention and why, referencing actual data such as time, urgency, or discipline.",
  "focusItem": "The exact title of the goal or book most at risk or most worth prioritizing now"
}

Goals data:
${JSON.stringify(snapshot, null, 2)}

Books data:
${JSON.stringify(bookSnapshot, null, 2)}
    `.trim();

    try {
      const raw: string = await unifiedAiCall(prompt, { json: true });
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed: InsightResult = JSON.parse(cleaned);
      setInsight(parsed);
    } catch (err: any) {
      console.error("AI insight error:", err);
      setError("Could not fetch insight. Try again.");
    } finally {
      setLoading(false);
    }
  }, [goals, books]);

  const hasData = goals.length > 0 || books.length > 0;

  return (
    <div
      className="rounded-2xl p-5 flex-1"
      style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: "28px",
            height: "28px",
            background: "rgba(124,106,240,0.15)",
            border: "1px solid rgba(124,106,240,0.2)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path
              d="M6.5 1.5l1.2 3.6L12 6.5l-4.3 1.4L6.5 11.5l-1.2-3.6L1 6.5l4.3-1.4L6.5 1.5z"
              stroke="#7c6af0"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span
          style={{
            fontSize: "10px",
            color: "#7c6af0",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          AI Insight
        </span>
      </div>

      {/* Content: empty state, loading, error, or insight */}
      {!hasData && (
        <div>
          {/* Ghost skeleton headline */}
          <div
            className="rounded-lg mb-2"
            style={{
              height: "18px",
              width: "70%",
              backgroundColor: "#1a1a1a",
              marginBottom: "8px",
            }}
          />
          <p style={{ fontSize: "12px", color: "#444", lineHeight: 1.6 }}>
            {EMPTY_STATE_TEXT}
          </p>
        </div>
      )}

      {hasData && loading && (
        <div className="flex flex-col gap-2">
          <div
            className="rounded-lg animate-pulse"
            style={{ height: "18px", width: "75%", backgroundColor: "#1e1e1e" }}
          />
          <div
            className="rounded-lg animate-pulse"
            style={{ height: "14px", width: "90%", backgroundColor: "#1a1a1a" }}
          />
          <div
            className="rounded-lg animate-pulse"
            style={{ height: "14px", width: "60%", backgroundColor: "#1a1a1a" }}
          />
        </div>
      )}

      {hasData && !loading && error && (
        <p style={{ fontSize: "12px", color: "#e05c5c" }}>{error}</p>
      )}

      {hasData && !loading && insight && (
        <>
          <h4
            className="font-bold text-white mb-3"
            style={{ fontSize: "15px", letterSpacing: "-0.01em" }}
          >
            {insight.headline}
          </h4>
          <p
            style={{
              fontSize: "12px",
              color: "#555",
              lineHeight: 1.6,
              marginBottom: "14px",
            }}
          >
            {insight.detail.split(insight.focusItem).map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <strong className="text-white">{insight.focusItem}</strong>
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>
        </>
      )}

      {/* CTA button */}
      {hasData && (
        <button
          onClick={fetchInsight}
          disabled={loading}
          className="w-full py-2 rounded-xl font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #252525",
            color: "#ccc",
            fontSize: "12px",
            marginTop: insight ? 0 : "12px",
          }}
        >
          {loading
            ? "Analyzing..."
            : insight
              ? "Refresh Insight"
              : "Get AI Insight"}
        </button>
      )}
    </div>
  );
}
