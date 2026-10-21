"use client";

import { useState } from "react";
import { useLebenStore } from "@/store/useStore";
import { deriveGoalStats } from "@/utils/goals.types";
import { deriveBooksStats, bookProgress } from "@/store/bookSlice";
import GoalCard from "@/components/goals/GoalsCard";
import AddGoalModal from "@/components/goals/AddGoalModal";
import AIInsightPanel from "@/components/goals/AiInsightPanel";
import Link from "next/link";

// ---- Skeletons ----

function GoalCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        backgroundColor: "#111",
        border: "1px solid #1e1e1e",
        minHeight: "260px",
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="rounded-xl"
          style={{ width: "48px", height: "48px", backgroundColor: "#1a1a1a" }}
        />
        <div
          className="rounded"
          style={{ width: "64px", height: "18px", backgroundColor: "#1a1a1a" }}
        />
      </div>
      <div
        className="rounded"
        style={{ width: "60%", height: "20px", backgroundColor: "#1a1a1a" }}
      />
      <div
        className="rounded"
        style={{ width: "40%", height: "12px", backgroundColor: "#161616" }}
      />
      <div
        className="rounded-full"
        style={{ height: "3px", backgroundColor: "#1a1a1a" }}
      />
      <div className="flex flex-col gap-2 mt-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="rounded-full"
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: "#1a1a1a",
              }}
            />
            <div
              className="rounded"
              style={{
                width: `${[55, 70, 45][i]}%`,
                height: "12px",
                backgroundColor: "#1a1a1a",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function FinancialGoalSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid #1e1e1e", backgroundColor: "#111" }}
    >
      <div className="flex flex-col sm:flex-row">
        <div
          className="flex flex-col items-center justify-center p-5 gap-3 sm:w-[180px] shrink-0"
          style={{ background: "#0e0e0e", borderRight: "1px solid #1a1a1a" }}
        >
          <div
            className="rounded-xl"
            style={{
              width: "52px",
              height: "52px",
              backgroundColor: "#1a1a1a",
            }}
          />
          <div
            className="rounded"
            style={{
              width: "80px",
              height: "16px",
              backgroundColor: "#1a1a1a",
            }}
          />
        </div>
        <div className="p-5 flex flex-col gap-3 flex-1">
          <div
            className="rounded"
            style={{ width: "60%", height: "22px", backgroundColor: "#1a1a1a" }}
          />
          <div
            className="rounded"
            style={{ width: "40%", height: "12px", backgroundColor: "#161616" }}
          />
          <div
            className="rounded-full"
            style={{ height: "3px", backgroundColor: "#1a1a1a" }}
          />
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: "1fr 1fr" }}
          >
            {[0, 1].map((i) => (
              <div
                key={i}
                className="rounded-xl p-3"
                style={{
                  backgroundColor: "#161616",
                  border: "1px solid #1e1e1e",
                  height: "52px",
                }}
              />
            ))}
          </div>
          <div
            className="rounded-xl"
            style={{ height: "36px", backgroundColor: "#161616" }}
          />
        </div>
      </div>
    </div>
  );
}

function BooksPanelSkeleton() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="rounded"
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#1a1a1a",
            }}
          />
          <div
            className="rounded"
            style={{
              width: "100px",
              height: "15px",
              backgroundColor: "#1a1a1a",
            }}
          />
        </div>
        <div
          className="rounded"
          style={{ width: "50px", height: "12px", backgroundColor: "#1a1a1a" }}
        />
      </div>
      <div
        className="rounded-full mb-4"
        style={{ height: "3px", backgroundColor: "#1a1a1a" }}
      />
      <div
        className="rounded-xl p-3 mb-3"
        style={{
          backgroundColor: "#161616",
          border: "1px solid #1e1e1e",
          height: "72px",
        }}
      />
      <div className="flex items-center gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#1a1a1a",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ---- Main component ----

export default function GoalsContent() {
  const goals = useLebenStore((s) => s.goals);
  const books = useLebenStore((s) => s.books);
  const habits = useLebenStore((s) => s.habits);
  const [showModal, setShowModal] = useState(false);

  const topGoals = goals;
  const financialGoal = goals.find(
    (g) => g.title.toLowerCase().includes("financ") || g.icon === "💰",
  );

  // Books stats derived from actual books store -- no proxy through goal milestones
  const booksStats = deriveBooksStats(books);
  const hasBooks = books.length > 0;
  const activeBook = books.find((b) => b.status === "reading") ?? null;

  const hasGoals = goals.length > 0;

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      {/* Hero */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-8">
        <div>
          <h1
            className="font-black text-white mb-2"
            style={{
              fontSize: "36px",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Focus on What Matters
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#555",
              lineHeight: 1.6,
              maxWidth: "480px",
            }}
          >
            {hasGoals
              ? `You have ${goals.length} active goal${goals.length > 1 ? "s" : ""}. Track progress and let AI surface what needs your attention.`
              : "Define your high-impact objectives. Your goals will come alive as you track progress and complete milestones."}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "#f0f0f0",
            color: "#0a0a0a",
            fontSize: "13px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1v12M1 7h12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          Add New Goal
        </button>
      </div>

      {/* Top 3 goal cards */}
      <div className="overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {!hasGoals
          ? [0, 1, 2].map((i) => <GoalCardSkeleton key={i} />)
          : topGoals.map((g) => <GoalCard key={g.id} goal={g} />)}
      </div>

      {showModal && <AddGoalModal onClose={() => setShowModal(false)} />}
    </main>
  );
}
