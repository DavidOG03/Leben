"use client";

const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function WeeklyProductivity() {
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: "#131313", border: "1px solid #1e1e1e" }}
    >
      <div className="flex items-center justify-between mb-5">
        <span className="text-white font-semibold" style={{ fontSize: "13px" }}>
          Weekly Productivity
        </span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 10L4.5 6l3 3L12 3" stroke="#2a2a2a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Empty bars */}
      <div className="flex items-end justify-between gap-1.5" style={{ height: "80px" }}>
        {days.map((day) => (
          <div key={day} className="flex flex-col items-center gap-2 flex-1">
            <div
              className="w-full rounded-sm"
              style={{ height: "20%", backgroundColor: "#1a1a1a", borderRadius: "3px 3px 2px 2px", minHeight: "4px" }}
            />
          </div>
        ))}
      </div>

      {/* Day labels */}
      <div className="flex justify-between mt-2.5 gap-1.5">
        {days.map((day) => (
          <div key={day} className="flex-1 flex justify-center">
            <span style={{ fontSize: "9px", color: "#2a2a2a", letterSpacing: "0.06em" }}>{day}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: "11px", color: "#2e2e2e", textAlign: "center", marginTop: "12px" }}>
        Complete tasks to see your weekly trend
      </p>
    </div>
  );
}
