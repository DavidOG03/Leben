"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLebenStore } from "@/store/useStore";
import HabitsContent from "@/components/habits/HabitsContent";
import GoalsContent from "@/components/goals/GoalsContent";
import ReadingTracker from "@/components/habits/ReadingTracker";
import AddBookModal from "@/components/habits/AddBookModal";

function FinanceComingSoon() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8">
      <div
        className="flex items-center justify-center rounded-2xl"
        style={{
          width: "72px",
          height: "72px",
          background: "linear-gradient(135deg,#1a1a2e,#0e0e1e)",
          border: "1px solid #252535",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7c6af0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>
      <div className="text-center">
        <span
          className="inline-block px-2 py-0.5 rounded-full mb-3"
          style={{ fontSize: "10px", backgroundColor: "#1e1a3a", color: "#7c6af0", letterSpacing: "0.1em" }}
        >
          COMING SOON
        </span>
        <h2 className="font-bold text-white mb-2" style={{ fontSize: "22px", letterSpacing: "-0.02em" }}>
          Finance Tracker
        </h2>
        <p style={{ fontSize: "13px", color: "#555", maxWidth: "320px", lineHeight: 1.6 }}>
          Track income, expenses, and savings goals. Full budgeting and financial analytics — coming soon.
        </p>
      </div>
    </div>
  );
}

function ReadingTab() {
  const books = useLebenStore((s: any) => s.books);
  const addBook = useLebenStore((s: any) => s.addBook);
  const [showAddBook, setShowAddBook] = useState(false);

  return (
    <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-8" style={{ backgroundColor: "#0a0a0a" }}>
      {showAddBook && (
        <AddBookModal
          onAdd={addBook}
          onClose={() => setShowAddBook(false)}
        />
      )}
      <ReadingTracker onShowAddBook={setShowAddBook} books={books} />
    </main>
  );
}

function TrackersContentInner() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "habits";

  if (activeTab === "goals") return <GoalsContent />;
  if (activeTab === "reading") return <ReadingTab />;
  if (activeTab === "finance") return <FinanceComingSoon />;
  return <HabitsContent />;
}

export default function TrackersContent() {
  return (
    <Suspense fallback={<div className="flex-1" style={{ backgroundColor: "#0a0a0a" }} />}>
      <TrackersContentInner />
    </Suspense>
  );
}
