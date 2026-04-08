"use client";

import { SparkleIcon } from "@/constants/Icons";

interface Insight {
  text: string;
  type: "suggestion" | "fact";
}

interface AIInsightsCardProps {
  insights: string[];
  isLoading: boolean;
}

export function AIInsightsCard({ insights, isLoading }: AIInsightsCardProps) {
  if (isLoading) {
    return (
      <div
        className="rounded-2xl p-6 flex flex-col gap-4"
        style={{
          background: "linear-gradient(145deg, #1a1a1a 0%, #111111 100%)",
          border: "1px solid #252525",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg bg-white/5"
            style={{ color: "#7c6af0" }}
          >
            <SparkleIcon />
          </div>
          <h3 className="text-white font-semibold" style={{ fontSize: "14px" }}>
            AI Insights
          </h3>
        </div>
        <p
          className="text-[#888]"
          style={{ fontSize: "12px", lineHeight: 1.6 }}
        >
          Generating your personalized day plan...
        </p>
      </div>
    );
  }
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4"
      style={{
        background: "linear-gradient(145deg, #1a1a1a 0%, #111111 100%)",
        border: "1px solid #252525",
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="p-1.5 rounded-lg bg-white/5"
          style={{ color: "#7c6af0" }}
        >
          <SparkleIcon />
        </div>
        <h3 className="text-white font-semibold" style={{ fontSize: "14px" }}>
          AI Insights
        </h3>
      </div>

      <p className="text-[#888]" style={{ fontSize: "12px", lineHeight: 1.6 }}>
        {insights[0] || "No insights generated yet."}
      </p>

      <div className="space-y-3 mt-1">
        {insights.slice(1).map((insight, i) => (
          <div key={i} className="flex items-start gap-3">
            <div
              className="mt-1 flex-shrink-0"
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                border: "1px solid #7c6af0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#7c6af0",
                }}
              />
            </div>
            <span
              className="text-white/80"
              style={{ fontSize: "11px", lineHeight: 1.5 }}
            >
              {insight}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
