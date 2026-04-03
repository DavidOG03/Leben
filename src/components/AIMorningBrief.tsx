"use client";

import Link from "next/link";

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
    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function AIMorningBrief() {
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
          <SparkleIcon />
          <span
            className="uppercase tracking-widest font-medium"
            style={{ fontSize: "10px", color: "#7c6af0", letterSpacing: "0.14em" }}
          >
            AI Morning Brief
          </span>
        </div>

        {/* Empty state headline */}
        <h2
          className="font-bold leading-tight mb-4"
          style={{ fontSize: "26px", letterSpacing: "-0.02em", color: "#f0f0f0" }}
        >
          Welcome to{" "}
          <span style={{ color: "#7c6af0" }}>Leben.</span>
        </h2>

        <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7 }}>
          Your AI morning brief will appear here once you&apos;ve added tasks, habits, and goals.
          Start by creating your first task — your personal OS is ready when you are.
        </p>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-3 mt-6">
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
      </div>
    </div>
  );
}
