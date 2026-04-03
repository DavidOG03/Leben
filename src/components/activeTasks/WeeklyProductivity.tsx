"use client";

const days = [
  { label: "MON", value: 30 },
  { label: "TUE", value: 45 },
  { label: "WED", value: 38 },
  { label: "THU", value: 55 },
  { label: "FRI", value: 80, active: true },
  { label: "SAT", value: 28 },
  { label: "SUN", value: 20 },
];

const TrendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M1 10L4.5 6l3 3L12 3"
      stroke="#7c6af0"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 3h3v3"
      stroke="#7c6af0"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function WeeklyProductivity() {
  const maxValue = Math.max(...days.map((d) => d.value));

  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: "#131313",
        border: "1px solid #1e1e1e",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-white font-semibold" style={{ fontSize: "13px" }}>
          Weekly Productivity
        </span>
        <TrendIcon />
      </div>

      {/* Bar chart */}
      <div className="flex items-end justify-between gap-1.5" style={{ height: "80px" }}>
        {days.map((day) => {
          const heightPct = (day.value / maxValue) * 100;
          return (
            <div
              key={day.label}
              className="flex flex-col items-center gap-2 flex-1"
            >
              <div
                className="w-full rounded-sm"
                style={{
                  height: `${heightPct}%`,
                  background: day.active
                    ? "linear-gradient(180deg, #9d8ff5 0%, #7c6af0 100%)"
                    : "#1e1e1e",
                  borderRadius: "3px 3px 2px 2px",
                  minHeight: "4px",
                  transition: "height 0.5s ease",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Day labels */}
      <div className="flex justify-between mt-2.5 gap-1.5">
        {days.map((day) => (
          <div key={day.label} className="flex-1 flex justify-center">
            <span
              style={{
                fontSize: "9px",
                color: day.active ? "#7c6af0" : "#3a3a3a",
                letterSpacing: "0.06em",
                fontWeight: day.active ? 600 : 400,
              }}
            >
              {day.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
