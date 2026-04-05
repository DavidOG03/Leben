"use client";

import type { StatCard } from "@/utils/analytics.types";

interface StatCardsProps {
  cards: StatCard[];
}

export default function StatCards({ cards }: StatCardsProps) {
  return (
    <div
      className="grid gap-4 mb-6"
      style={{ gridTemplateColumns: "repeat(4,1fr)" }}
    >
      {cards.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl p-5"
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
