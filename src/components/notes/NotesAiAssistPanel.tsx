"use client";

import React from "react";
import {
  SparkleIcon,
  SummaryIcon,
  ExtractIcon,
  ImproveIcon,
  ConnectionIcon,
  CloseIcon,
} from "@/constants/Icons";
import type { IconComponent } from "@/constants/Icons";
import type { AiAction } from "./NotesAiModal";

export interface NotesAiAssistPanelProps {
  wordCount: number;
  readTime: number;
  updatedAt: string;
  relativeTime: (iso: string) => string;
  aiAction: AiAction | null;
  aiLoading: boolean;
  onTriggerAi: (action: AiAction) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const AI_ACTIONS: Array<{
  action: AiAction;
  label: string;
  Icon: IconComponent;
}> = [
  { action: "summarize", label: "Summarize", Icon: SummaryIcon },
  { action: "extract_tasks", label: "Extract Tasks", Icon: ExtractIcon },
  { action: "improve_writing", label: "Improve Writing", Icon: ImproveIcon },
  {
    action: "find_connections",
    label: "Find Connections",
    Icon: ConnectionIcon,
  },
];

export function NotesAiAssistPanel({
  wordCount,
  readTime,
  updatedAt,
  relativeTime,
  aiAction,
  aiLoading,
  onTriggerAi,
  isOpen = true,
  onClose,
}: NotesAiAssistPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay on screens < 1200px */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm xl:hidden"
        onClick={onClose}
      />

      <div
        className="fixed top-0 right-0 z-50 h-full w-[260px] sm:w-[280px] xl:relative xl:top-auto xl:right-auto xl:z-auto xl:w-[190px] flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out shadow-2xl xl:shadow-none overflow-y-auto"
        style={{
          borderLeft: "1px solid #222222",
          backgroundColor: "#111111",
        }}
      >
        {/* AI Status Header with Close Button */}
        <div
          className="p-3.5 sm:p-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid #222222" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                width: "28px",
                height: "28px",
                background:
                  "linear-gradient(135deg, rgba(124,106,240,0.2), rgba(124,106,240,0.05))",
                border: "1px solid rgba(124,106,240,0.25)",
              }}
            >
              <SparkleIcon
                width="13"
                height="13"
                color="#7c6af0"
                style={{ color: "#7c6af0" }}
              />
            </div>
            <div>
              <p
                style={{ fontSize: "12px", color: "#f0f0f0", fontWeight: 600 }}
              >
                AI Assist
              </p>
              <p style={{ fontSize: "10px", color: "#888888" }}>
                Smart note tools
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-[#888888] hover:text-white hover:bg-white/5 transition-colors"
              title="Close AI panel"
            >
              <CloseIcon width="13" height="13" />
            </button>
          )}
        </div>

        {/* AI Action Buttons */}
        <div className="p-3 space-y-1.5 flex-1">
          <p
            className="px-2 pt-1 pb-1 font-semibold uppercase"
            style={{
              fontSize: "9px",
              color: "#555555",
              letterSpacing: "0.1em",
            }}
          >
            ACTIONS
          </p>
          {AI_ACTIONS.map(({ action, label, Icon }) => {
            const isCurrentAction = aiAction === action && aiLoading;
            return (
              <button
                key={action}
                onClick={() => onTriggerAi(action)}
                disabled={wordCount === 0 || aiLoading}
                className="w-full text-left px-2.5 py-2.5 rounded-lg transition-colors hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-between group"
                style={{
                  fontSize: "12px",
                  color: isCurrentAction ? "#ffffff" : "#cccccc",
                  backgroundColor: isCurrentAction
                    ? "rgba(124,106,240,0.16)"
                    : "transparent",
                  border: isCurrentAction
                    ? "1px solid rgba(124,106,240,0.3)"
                    : "1px solid transparent",
                }}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <span className="flex-shrink-0" style={{ color: "#7c6af0" }}>
                    <Icon
                      width="14"
                      height="14"
                      color="#7c6af0"
                      style={{ color: "#7c6af0" }}
                      className="text-[#7c6af0]"
                    />
                  </span>
                  <span className="truncate">{label}</span>
                </span>

                {isCurrentAction && (
                  <span className="w-2.5 h-2.5 rounded-full border border-[#7c6af0] border-t-transparent animate-spin inline-block flex-shrink-0 ml-1" />
                )}
              </button>
            );
          })}

          {wordCount === 0 && (
            <p className="px-2 pt-2 text-[11px] text-[#666666] leading-relaxed">
              Write content in your note to generate summaries, tasks, or
              connections.
            </p>
          )}

          {/* Document Stats
          <div className="mt-5 pt-4 border-t border-[#222222] px-2 space-y-2">
            <p
              className="font-semibold uppercase"
              style={{
                fontSize: "9px",
                color: "#555555",
                letterSpacing: "0.1em",
              }}
            >
              DOCUMENT STATS
            </p>
            <div className="flex items-center justify-between text-[11px]">
              <span style={{ color: "#888888" }}>Words</span>
              <span style={{ color: "#f0f0f0", fontWeight: 500 }}>
                {wordCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span style={{ color: "#888888" }}>Read time</span>
              <span style={{ color: "#f0f0f0", fontWeight: 500 }}>
                ~{readTime} min
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span style={{ color: "#888888" }}>Last edited</span>
              <span style={{ color: "#888888" }}>
                {relativeTime(updatedAt)}
              </span>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default NotesAiAssistPanel;
