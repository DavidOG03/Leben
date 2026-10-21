"use client";

import React from "react";
import { LockIcon } from "@/constants/Icons";

export default function EditorLockedState({
  onUnlockRequest,
  onBackToList,
}: {
  onUnlockRequest?: () => void;
  onBackToList?: () => void;
}) {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center gap-4 p-6 sm:p-8 relative w-full h-full"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Mobile Back Button */}
      {onBackToList && (
        <button
          onClick={onBackToList}
          className="md:hidden absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-white/5 transition-colors"
          title="Back to notes list"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span style={{ fontSize: "12px", fontWeight: 500 }}>Notes</span>
        </button>
      )}
      <div
        className="flex items-center justify-center rounded-2xl"
        style={{
          width: "68px",
          height: "68px",
          background:
            "linear-gradient(135deg, rgba(124,106,240,0.22), rgba(124,106,240,0.06))",
          border: "1px solid rgba(124,106,240,0.3)",
          boxShadow: "0 0 35px rgba(124,106,240,0.2)",
        }}
      >
        <LockIcon width="30" height="30" stroke="#7c6af0" strokeWidth="1.8" />
      </div>
      <div className="text-center max-w-sm">
        <h3
          className="font-bold text-[#f0f0f0] mb-2"
          style={{ fontSize: "20px", letterSpacing: "-0.01em" }}
        >
          Personal Note is Locked
        </h3>
        <p style={{ fontSize: "13px", color: "#888888", lineHeight: 1.6 }}>
          This note belongs to your encrypted Personal folder. Unlock your vault
          with your master password to view and edit its content.
        </p>
        <button
          onClick={onUnlockRequest}
          className="mt-5 px-6 py-2.5 rounded-xl font-medium text-white transition-opacity hover:opacity-90 flex items-center gap-2 mx-auto"
          style={{ backgroundColor: "#7c6af0", fontSize: "13px" }}
        >
          <LockIcon width="13" height="13" />
          Unlock Personal Vault
        </button>
      </div>
    </div>
  );
}
