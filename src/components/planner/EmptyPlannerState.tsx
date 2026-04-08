"use client";

import Link from "next/link";
import { PlusIcon, AIIcon } from "@/constants/Icons";

export function EmptyPlannerState({ taskCount }: { taskCount: number }) {
  const remaining = 3 - taskCount;

  return (
    <div 
      className="flex flex-col items-center justify-center py-20 px-6 rounded-3xl text-center"
      style={{
        background: "linear-gradient(145deg, #0d0d12 0%, #08080a 100%)",
        border: "1px dashed #222",
      }}
    >
      <div 
        className="mb-8 p-6 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(124, 106, 240, 0.1) 0%, transparent 70%)",
        }}
      >
        <div 
          className="flex items-center justify-center rounded-2xl"
          style={{
            width: "64px",
            height: "64px",
            background: "#16161a",
            border: "1px solid #252525",
            color: "#7c6af0"
          }}
        >
          <AIIcon />
        </div>
      </div>

      <h2 className="text-white font-bold mb-3" style={{ fontSize: "24px", letterSpacing: "-0.02em" }}>
        System Idle
      </h2>
      <p className="text-[#666] mb-10 max-w-[360px] mx-auto" style={{ fontSize: "14px", lineHeight: 1.6 }}>
        The AI Planner requires more contextual input to generate an optimized daily plan. 
        Add <span className="text-[#7c6af0] font-bold">{remaining} more {remaining === 1 ? 'task' : 'tasks'}</span> to activate high-performance scheduling.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-[240px]">
        <Link
          href="/tasks"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #7c6af0, #5a4fd4)",
            boxShadow: "0 10px 20px -10px rgba(124, 106, 240, 0.4)",
            color: "#fff",
            fontSize: "14px",
            textDecoration: "none"
          }}
        >
          <PlusIcon />
          Add Tasks
        </Link>
        
        <div className="flex items-center justify-center gap-2 text-[#333]" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Current tasks: {taskCount} / 3
        </div>
      </div>
    </div>
  );
}
