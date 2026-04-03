import React from "react";
import {
  Book,
  ConsistencyScoreProps,
  HabitCard,
} from "../../utils/habits.types";

const ConsistencyScore: React.FC<ConsistencyScoreProps> = ({
  habits,
  consistencyScore,
  checkedCount,
  books,
}) => {
  return (
    <>
      {/* Consistency Score */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "linear-gradient(145deg,#121220,#0e0e18)",
          border: "1px solid #252535",
        }}
      >
        <p
          className="uppercase tracking-widest mb-2"
          style={{
            fontSize: "9px",
            color: "#7c6af0",
            letterSpacing: "0.14em",
          }}
        >
          Consistency Score
        </p>
        {habits.length === 0 ? (
          <>
            <div
              className="rounded mb-3"
              style={{
                width: "80px",
                height: "48px",
                backgroundColor: "#1a1a1a",
              }}
            />
            <p style={{ fontSize: "12px", color: "#333" }}>
              Add habits to see your score
            </p>
          </>
        ) : (
          <>
            <p
              className="font-black text-white"
              style={{
                fontSize: "48px",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {consistencyScore}%
            </p>
            <div className="flex items-center gap-2 my-3">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1 9l3-3 2.5 2.5L10 2.5"
                  stroke="#7c6af0"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.5 2.5H10V5"
                  stroke="#7c6af0"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              <span style={{ fontSize: "12px", color: "#7c6af0" }}>
                {checkedCount}/{habits.length} habits done today
              </span>
            </div>
            <div
              className="rounded-full overflow-hidden mb-4"
              style={{ height: "3px", background: "#1e1e1e" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${consistencyScore}%`,
                  background: "linear-gradient(90deg,#5a4fd4,#9d8ff5)",
                }}
              />
            </div>
            <div
              className="grid"
              style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}
            >
              {[
                {
                  label: "BEST STREAK",
                  val: `${Math.max(0, ...habits.map((h: HabitCard) => h.longestStreak))}d`,
                },
                { label: "TOTAL HABITS", val: `${habits.length}` },
                {
                  label: "BOOKS READ",
                  val: `${books.filter((b: Book) => b.currentPage >= b.totalPages).length}`,
                },
              ].map(({ label, val }) => (
                <div key={label}>
                  <p
                    style={{
                      fontSize: "9px",
                      color: "#444",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    {label}
                  </p>
                  <p
                    className="font-semibold text-white"
                    style={{ fontSize: "13px" }}
                  >
                    {val}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ConsistencyScore;
