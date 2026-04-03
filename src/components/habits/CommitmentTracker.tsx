import React from "react";

const CommitmentTracker = () => {
  return (
    <>
      {/* Commitment Matrix — all habits
      <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="font-bold text-white" style={{ fontSize: "16px" }}>Commitment Matrix</h2>
            <p style={{ fontSize: "11px", color: "#555", marginTop: "4px" }}>
              {habits.length > 0
                ? `Tracking all ${habits.length} habit${habits.length === 1 ? "" : "s"} · darker = more habits kept`
                : "Add a habit to see your commitment history."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "10px", color: "#444" }}>Less</span>
            {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
              <div key={i} className="rounded-sm" style={{ width: "11px", height: "11px", backgroundColor: intensityColor(v) }} />
            ))}
            <span style={{ fontSize: "10px", color: "#444" }}>More</span>
          </div>
        </div>

        {habits.length === 0 ? (
          <div className="overflow-x-auto opacity-20 mt-4">
            <div className="flex gap-1">
              {Array.from({ length: WEEKS }, (_, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }, (_, di) => (
                    <div key={di} className="rounded-sm" style={{ width: "11px", height: "11px", backgroundColor: "#1a1a1a" }} />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex mt-2">
              {MONTHS.map((m) => (
                <div key={m} style={{ width: `${100 / 6}%` }}>
                  <span style={{ fontSize: "9px", color: "#3a3a3a", letterSpacing: "0.1em" }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <div className="flex gap-1">
              {allHabitsMatrix.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((ratio, di) => {
                    const ds = cellDate(wi, di);
                    const count = countOnDate(habits, ds);
                    return (
                      <div
                        key={di}
                        title={`${ds}: ${count}/${habits.length} habit${habits.length === 1 ? "" : "s"} kept`}
                        className="rounded-sm transition-opacity hover:opacity-80"
                        style={{ width: "11px", height: "11px", backgroundColor: intensityColor(ratio) }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex mt-2">
              {MONTHS.map((m) => (
                <div key={m} style={{ width: `${100 / 6}%` }}>
                  <span style={{ fontSize: "9px", color: "#3a3a3a", letterSpacing: "0.1em" }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div> */}
    </>
  );
};

export default CommitmentTracker;
