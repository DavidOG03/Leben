"use client";

import React from "react";
import { NoteDocumentIcon } from "@/constants/Icons";

export default function EditorEmptyState() {
  return (
    <div
      className="hidden md:flex flex-1 flex-col items-center justify-center gap-4"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <div
        className="flex items-center justify-center rounded-2xl"
        style={{
          width: "64px",
          height: "64px",
          backgroundColor: "#111111",
          border: "1px solid #222222",
        }}
      >
        <NoteDocumentIcon />
      </div>
      <div className="text-center">
        <p
          className="font-medium"
          style={{ fontSize: "14px", color: "#888888" }}
        >
          Select a note to start editing
        </p>
        <p style={{ fontSize: "12px", color: "#555555", marginTop: "4px" }}>
          Or create a new note with the button on the left
        </p>
      </div>
    </div>
  );
}
