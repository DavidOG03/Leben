"use client";

import { useLebenStore } from "@/store/useStore";
import { TimelineItem } from "./TimelineItem";

export function Timeline() {
  const schedule = useLebenStore((s) => s.schedule);

  return (
    <div className="relative pl-2">
      {/* Vertical line connector */}
      <div 
        className="absolute left-6 top-6 bottom-6 w-px"
        style={{ 
          background: "linear-gradient(to bottom, #222 0%, #1a1a1a 50%, #111 100%)",
          zIndex: 0
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
          schedule.map((item, index) => (
            <TimelineItem 
              key={item.id} 
              item={item} 
              isCurrent={index === 1} // Mocking current item for now
            />
          ))
        )}
      </div>
    </div>
  );
}
