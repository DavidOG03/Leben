"use client";

import { useLebenStore } from "@/store/useStore";
import { ClockIcon, TaskIcon } from "@/constants/Icons";

export function UnscheduledTasks() {
  const tasks = useLebenStore((s) => s.tasks);
  const pendingTasks = tasks.filter(t => !t.completed);

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-white font-semibold" style={{ fontSize: "16px" }}>
            Unscheduled Tasks
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-[#1a1a1a] text-[#555] font-bold" style={{ fontSize: "10px" }}>
            {pendingTasks.length} PENDING
          </span>
        </div>
        <button className="text-[#6858e0] font-semibold hover:opacity-80 transition-opacity" style={{ fontSize: "12px" }}>
          Manage All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {pendingTasks.slice(0, 3).map((task) => (
          <div 
            key={task.id}
            className="rounded-2xl p-5 flex flex-col gap-4 transition-all hover:bg-white/[0.02]"
            style={{ 
              background: "#111",
              border: "1px solid #1e1e1e"
            }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="flex-shrink-0 flex items-center justify-center rounded-xl"
                style={{ 
                  width: "40px", 
                  height: "40px", 
                  backgroundColor: "#0d0d0d",
                  border: "1px solid #1a1a1a",
                  color: "#444"
                }}
              >
                <TaskIcon />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white font-medium truncate w-full" style={{ fontSize: "14px", maxWidth: "160px" }}>
                  {task.title}
                </span>
                <div className="flex items-center gap-2 text-[#444]" style={{ fontSize: "11px" }}>
                  <ClockIcon />
                  <span>EST: 15m</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {pendingTasks.length === 0 && (
          <div className="col-span-3 py-10 rounded-2xl border border-dashed border-[#1a1a1a] flex items-center justify-center">
            <span className="text-[#333] text-sm italic">Clear queue! Well done.</span>
          </div>
        )}
      </div>
    </div>
  );
}
