"use client";

import { useState } from "react";
import { BOOK_COLORS } from "@/constants/habits";
import { BookFormData } from "@/store/bookSlice";

interface AddBookModalProps {
  onAdd: (b: BookFormData) => void;
  onClose: () => void;
}

export default function AddBookModal({ onAdd, onClose }: AddBookModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [color, setColor] = useState(BOOK_COLORS[0]);

  const handleAdd = () => {
    if (!title.trim() || !totalPages) return;
    onAdd({
      title: title.trim(),
      author: author.trim() || "Unknown Author",
      totalPages: parseInt(totalPages),
      coverColor: color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}>
      <div className="rounded-2xl p-6 w-full max-w-sm" style={{ backgroundColor: "#111", border: "1px solid #2a2a2a" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-white" style={{ fontSize: "16px" }}>Track a Book</h3>
          <button onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-all hover:opacity-70"
            style={{ width: "28px", height: "28px", backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#666", fontSize: "16px", lineHeight: 1 }}
            aria-label="Close">
            ×
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          {BOOK_COLORS.map((c) => (
            <button key={c} onClick={() => setColor(c)} className="rounded-full transition-all"
              style={{ width: "22px", height: "22px", backgroundColor: c, outline: color === c ? `2px solid ${c}` : "none", outlineOffset: "2px" }} />
          ))}
        </div>

        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Book title"
          className="w-full rounded-xl px-4 py-3 text-white outline-none mb-3 placeholder:text-gray-600"
          style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", fontSize: "13px" }} />
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author"
          className="w-full rounded-xl px-4 py-3 text-white outline-none mb-3 placeholder:text-gray-600"
          style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", fontSize: "13px" }} />
        <input value={totalPages} onChange={(e) => setTotalPages(e.target.value)} placeholder="Total pages" type="number"
          className="w-full rounded-xl px-4 py-3 text-white outline-none mb-5 placeholder:text-gray-600"
          style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", fontSize: "13px" }} />

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl py-2.5 font-semibold"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#666", fontSize: "13px" }}>Cancel</button>
          <button onClick={handleAdd} className="flex-1 rounded-xl py-2.5 font-semibold"
            style={{ backgroundColor: title.trim() && totalPages ? "#7c6af0" : "#2a2a2a", color: title.trim() && totalPages ? "#fff" : "#555", fontSize: "13px" }}>Add Book</button>
        </div>
      </div>
    </div>
  );
}
