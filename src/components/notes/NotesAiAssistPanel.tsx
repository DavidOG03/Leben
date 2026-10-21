"use client";

import React from "react";
import {
  SparkleIcon,
  SummaryIcon,
  ExtractIcon,
  ImproveIcon,
  ConnectionIcon,
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
}: NotesAiAssistPanelProps) {
  return (
    <div
      className="flex-col flex-shrink-0 hidden lg:flex"
      style={{
        width: "186px",
        borderLeft: "1px solid #222222",
        backgroundColor: "#0a0a0a",
      }}
    >
      {/* AI Status Header */}
      <div className="p-4" style={{ borderBottom: "1px solid #222222" }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                width: "28px",
                height: "28px",
                background: "linear-gradient(135deg, rgba(124,106,240,0.2), rgba(124,106,240,0.05))",
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
            <p style={{ fontSize: "11px", color: "#888888", fontWeight: 600 }}>
              AI Assist
            </p>
          </div>
        </div>
        <p style={{ fontSize: "9px", color: "#555555" }}>
          {wordCount > 0 ? "" : "Start writing to get AI suggestions"}
        </p>
      </div>

      {/* AI Action Buttons */}
      <div className="p-3 space-y-1.5">
        {AI_ACTIONS.map(({ action, label, Icon }) => {
          const isCurrentAction = aiAction === action && aiLoading;
          return (
            <button
              key={action}
              onClick={() => onTriggerAi(action)}
              disabled={wordCount === 0 || aiLoading}
              className="w-full text-left px-2.5 py-2 rounded-lg transition-colors hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-between group"
              style={{
                fontSize: "11px",
                color: isCurrentAction ? "#ffffff" : "#888888",
                backgroundColor: isCurrentAction
                  ? "rgba(124,106,240,0.16)"
                  : "transparent",
                border: isCurrentAction
                  ? "1px solid rgba(124,106,240,0.3)"
                  : "1px solid transparent",
              }}
            >
              <span className="flex items-center gap-2 truncate">
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
      </div>
    </div>
  );
}

export default NotesAiAssistPanel;
