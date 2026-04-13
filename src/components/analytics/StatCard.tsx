"use client";

import type { StatCard } from "@/utils/analytics.types";

interface StatCardsProps {
  cards: StatCard[];
}

export default function StatCards({ cards }: StatCardsProps) {
  if (!cards || cards.length === 0) {
    return (
      <div className="gap-4 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-5 min-w-[200px]"
            style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}
          >
            <div className="w-20 h-3 rounded bg-white/5 mb-3" />
            <div className="w-24 h-8 rounded bg-white/5 mb-3" />
            <div className="w-16 h-3 rounded bg-white/5" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex gap-4 mb-6 overflow-x-auto md:grid md:grid-cols-4">
      {cards.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl p-5 min-w-[200px]"
          style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}
        >
          <p style={{ fontSize: "11px", color: "#555", marginBottom: "8px" }}>
            {s.label}
          </p>
          <p
            className="font-black text-white"
            style={{
              fontSize: "28px",
              letterSpacing: "-0.025em",
              lineHeight: 1,
            }}
          >
            {s.val}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            {s.up !== null && (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                {s.up ? (
                  <path
                    d="M1 8l3-3 2 2 4-5"
                    stroke="#4caf7d"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d="M1 3l3 3 2-2 4 5"
                    stroke="#e85555"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            )}
            <span
              style={{
                fontSize: "11px",
                color:
                  s.up === true
                    ? "#4caf7d"
                    : s.up === false
                      ? "#e85555"
                      : "#555",
              }}
            >
              {s.sub}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
