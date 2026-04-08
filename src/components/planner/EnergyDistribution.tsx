"use client";

import { useLebenStore, ScheduleItem } from "@/store/useStore";

export function EnergyDistribution() {
  const schedule = useLebenStore((s) => s.schedule);

  // Derived logic: calculate peaks based on task density and priority
  // Morning: 06:00 - 12:00
  // Peak: 12:00 - 18:00
  // Evening: 18:00 - 00:00

  const morningTasks = schedule.filter((item) => {
    const hour = parseInt(item.start.split(":")[0]);
    return hour >= 6 && hour < 12;
  });

  const peakTasks = schedule.filter((item) => {
    const hour = parseInt(item.start.split(":")[0]);
    return hour >= 12 && hour < 18;
  });

  const eveningTasks = schedule.filter((item) => {
    const hour = parseInt(item.start.split(":")[0]);
    return hour >= 18 || hour < 6;
  });

  const calculateH = (tasks: ScheduleItem[]) => {
    if (tasks.length === 0) return 20;
    const score = tasks.reduce((acc, t) => acc + (t.priority === "high" ? 30 : t.priority === "medium" ? 20 : 10), 0);
    return Math.min(100, 20 + score);
  };

  const levels = [
    { label: "MOR", value: calculateH(morningTasks), peak: false },
    { label: "PEAK", value: calculateH(peakTasks), peak: true },
    { label: "EVE", value: calculateH(eveningTasks), peak: false },
  ];

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-6"
      style={{
        background: "linear-gradient(145deg, #111111 0%, #0d0d0d 100%)",
        border: "1px solid #1e1e1e",
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold" style={{ fontSize: "14px" }}>
          Energy Distribution
        </h3>
        <span className="text-[#7c6af0]" style={{ fontSize: "10px", fontWeight: 600 }}>
          Peak: 10:00 AM
        </span>
      </div>

      <div className="flex items-end justify-between px-4 h-32 gap-6">
        {levels.map((lvl) => (
          <div key={lvl.label} className="flex flex-col items-center gap-3 flex-1">
            <div
              className="w-full rounded-lg transition-all duration-700"
              style={{
                height: `${lvl.value}%`,
                background: lvl.peak
                  ? "linear-gradient(to top, #5a4fd4, #7c6af0)"
                  : "rgba(255,255,255,0.05)",
                border: lvl.peak ? "none" : "1px solid #1a1a1a",
                boxShadow: lvl.peak ? "0 4px 15px rgba(124, 106, 240, 0.3)" : "none",
              }}
            />
            <span
              style={{
                fontSize: "9px",
                fontWeight: 700,
                color: lvl.peak ? "#7c6af0" : "#444",
                letterSpacing: "0.1em",
              }}
            >
              {lvl.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
