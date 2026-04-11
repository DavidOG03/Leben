"use client";

import { useState } from "react";
import { today, calcStreak, buildAllHabitsMatrix } from "@/utils/habits";
import { useLebenStore, Habit } from "@/store/useStore";
import type { Book } from "../../utils/habits.types";
import AddHabitModal from "./AddHabitModal";
import AddBookModal from "./AddBookModal";
import DailyRituals from "./DailyRituals";
import WeeklyProgress from "./WeeklyProgress";
import ReadingTracker from "./ReadingTracker";
import ConsistencyScore from "./ConsistencyScore";
import CommitmentTracker from "./CommitmentTracker";

/* ── Main ──────────────────────────────────────────── */
export default function HabitsContent() {
  const habits = useLebenStore((s: any) => s.habits);
  const addHabitToStore = useLebenStore((s: any) => s.addHabit);
  const toggleHabit = useLebenStore((s: any) => s.toggleHabit);
  const books = useLebenStore((s: any) => s.books);
  const addBookToStore = useLebenStore((s: any) => s.addBook);

  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  /* habit actions */
  const addHabit = (h: Habit) => {
    addHabitToStore(h);
    if (!selectedHabitId) setSelectedHabitId(h.id);
  };

  /* derived */
  const activeHabit =
    habits.find((h: Habit) => h.id === selectedHabitId) ??
    habits[0] ??
    null;
  // const allHabitsMatrix = buildAllHabitsMatrix(habits);
  const currentlyReading = books.filter(
    (b: Book) => b.currentPage < b.totalPages,
  );
  void activeHabit; // kept for habit card selection highlight

  return (
    <main
      className="flex-1 overflow-y-auto"
      style={{ padding: "24px 32px", backgroundColor: "#0a0a0a" }}
    >
      {showAddHabit && (
        <AddHabitModal
          onAdd={addHabit}
          onClose={() => setShowAddHabit(false)}
        />
      )}
      {showAddBook && (
        <AddBookModal
          onAdd={addBookToStore}
          onClose={() => setShowAddBook(false)}
        />
      )}

      {/* Stats row */}
      <div
        className="grid gap-4 mb-6"
        style={{ gridTemplateColumns: "1fr 1fr" }}
      >
        <ConsistencyScore
          habits={habits}
          books={books}
        />
        <WeeklyProgress habits={habits} />
      </div>

      <DailyRituals
        habits={habits}
        activeHabit={activeHabit}
        toggleHabit={toggleHabit}
        onSelectedHabitId={setSelectedHabitId}
        setShowAddHabit={setShowAddHabit}
      />

      <CommitmentTracker />

      <ReadingTracker onShowAddBook={setShowAddBook} books={books} />

      {/* Footer quote */}
      <div
        className="flex items-center justify-between rounded-2xl p-8"
        style={{ backgroundColor: "#0e0e0e", border: "1px solid #161616" }}
      >
        <div style={{ maxWidth: "380px" }}>
          <p
            className="font-black text-white"
            style={{
              fontSize: "22px",
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
            }}
          >
            &ldquo;We are what we repeatedly do. Excellence, then, is not an
            act, but a habit.&rdquo;
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div
              className="rounded-full"
              style={{ width: "32px", height: "1px", backgroundColor: "#444" }}
            />
            <span style={{ fontSize: "12px", color: "#555" }}>Aristotle</span>
          </div>
        </div>
        <div className="text-right">
          <p
            style={{
              fontSize: "9px",
              color: "#555",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Currently Reading
          </p>
          {currentlyReading.length > 0 ? (
            <div>
              <p className="font-bold text-white" style={{ fontSize: "14px" }}>
                {currentlyReading[0].title}
              </p>
              <p style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>
                by {currentlyReading[0].author} ·{" "}
                {Math.round(
                  (currentlyReading[0].currentPage /
                    currentlyReading[0].totalPages) *
                    100,
                )}
                % done
              </p>
            </div>
          ) : (
            <p style={{ fontSize: "13px", color: "#333" }}>
              Nothing tracked yet
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
