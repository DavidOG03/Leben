"use client";

import { useEffect, useState } from "react";
import { useLebenStore } from "@/store/useStore";
import { TimelineItem } from "./TimelineItem";

/** Converts "HH:MM" → total minutes since midnight */
function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Returns current time as minutes since midnight */
function nowInMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function Timeline() {
  const schedule = useLebenStore((s) => s.schedule);

  // Re-evaluate every minute so the active item advances in real time
  const [currentMinutes, setCurrentMinutes] = useState(nowInMinutes);
  useEffect(() => {
    const id = setInterval(() => setCurrentMinutes(nowInMinutes()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative pl-2">
      {/* Vertical line connector */}
      <div
        className="absolute left-8 top-6 bottom-6 w-px"
        style={{
          background:
            "linear-gradient(to bottom, #222 0%, #1a1a1a 50%, #111 100%)",
          zIndex: 0,
        }}
      />

      <div className="flex flex-col">
        {schedule.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[#333] italic" style={{ fontSize: "14px" }}>
              No tasks scheduled for today. Regenerate plan to start.
            </p>
          </div>
        ) : (
          schedule.map((item) => {
            const start = toMinutes(item.start);
            const end = toMinutes(item.end);
            const isCurrent = currentMinutes >= start && currentMinutes < end;
            return (
              <TimelineItem
                key={item.id}
                item={item}
                isCurrent={isCurrent}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
