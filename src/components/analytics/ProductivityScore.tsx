"use client";

import { TrendLine, TrendLineSkeleton } from "./WeeklyActivities";
import { ProductivityData } from "@/utils/analytics.types";

interface Props {
  data: ProductivityData;
  hasData: boolean;
}
// ─── Ghost skeleton ───────────────────────────────────────────────────────────
export function ProductivityScoreSkeleton() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}
    >
      <div
        className="rounded"
        style={{
          width: "60%",
          height: "12px",
          backgroundColor: "#1e1e1e",
          marginBottom: "6px",
        }}
      />
      <div
        className="rounded"
        style={{
          width: "80%",
          height: "9px",
          backgroundColor: "#1a1a1a",
          marginBottom: "20px",
        }}
      />
      <div className="flex items-end justify-between gap-2">
        <div>
          <div
            className="rounded"
            style={{
              width: "60px",
              height: "36px",
              backgroundColor: "#1a1a1a",
              marginBottom: "8px",
            }}
          />
          <div
            className="rounded"
            style={{ width: "90px", height: "9px", backgroundColor: "#1a1a1a" }}
          />
        </div>
        <TrendLineSkeleton />
      </div>
      <div className="mt-4 space-y-3">
        {[1, 2].map((i) => (
          <div key={i}>
            <div className="flex justify-between mb-1">
              <div
                className="rounded"
                style={{
                  width: "100px",
                  height: "9px",
                  backgroundColor: "#1a1a1a",
                }}
              />
              <div
                className="rounded"
                style={{
                  width: "30px",
                  height: "9px",
                  backgroundColor: "#1a1a1a",
                }}
              />
            </div>
            <div
              className="rounded-full"
              style={{ height: "3px", backgroundColor: "#1a1a1a" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Live productivity score ──────────────────────────────────────────────────
interface Props {
  data: ProductivityData;
  hasData: boolean;
}

export function ProductivityScore({ data, hasData }: Props) {
  const score = data.score;
  const deepWorkSessions = Math.floor(score / 3);
  const avgDailyScore = Math.round(score * 0.9);

  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}
    >
      <h3
        className="font-semibold text-white mb-1"
        style={{ fontSize: "14px" }}
      >
        Productivity Score
      </h3>
      <p style={{ fontSize: "11px", color: "#555", marginBottom: "16px" }}>
        7-day efficiency trend
      </p>

      <div className="flex items-end justify-between gap-2">
        <div>
          <p
            className="font-black text-white"
            style={{
              fontSize: "36px",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {data.score}
          </p>
          <p style={{ fontSize: "11px", color: "#7c6af0", marginTop: "4px" }}>
            Based on {data.taskCount} tasks &amp; {data.habitCount} habits
          </p>
        </div>
        <TrendLine data={data.trend} />
      </div>

      <div className="mt-4 space-y-2.5">
        {[
          {
            label: "Deep Work Sessions (est.)",
            val: deepWorkSessions,
            max: 20,
          },
          { label: "Avg Daily Score", val: avgDailyScore, max: 100 },
        ].map(({ label, val, max }) => (
          <div key={label}>
            <div className="flex justify-between mb-1">
              <span style={{ fontSize: "11px", color: "#555" }}>{label}</span>
              <span style={{ fontSize: "11px", color: "#888" }}>
                {val}/{max}
              </span>
            </div>
            <div
              className="rounded-full overflow-hidden"
              style={{ height: "3px", backgroundColor: "#1a1a1a" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min((val / max) * 100, 100)}%`,
                  background: "linear-gradient(90deg,#5a4fd4,#7c6af0)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
