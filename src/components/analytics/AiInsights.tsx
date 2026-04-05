"use client";

import type { AIInsight } from "@/utils/analytics.types";
import EmptyState from "./EmptyState";

interface AIInsightsProps {
  insights: AIInsight[];
  hasData: boolean;
}

/**
 * AIInsights currently shows pattern-based insights computed from local data.
 *
 * --- How to make this smarter with Gemini ---
 * Instead of the deterministic computeAIInsights() function in analyticsUtils.ts,
 * you could call Gemini like this:
 *
 *   const prompt = `
 *     Here is a user's productivity data for the past 7 days:
 *     - Tasks completed per day: ${JSON.stringify(weekActivity)}
 *     - Habit completion rates: ${JSON.stringify(topHabits)}
 *     - Goal progress: ${JSON.stringify(goalProgress)}
 *     Return exactly 3 short actionable insights as a JSON array:
 *     [{ "icon": "emoji", "text": "insight" }]
 *     Return JSON only, no markdown.
 *   `;
 *
 * Pass that to the Gemini SDK and parse the JSON response.
 * This way the insights are dynamic and context-aware, not hardcoded rules.
 */
export default function AIInsights({ insights, hasData }: AIInsightsProps) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: "26px",
            height: "26px",
            background: "rgba(124,106,240,0.15)",
            border: "1px solid rgba(124,106,240,0.2)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1.5l1.1 3.3L11 6l-3.9 1.2L6 10.5l-1.1-3.3L1 6l3.9-1.2L6 1.5z"
              stroke="#7c6af0"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-white" style={{ fontSize: "14px" }}>
          AI Insights
        </h3>
      </div>

      {hasData ? (
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div
              key={i}
              className="flex gap-2.5 rounded-xl p-3"
              style={{
                backgroundColor: "#161616",
                border: "1px solid #1e1e1e",
              }}
            >
              <span
                style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}
              >
                {insight.icon}
              </span>
              <p style={{ fontSize: "11px", color: "#888", lineHeight: 1.5 }}>
                {insight.text}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="✨"
          message="No insights yet"
          hint="Interact with tasks, habits, and goals -- AI will surface patterns for you"
        />
      )}
    </div>
  );
}
