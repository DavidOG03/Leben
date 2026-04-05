"use client";

import type { DayActivity } from "@/utils/analytics.types";
import EmptyState from "./EmptyState";

interface WeeklyActivityChartProps {
  data: DayActivity[];
  hasData: boolean;
}

// ─── TrendLine ────────────────────────────────────────────────────────────────
// Exported so ProductivityScore.tsx can import and use it.
// It takes an array of numbers and draws a smooth SVG sparkline.
export function TrendLine({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  // norm() maps each value into a 5–45px vertical range within the 55px tall SVG
  const norm = (v: number) => ((v - min) / (max - min || 1)) * 40 + 5;
  const w = 120;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${50 - norm(v)}`).join(" ");

  return (
    <svg width={w} height="55" viewBox={`0 0 ${w} 55`} fill="none">
      {/* The visible line */}
      <polyline
        points={points}
        stroke="#7c6af0"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      {/* Subtle fill under the line for depth */}
      <polyline
        points={`0,55 ${points} ${w},55`}
        stroke="none"
        fill="rgba(124,106,240,0.08)"
      />
    </svg>
  );
}

// ─── TrendLineSkeleton ────────────────────────────────────────────────────────
// Exported so ProductivityScore.tsx can use it in its own skeleton state.
// It's a static grey polyline that mimics the shape of a real sparkline.
export function TrendLineSkeleton() {
  return (
    <svg width={120} height="55" viewBox="0 0 120 55" fill="none">
      <polyline
        points="0,45 20,35 40,40 60,25 80,30 100,18 120,22"
        stroke="#1e1e1e"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// ─── BarChart ─────────────────────────────────────────────────────────────────
// Private to this file -- only WeeklyActivityChart uses it.
export function BarChart({ data }: { data: DayActivity[] }) {
  const maxTasks = Math.max(...data.map((d) => d.tasks), 1);

  return (
    <div>
      <div className="flex items-end gap-3" style={{ height: "120px" }}>
        {data.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full flex flex-col gap-0.5 justify-end"
              style={{ height: "100px" }}
            >
              <div
                className="w-full rounded-sm"
                style={{
                  height: `${(d.focusHours / 7) * 80}%`,
                  background: "#1e1e3a",
                  borderRadius: "3px 3px 2px 2px",
                  minHeight: d.focusHours > 0 ? "3px" : "0px",
                }}
              />
              <div
                className="w-full rounded-sm"
                style={{
                  height: `${(d.tasks / maxTasks) * 60}%`,
                  background: "linear-gradient(180deg,#9d8ff5,#7c6af0)",
                  borderRadius: "3px 3px 2px 2px",
                  minHeight: d.tasks > 0 ? "4px" : "0px",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "9px",
                color: "#3a3a3a",
                letterSpacing: "0.06em",
              }}
            >
              {d.day}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3">
        {[
          { color: "#7c6af0", label: "Tasks" },
          { color: "#1e1e3a", label: "Focus Hours" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="rounded-sm"
              style={{ width: "10px", height: "10px", backgroundColor: color }}
            />
            <span style={{ fontSize: "10px", color: "#555" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── WeeklyActivityChart ──────────────────────────────────────────────────────
export default function WeeklyActivityChart({
  data,
  hasData,
}: WeeklyActivityChartProps) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-white" style={{ fontSize: "14px" }}>
            Weekly Activity
          </h3>
          <p style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>
            Tasks completed &amp; focus hours
          </p>
        </div>
        {hasData && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{
              backgroundColor: "rgba(74,207,125,0.1)",
              border: "1px solid rgba(74,207,125,0.2)",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M1 7l2.5-2.5 2 2L9 1"
                stroke="#4caf7d"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{ fontSize: "10px", color: "#4caf7d", fontWeight: 500 }}
            >
              this week
            </span>
          </div>
        )}
      </div>

      {hasData ? (
        <BarChart data={data} />
      ) : (
        <EmptyState
          icon="📊"
          message="No activity yet"
          hint="Complete tasks this week to see your activity chart"
        />
      )}
    </div>
  );
}
