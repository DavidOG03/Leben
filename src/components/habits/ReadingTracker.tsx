import React from "react";
import BookCard from "./BookCard";
import { GhostBookCard } from "./GhostCards";
import { ReadingTrackerProps } from "../../utils/habits.types";
import { Book, BookFormData } from "@/store/bookSlice";

const ReadingTracker: React.FC<ReadingTrackerProps> = ({
  onShowAddBook,
  books,
}: ReadingTrackerProps) => {
  return (
    <>
      {/* Reading Tracker */}
      <div id="books" className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className="font-bold text-white"
              style={{ fontSize: "18px", letterSpacing: "-0.01em" }}
            >
              Reading Tracker
            </h2>
            <p style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>
              Track every book you&apos;re working through.
            </p>
          </div>
          <button
            onClick={() => onShowAddBook(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all hover:opacity-80"
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #2a2a2a",
              color: "#ccc",
              fontSize: "12px",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path
                d="M5.5 1v9M1 5.5h9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            Add Book
          </button>
        </div>

        {books.length === 0 ? (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid #1e1e1e", backgroundColor: "#131313" }}
          >
            <div
              className="grid gap-4 p-4"
              style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
            >
              {[1, 0.65, 0.35].map((op, i) => (
                <GhostBookCard key={i} opacity={op} />
              ))}
            </div>
            <div
              className="flex flex-col items-center justify-center py-8 gap-3"
              style={{ borderTop: "1px solid #181818" }}
            >
              <span style={{ fontSize: "28px" }}>📚</span>
              <p
                className="font-medium"
                style={{ fontSize: "13px", color: "#333" }}
              >
                No books tracked yet
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#2a2a2a",
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                Click &ldquo;Add Book&rdquo; above
                <br />
                to start tracking your reading.
              </p>
            </div>
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            }}
          >
            {books.map((book: Book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ReadingTracker;
