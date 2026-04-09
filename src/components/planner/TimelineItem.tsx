"use client";

import { EditIcon } from "@/constants/Icons";
import { useLebenStore, ScheduleItem } from "@/store/useStore";

interface TimelineItemProps {
  item: ScheduleItem;
  isCurrent?: boolean;
}

export function TimelineItem({ item, isCurrent }: TimelineItemProps) {
  const toggleScheduleItem = useLebenStore((s) => s.toggleScheduleItem);
  
  const isDeepWork = item.tag.toLowerCase().includes("work");
  const isRecharge = item.tag.toLowerCase().includes("health") || item.tag.toLowerCase().includes("mind");
  
  return (
    <div className="flex gap-6 mb-12 last:mb-0 relative group">
      {/* Time label and dot */}
      <div className="flex flex-col items-center w-12 pt-1">
        <span className="text-[#444] font-bold" style={{ fontSize: "11px" }}>
          {item.start}
        </span>
        <div 
          className="mt-3 relative z-10"
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: isCurrent ? "#7c6af0" : "#222",
            border: isCurrent ? "2px solid #000" : "1px solid #333",
            boxShadow: isCurrent ? "0 0 10px #7c6af0" : "none"
          }}
        />
      </div>

      {/* Card */}
      <div
        className="flex-1 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01]"
        style={{
          background: isCurrent 
            ? "linear-gradient(145deg, #181926 0%, #0d0d12 100%)" 
            : "linear-gradient(145deg, #111111 0%, #0a0a0a 100%)",
          border: isCurrent ? "1px solid #7c6af044" : "1px solid #1a1a1a",
          boxShadow: isCurrent ? "0 10px 40px -10px rgba(0,0,0,0.5)" : "none"
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-2">
                <span 
                  className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                  style={{ 
                    backgroundColor: isDeepWork ? "#1e1e2e" : isRecharge ? "#1e2e22" : "#1a1a1a",
                    color: isDeepWork ? "#7c6af0" : isRecharge ? "#4caf70" : "#888",
                    border: `1px solid ${isDeepWork ? "#2a2a4a" : isRecharge ? "#2a4a33" : "#222"}`
                  }}
                >
                  {item.tag}
                </span>
                <span className="text-[#444]" style={{ fontSize: "10px" }}>
                  {item.description.includes("duration") ? item.description : ""}
                </span>
             </div>
             <h4 className="text-white font-bold leading-tight mt-1" style={{ fontSize: "18px" }}>
                {item.title}
             </h4>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 rounded-md hover:bg-white/5 text-[#444] transition-colors">
              <EditIcon />
            </button>
            <div 
               onClick={() => toggleScheduleItem(item.id)}
               className="w-4 h-4 rounded border border-[#333] flex items-center justify-center cursor-pointer transition-colors hover:border-[#7c6af0]"
               style={{ backgroundColor: item.status === "completed" ? "#7c6af0" : "transparent" }}
            >
              {item.status === "completed" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </div>
        </div>

        <p className="text-[#666] leading-relaxed" style={{ fontSize: "13px", maxWidth: "480px" }}>
          {item.description}
        </p>

        <div className="flex gap-2 mt-6">
           <span className="px-3 py-1 rounded-full text-[10px] font-medium bg-[#1a1a1a] text-[#555] border border-[#222]">
             {item.tag}
           </span>
           <span className="px-3 py-1 rounded-full text-[10px] font-medium bg-[#1a1a1a] text-[#555] border border-[#222]">
             {item.priority.toUpperCase()}
           </span>
        </div>
      </div>
    </div>
  );
}
