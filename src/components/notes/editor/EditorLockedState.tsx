"use client";

import React from "react";
import { LockIcon } from "@/constants/Icons";

export default function EditorLockedState({
  onUnlockRequest,
}: {
  onUnlockRequest?: () => void;
}) {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center gap-4 p-8"
      style={{ backgroundColor: "#0a0a0a" }}
    >
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
