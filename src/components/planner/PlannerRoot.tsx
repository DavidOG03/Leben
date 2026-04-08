"use client";

import { useState, useEffect } from "react";
import { useLebenStore } from "@/store/useStore";
import type { ScheduleItem } from "@/store/useStore";
import { Timeline } from "./Timeline";
import { AIInsightsCard } from "./AIInsightsCard";
import { TodaysFocusCard } from "./TodaysFocusCard";
import { EnergyDistribution } from "./EnergyDistribution";
import { UnscheduledTasks } from "./UnscheduledTasks";
import { EmptyPlannerState } from "./EmptyPlannerState";
import {
  RefreshIcon,
  PlusIcon,
  LightningIcon,
  TrashIcon,
} from "@/constants/Icons";
import { generateDayPlan } from "@/lib/ai/aiPlanner";

export function PlannerRoot() {
  const tasks = useLebenStore((s) => s.tasks);
  const habits = useLebenStore((s) => s.habits);
  const goals = useLebenStore((s) => s.goals);
  const schedule = useLebenStore((s) => s.schedule);
  const setSchedule = useLebenStore((s) => s.setSchedule);

  const [isRegenerating, setIsRegenerating] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const isAlive = tasks.length > 2;

  // Auto-generate on first load if schedule is empty
  useEffect(() => {
    if (isAlive && schedule.length === 0 && !isRegenerating) {
      handleRegenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAlive]);

  // After (matches your store)
  const todaysFocus = tasks
    .filter((t) => !t.completed && t.priority === "high")
    .slice(0, 3)
    .map((t) => ({
      title: t.title,
      reason: t.category
        ? `${t.category.toUpperCase()} • HIGH PRIORITY`
        : t.tag
          ? `${t.tag} • HIGH PRIORITY` // fall back to the tag field you already have
          : "HIGH PRIORITY",
    }));
  // ─── Regenerate: calls Gemini with your real tasks ────────────────────────
  const handleRegenerate = async () => {
    if (!isAlive) return;

    setIsRegenerating(true);
    setInsightsLoading(true);

    try {
      // generateDayPlan is defined below - it calls Gemini
      const { schedule: newSchedule, insights } = await generateDayPlan({
        tasks,
        habits,
        goals,
      });

      setSchedule(newSchedule);
      setAiInsights(insights);
    } catch (err) {
      console.error("Planner AI failed:", err);
    } finally {
      setIsRegenerating(false);
      setInsightsLoading(false);
    }
  };

  if (!isAlive) {
    return <EmptyPlannerState taskCount={tasks.length} />;
  }

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-[#7c6af01a] text-[#7c6af0] font-bold text-[9px] tracking-widest border border-[#7c6af033]">
              AI GENERATED
            </span>
            <span className="text-[#444] text-[11px] font-medium">
              Last synced 2m ago
            </span>
          </div>
          <h1
            className="text-white font-bold"
            style={{ fontSize: "32px", letterSpacing: "-0.03em" }}
          >
            Your Day, Planned
          </h1>
          <p
            className="text-[#666]"
            style={{ fontSize: "14px", maxWidth: "480px" }}
          >
            Optimized for your current energy peaks and high-priority
            deliverables.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          style={{
            background: "#161616",
            border: "1px solid #222",
            color: "#eee",
            fontSize: "13px",
          }}
        >
          <RefreshIcon className={isRegenerating ? "animate-spin" : ""} />
          {isRegenerating ? "Regenerating..." : "Regenerate Plan"}
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-white font-bold" style={{ fontSize: "18px" }}>
              Timeline
            </h3>
            <button
              className="p-2 rounded-lg bg-[#111] border border-[#1e1e1e] text-[#444] hover:text-[#666]"
              aria-label="Filter timeline"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 4.5h9M4 7h6M5.5 9.5h3"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <Timeline />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Pass real AI insights - loading state handled inside AIInsightsCard */}
          <AIInsightsCard insights={aiInsights} isLoading={insightsLoading} />

          {/* Pass real focus items derived from high-priority tasks */}
          <TodaysFocusCard focusItems={todaysFocus} />

          <EnergyDistribution />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#111] border border-[#1e1e1e] text-[#666] font-bold text-[13px] hover:bg-white/[0.02]">
            <PlusIcon /> Add Task
          </button>
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#111] border border-[#1e1e1e] text-[#666] font-bold text-[13px] hover:bg-white/[0.02]">
            <LightningIcon /> Adjust Plan
          </button>
          <button
            onClick={() => setSchedule([])}
            className="ml-auto flex items-center gap-2 px-5 py-3 rounded-xl hover:text-red-400 text-[#444] font-bold text-[13px]"
          >
            <TrashIcon /> Clear Schedule
          </button>
        </div>
        <UnscheduledTasks />
      </div>
    </div>
  );
}
