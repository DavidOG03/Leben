"use client";

import React from "react";
import type { ToolbarButtonProps } from "@/utils/notes.editor.types";

export default function ToolbarButton({
  children,
  active,
  title,
  onMouseDown,
}: ToolbarButtonProps) {
  return (
    <button
      title={title}
      onMouseDown={onMouseDown}
      className="flex items-center justify-center rounded transition-colors hover:bg-white/10"
      style={{
        minWidth: "26px",
        height: "26px",
        padding: "0 5px",
        color: active ? "#7c6af0" : "#888888",
        fontWeight: active ? 700 : 500,
        fontSize: "12px",
        backgroundColor: active ? "rgba(124, 106, 240, 0.15)" : "transparent",
        border: active ? "1px solid rgba(124, 106, 240, 0.3)" : "1px solid transparent",
      }}
    >
      {children}
    </button>
  );
}
