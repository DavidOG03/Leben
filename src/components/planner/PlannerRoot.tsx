"use client";

import { useState, useEffect } from "react";
import { useLebenStore } from "@/store/useStore";
import type { ScheduleItem } from "@/store/useStore";
import { Timeline } from "./Timeline";
import { AIInsightsCard } from "./AIInsightsCard";
import { TodaysFocusCard } from "./TodaysFocusCard";
import { EnergyDistribution } from "./EnergyDistribution";
import { EmptyPlannerState } from "./EmptyPlannerState";
import {
  RefreshIcon,
  PlusIcon,
  LightningIcon,
  TrashIcon,
} from "@/constants/Icons";
import { generateDayPlan } from "@/lib/ai/aiPlanner";
import { useRouter } from "next/navigation";

export function PlannerRoot() {
  const tasks = useLebenStore((s) => s.tasks);
  const habits = useLebenStore((s) => s.habits);
  const goals = useLebenStore((s) => s.goals);
  const schedule = useLebenStore((s) => s.schedule);
  const setSchedule = useLebenStore((s) => s.setSchedule);
  const router = useRouter();

  const [isRegenerating, setIsRegenerating] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [mainFocus, setMainFocus] = useState<{
    title: string;
    reason: string;
  } | null>(null);
  const [waitCountdown, setWaitCountdown] = useState<number | null>(null);

  const isAlive = tasks.length > 2;

  useEffect(() => {
    if (waitCountdown !== null && waitCountdown > 0) {
      const timer = setTimeout(() => setWaitCountdown(waitCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (waitCountdown === 0) {
      setWaitCountdown(null);
    }
  }, [waitCountdown]);

  // Auto-generate on first load if schedule is empty
  useEffect(() => {
    if (isAlive && schedule.length === 0 && !isRegenerating) {
      handleRegenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAlive]);

  // ─── Regenerate: calls Gemini with your real tasks ────────────────────────
  const handleRegenerate = async () => {
    if (!isAlive) return;

    setIsRegenerating(true);
    setInsightsLoading(true);
    setWaitCountdown(null);

    try {
      // generateDayPlan calls Gemini
      const {
        schedule: newSchedule,
        insights,
        mainFocus: newMainFocus,
      } = await generateDayPlan({ tasks, habits, goals }, (sec) =>
        setWaitCountdown(sec),
      );

      setSchedule(newSchedule);
      setAiInsights(insights);
      if (newMainFocus) setMainFocus(newMainFocus);
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
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
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

          {waitCountdown !== null && waitCountdown > 0 && (
            <div className="text-[12px] font-bold text-amber-500 animate-pulse mt-1 decoration-amber-500/30 w-fit rounded-lg py-1 px-3 bg-amber-500/10 border border-amber-500/20">
              API limits busy. Auto-retrying in {waitCountdown}s...
            </div>
          )}
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isRegenerating && waitCountdown === null} // Don't strictly disable if it's counting down, though it's nice to prevent double clicks
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          style={{
            background: "#161616",
            border: "1px solid #222",
            color: "#eee",
            fontSize: "13px",
            opacity: waitCountdown ? 0.8 : 1,
            pointerEvents: waitCountdown ? "none" : "auto",
          }}
        >
          <RefreshIcon className={isRegenerating ? "animate-spin" : ""} />
          {waitCountdown !== null && waitCountdown > 0
            ? "Retrying..."
            : isRegenerating
              ? "Regenerating..."
              : "Regenerate Plan"}
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

          <TodaysFocusCard focusItems={mainFocus ? [mainFocus] : []} />

          <EnergyDistribution />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            onClick={() => router.push("/tasks")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#111] border border-[#1e1e1e] text-[#666] font-bold text-[13px] hover:bg-white/[0.02]"
          >
            <PlusIcon /> Add Task
          </button>
          {/* <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#111] border border-[#1e1e1e] text-[#666] font-bold text-[13px] hover:bg-white/[0.02]">
            <LightningIcon /> Adjust Plan
          </button> */}
          <button
            onClick={() => setSchedule([])}
            className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl hover:text-red-400 text-[#444] font-bold text-[13px]"
          >
            <TrashIcon /> Clear Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
