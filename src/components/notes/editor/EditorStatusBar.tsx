"use client";

import React from "react";
import type { EditorStatusBarProps } from "@/utils/notes.editor.types";
import { MarkdownFileIcon } from "@/constants/Icons";

export default function EditorStatusBar({
  saveState,
  wordCount,
  readTime,
  updatedAt,
  relativeTime,
}: EditorStatusBarProps) {
  return (
    <div
      className="flex items-center gap-5 px-6 py-2.5 flex-shrink-0"
      style={{ borderTop: "1px solid #222222" }}
    >
      <div className="flex items-center gap-1.5">
        <div
          className="rounded-full transition-colors"
          style={{
            width: "6px",
            height: "6px",
            backgroundColor:
              saveState === "saved"
                ? "#4caf7d"
                : saveState === "saving"
                  ? "#f0a44f"
                  : "#555555",
          }}
        />
        <span style={{ fontSize: "10px", color: "#888888" }}>
          {saveState === "saved"
            ? "Saved"
            : saveState === "saving"
              ? "Saving…"
              : "Unsaved changes"}
        </span>
      </div>
      <span style={{ fontSize: "10px", color: "#555555" }}>
        {wordCount.toLocaleString()} words
      </span>
      <span style={{ fontSize: "10px", color: "#555555" }}>
        {readTime} min read
      </span>
      <span style={{ fontSize: "10px", color: "#555555" }}>
        Edited {relativeTime(updatedAt)}
      </span>
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <MarkdownFileIcon />
        <span style={{ fontSize: "10px", color: "#555555" }}>Rich Text</span>
      </div>
    </div>
  );
}
