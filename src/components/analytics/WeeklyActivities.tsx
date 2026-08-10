import React from "react";
import { DayActivity } from "@/utils/analytics.types";
import EmptyState from "./EmptyState";
import { TrendingUp, BarChart2 } from "lucide-react";

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
  const w = 150;
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

function BarChart({ data }: { data: DayActivity[] }) {
  const maxTasks = Math.max(...data.map((d) => d.tasks), 1);

  return (
    <div>
      <div className="flex items-end gap-3 h-[120px]">
        {data.map((d, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col justify-end h-[100px] gap-0.5">
              <div
                className="w-full rounded-[3px] rounded-b-[2px] bg-accent-dim"
                style={{
                  height: `${(d.focusHours / 7) * 80}%`,
                  minHeight: d.focusHours > 0 ? 3 : 0,
                }}
              />
              <div
                className="w-full rounded-[3px] rounded-b-[2px] bg-accent-purple"
                style={{
                  height: `${(d.tasks / maxTasks) * 60}%`,
                  minHeight: d.tasks > 0 ? 4 : 0,
                }}
              />
            </div>
            <span className="text-[9px] text-text-muted tracking-wide">
              {d.day}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="rounded-sm w-2.5 h-2.5 bg-accent" />
          <span className="text-[10px] text-text-muted">Tasks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="rounded-sm w-2.5 h-2.5 bg-accent-dim" />
          <span className="text-[10px] text-text-muted">Focus Hours</span>
        </div>
      </div>
    </div>
  );
}

export default function WeeklyActivityChart({
  data,
  hasData,
}: WeeklyActivityChartProps) {
  return (
    <div className="rounded-2xl p-5 mb-5 bg-bg-secondary border border-border-subtle">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-text-2 text-[14px]">
            Weekly Activity
          </h3>
          <p className="text-[11px] text-text-muted mt-0.5">
            Tasks completed & focus hours
          </p>
        </div>
        {hasData && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-success/10 border border-success-green/20">
            <TrendingUp size={10} color="#4caf7d" />
            <span className="text-[10px] text-success-green font-medium">
              this week
            </span>
          </div>
        )}
      </div>

      {hasData ? (
        <BarChart data={data} />
      ) : (
        <EmptyState
          icon={<BarChart2 size={24} color="#555" />}
          message="No activity yet"
          hint="Complete tasks this week to see your activity chart"
        />
      )}
    </div>
  );
}
