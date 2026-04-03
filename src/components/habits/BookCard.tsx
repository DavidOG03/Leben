"use client";

import { useState } from "react";
import type { Book } from "@/store/bookSlice";
import { useLebenStore } from "@/store/useStore";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const updateBook = useLebenStore((s: any) => s.updateBook);
  const removeBook = useLebenStore((s: any) => s.removeBook);

  const [editingProgress, setEditingProgress] = useState(false);
  const [pageInput, setPageInput] = useState(String(book.currentPage));

  const [editingDetails, setEditingDetails] = useState(false);
  const [editTitle, setEditTitle] = useState(book.title);
  const [editAuthor, setEditAuthor] = useState(book.author);

  const pct = Math.min(
    100,
    book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0,
  );
  const pagesLeft = book.totalPages > 0 ? book.totalPages - book.currentPage : 0;

  const handleSaveProgress = () => {
    const p = Math.min(book.totalPages > 0 ? book.totalPages : 9999, Math.max(0, parseInt(pageInput) || 0));
    updateBook(book.id, { currentPage: p });
    setPageInput(String(p));
    setEditingProgress(false);
  };

  const handleSaveDetails = () => {
    updateBook(book.id, { title: editTitle, author: editAuthor });
    setEditingDetails(false);
  };

  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="flex items-center justify-center rounded-xl text-2xl"
          style={{
            width: "44px",
            height: "44px",
            background: `linear-gradient(135deg,${book.coverColor}22,${book.coverColor}0a)`,
            border: `1px solid ${book.coverColor}33`,
          }}
        >
          📖
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditingDetails(!editingDetails)}
            className="hover:opacity-80"
            style={{ color: "#888", fontSize: "14px", background: "transparent", border: "none" }}
            title="Edit Details"
          >
            ✏️
          </button>
          <button
            onClick={() => removeBook(book.id)}
            className="hover:opacity-80"
            style={{ color: "#444", fontSize: "18px", lineHeight: 1, background: "transparent", border: "none" }}
            title="Remove Book"
          >
            ×
          </button>
        </div>
      </div>

      {editingDetails ? (
        <div className="flex flex-col gap-2 mb-3">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="rounded-lg px-3 py-1.5 text-white outline-none"
            style={{ backgroundColor: "#1a1a1a", border: `1px solid ${book.coverColor}55`, fontSize: "14px" }}
            placeholder="Book Title"
            autoFocus
          />
          <input
            value={editAuthor}
            onChange={(e) => setEditAuthor(e.target.value)}
            className="rounded-lg px-3 py-1.5 text-white outline-none"
            style={{ backgroundColor: "#1a1a1a", border: `1px solid ${book.coverColor}55`, fontSize: "11px" }}
            placeholder="Author"
          />
          <button
            onClick={handleSaveDetails}
            className="rounded-lg px-3 py-1.5 font-semibold text-white mt-1 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: book.coverColor, fontSize: "12px" }}
          >
            Save Details
          </button>
        </div>
      ) : (
        <>
          <p
            className="font-bold text-white leading-tight mb-0.5"
            style={{ fontSize: "15px" }}
          >
            {book.title}
          </p>
          <p style={{ fontSize: "11px", color: "#555", marginBottom: "14px" }}>
            by {book.author}
          </p>
        </>
      )}

      <div
        className="rounded-full overflow-hidden mb-2"
        style={{ height: "4px", backgroundColor: "#1e1e1e" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${book.coverColor}99, ${book.coverColor})`,
          }}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <span style={{ fontSize: "11px", color: "#555" }}>
          {pagesLeft > 0 ? `${pagesLeft} pages left` : "Finished! 🎉"}
        </span>
        <span
          className="font-bold"
          style={{ fontSize: "13px", color: book.coverColor }}
        >
          {pct}%
        </span>
      </div>

      {editingProgress ? (
        <div className="flex flex-wrap gap-2">
          <input
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSaveProgress()}
            type="number"
            autoFocus
            className="flex-1 rounded-lg px-3 py-2 text-white outline-none"
            style={{
              backgroundColor: "#1a1a1a",
              border: `1px solid ${book.coverColor}55`,
              fontSize: "12px",
            }}
            placeholder={`0 – ${book.totalPages}`}
          />
          <button
            onClick={handleSaveProgress}
            className="rounded-lg px-3 py-2 font-semibold hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: book.coverColor,
              color: "#fff",
              fontSize: "12px",
              flexShrink: 0,
            }}
          >
            Save
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditingProgress(true)}
          className="w-full rounded-lg py-2 font-semibold transition-all hover:opacity-80"
          style={{
            backgroundColor: `${book.coverColor}18`,
            border: `1px solid ${book.coverColor}33`,
            color: book.coverColor,
            fontSize: "12px",
          }}
        >
          Update Progress · p.{book.currentPage}
        </button>
      )}
    </div>
  );
}
