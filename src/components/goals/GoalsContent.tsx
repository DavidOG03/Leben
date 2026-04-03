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
      <div className="grid" style={{ gridTemplateColumns: "180px 1fr" }}>
        <div
          className="flex flex-col items-center justify-center p-5 gap-3"
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
        <div className="p-5 flex flex-col gap-3">
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
  const [showModal, setShowModal] = useState(false);

  const topGoals = goals.slice(0, 3);
  const financialGoal = goals.find(
    (g) => g.title.toLowerCase().includes("financ") || g.icon === "💰",
  );

  // Books stats derived from actual books store -- no proxy through goal milestones
  const booksStats = deriveBooksStats(books);
  const hasBooks = books.length > 0;
  const activeBook = books.find((b) => b.status === "reading") ?? null;

  const hasGoals = goals.length > 0;

  return (
    <main className="flex-1 overflow-y-auto" style={{ padding: "32px 32px" }}>
      {/* Hero */}
      <div className="flex items-start justify-between mb-8">
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
      <div
        className="grid gap-5 mb-6"
        style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
      >
        {!hasGoals
          ? [0, 1, 2].map((i) => <GoalCardSkeleton key={i} />)
          : topGoals.map((g) => <GoalCard key={g.id} goal={g} />)}
      </div>

      {/* Bottom row */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Financial goal */}
        {financialGoal ? (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid #1e1e1e", backgroundColor: "#111" }}
          >
            <div className="grid" style={{ gridTemplateColumns: "180px 1fr" }}>
              <div
                className="flex flex-col items-center justify-center p-5"
                style={{
                  background: "linear-gradient(135deg,#141414,#0e0e0e)",
                  borderRight: "1px solid #1a1a1a",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-xl mb-3"
                  style={{
                    width: "52px",
                    height: "52px",
                    background: "linear-gradient(135deg,#1e1e30,#141428)",
                    border: "1px solid #252535",
                    fontSize: "26px",
                  }}
                >
                  {financialGoal.icon}
                </div>
                <p
                  className="font-bold text-white text-center"
                  style={{
                    fontSize: "15px",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                  }}
                >
                  {financialGoal.title}
                </p>
              </div>
              <div className="p-5">
                {(() => {
                  const { progress } = deriveGoalStats(financialGoal);
                  return (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#555",
                            marginTop: "4px",
                          }}
                        >
                          {
                            financialGoal.milestones.filter((m) => m.done)
                              .length
                          }{" "}
                          of {financialGoal.milestones.length} milestones done
                        </p>
                        <div className="text-right">
                          <p
                            className="font-black"
                            style={{
                              fontSize: "26px",
                              color: "#7c6af0",
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {progress}%
                          </p>
                          <p
                            style={{
                              fontSize: "9px",
                              color: "#555",
                              letterSpacing: "0.08em",
                            }}
                          >
                            TOTAL GOAL
                          </p>
                        </div>
                      </div>
                      <div
                        className="rounded-full overflow-hidden mb-4"
                        style={{ height: "3px", backgroundColor: "#1e1e1e" }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                            background:
                              "linear-gradient(90deg,#5a4fd4,#7c6af0)",
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2 mb-4">
                        {financialGoal.milestones.slice(0, 2).map((m) => (
                          <p
                            key={m.id}
                            style={{
                              fontSize: "12px",
                              color: m.done ? "#888" : "#555",
                            }}
                          >
                            {m.done ? "✓" : "○"} {m.label}
                          </p>
                        ))}
                      </div>
                      <button
                        className="w-full py-2.5 rounded-xl font-semibold transition-opacity hover:opacity-90"
                        style={{
                          backgroundColor: "#1e1e1e",
                          border: "1px solid #2a2a2a",
                          color: "#f0f0f0",
                          fontSize: "12px",
                        }}
                      >
                        Expand Goal Roadmap
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        ) : (
          <FinancialGoalSkeleton />
        )}

        {/* Books summary panel + AI Insight */}
        <div className="flex flex-col gap-4">
          {hasBooks ? (
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "16px" }}>📚</span>
                  <span
                    className="font-bold text-white"
                    style={{ fontSize: "15px", letterSpacing: "-0.01em" }}
                  >
                    Reading Tracker
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <Link
                    href="/habits#books"
                    className="text-white text-xs p-2 border rounded-lg"
                  >
                    Go to Books
                  </Link>
                  <span style={{ fontSize: "11px", color: "#555" }}>
                    {booksStats.completed}/{booksStats.total} done
                  </span>
                </div>
              </div>

              {/* Overall pages progress */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span style={{ fontSize: "11px", color: "#555" }}>
                    Overall progress
                  </span>
                  <span style={{ fontSize: "11px", color: "#888" }}>
                    {booksStats.overallProgress}%
                  </span>
                </div>
                <div
                  className="rounded-full overflow-hidden"
                  style={{ height: "3px", backgroundColor: "#1e1e1e" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${booksStats.overallProgress}%`,
                      background: "linear-gradient(90deg,#5a4fd4,#7c6af0)",
                    }}
                  />
                </div>
              </div>

              {/* Currently reading -- shows the active book */}
              {activeBook && (
                <div
                  className="rounded-xl p-3 mb-3"
                  style={{
                    backgroundColor: "#161616",
                    border: "1px solid #1e1e1e",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p
                        className="font-medium text-white"
                        style={{ fontSize: "13px" }}
                      >
                        {activeBook.title}
                      </p>
                      <p style={{ fontSize: "11px", color: "#555" }}>
                        {activeBook.author}
                      </p>
                    </div>
                    <div
                      className="rounded-lg flex-shrink-0"
                      style={{
                        width: "28px",
                        height: "36px",
                        backgroundColor: activeBook.coverColor,
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize: "10px", color: "#555" }}>
                      Page {activeBook.currentPage} of {activeBook.totalPages}
                    </span>
                    <span style={{ fontSize: "10px", color: "#7c6af0" }}>
                      {bookProgress(activeBook)}%
                    </span>
                  </div>
                  <div
                    className="rounded-full overflow-hidden"
                    style={{ height: "2px", backgroundColor: "#1a1a1a" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${bookProgress(activeBook)}%`,
                        backgroundColor: activeBook.coverColor,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Dot indicators for all books -- color coded by status */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {books.slice(0, 8).map((b) => (
                  <div
                    key={b.id}
                    title={`${b.title} — ${b.status}`}
                    className="rounded-full"
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor:
                        b.status === "completed"
                          ? "#7c6af0"
                          : b.status === "reading"
                            ? b.coverColor
                            : "#333",
                      opacity: b.status === "paused" ? 0.35 : 1,
                    }}
                  />
                ))}
                {books.length > 8 && (
                  <span style={{ fontSize: "10px", color: "#444" }}>
                    +{books.length - 8} more
                  </span>
                )}
              </div>
            </div>
          ) : (
            <BooksPanelSkeleton />
          )}

          <AIInsightPanel goals={goals} books={books} />
        </div>
      </div>

      {showModal && <AddGoalModal onClose={() => setShowModal(false)} />}
    </main>
  );
}
