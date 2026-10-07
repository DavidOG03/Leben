"use client";

import type { RefObject } from "react";
import React from "react";
import { SparkleIcon } from "@/constants/Icons";
import {
  getImportStateKey,
  getImportButtonLabel,
  parseAssistantContent,
  parseStructuredListItems,
} from "@/utils/aiChatImportUtils";
import type { ChatMessage, ImportKind } from "@/utils/aiChatTypes";

function renderInlineFormatting(text: string) {
  const parts: Array<string | React.JSX.Element> = [];
  const boldRegex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIndex = 0;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <span key={`bold-${match.index}-${keyIndex++}`} className="font-semibold text-white">
        {match[1]}
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function renderAssistantMessage(
  msgId: string,
  message: string,
  importedMessageIds: Record<string, boolean>,
  onImportItem: (msgId: string, itemIndex: string | number, item: any) => void
) {
  return parseAssistantContent(message).map((block, index) => {
    if (block.type === "heading") {
      const fontSize =
        block.headingLevel === 1 ? "22px" : block.headingLevel === 2 ? "20px" : "18px";
      return (
        <h3
          key={`heading-${index}`}
          className="font-bold text-white mt-4 mb-2"
          style={{ fontSize }}
        >
          {renderInlineFormatting(block.content)}
        </h3>
      );
    }

    if (block.type === "list") {
      return (
        <div key={`list-${index}`} className="flex flex-col gap-2 mt-3">
          {block.items.map((item, itemIndex) => {
            const itemKey = `${index}-${itemIndex}`;
            const importKey = `${msgId}-${itemKey}`;
            const isImported = Boolean(importedMessageIds[importKey]);

            const config =
              item.kind === "task"
                ? { bullet: "—", color: "#6b7fff", label: "Add Task" }
                : item.kind === "habit"
                  ? { bullet: "+", color: "#4caf7d", label: "Track Habit" }
                  : item.kind === "goal"
                    ? { bullet: "›", color: "#e8a855", label: "Set Goal" }
                    : item.kind === "book"
                      ? { bullet: "~", color: "#a78bfa", label: "Read Book" }
                      : { bullet: item.bullet || "•", color: "#888", label: "" };

            return (
              <div key={`item-${index}-${itemIndex}`} className="flex items-start mb-2">
                <span
                  style={{
                    color: config.color,
                    fontSize: "14px",
                    marginRight: "8px",
                    fontWeight: "700",
                    marginTop: "2px",
                    minWidth: "16px",
                    display: "inline-block"
                  }}
                >
                  {config.bullet}
                </span>
                <div className="flex-1">
                  <p className="text-[#ccc] text-[14px] leading-relaxed m-0">
                    {renderInlineFormatting(item.text)}
                  </p>
                  {item.milestones && item.milestones.length > 0 && (
                    <div className="mt-1 ml-1 flex flex-col gap-1">
                      {item.milestones.map((ms, mi) => (
                        <span
                          key={`ms-${index}-${itemIndex}-${mi}`}
                          className="text-[#888] text-[12px] leading-snug"
                        >
                          ◦ {ms}
                        </span>
                      ))}
                    </div>
                  )}
                  {item.kind !== "unknown" && (
                    <button
                      type="button"
                      onClick={() => onImportItem(msgId, itemKey, item)}
                      disabled={isImported}
                      className="self-start rounded-lg px-3 py-1.5 mt-2 mb-1 text-[11px] font-semibold transition-colors"
                      style={{
                        backgroundColor: isImported
                          ? "#2a2a2a"
                          : "rgba(107, 127, 255, 0.15)",
                        color: isImported
                          ? "#888"
                          : "#fff",
                        border: isImported
                          ? "1px solid #3a3a3a"
                          : `1px solid ${config.color}60`,
                      }}
                    >
                      {isImported ? "Imported" : config.label}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <p
        key={`para-${index}`}
        className="text-[#ccc] text-[14px] leading-relaxed mt-3"
      >
        {block.content.map((line: string, lineIndex: number) => (
          <React.Fragment key={`line-${index}-${lineIndex}`}>
            {lineIndex > 0 ? <br /> : null}
            {renderInlineFormatting(line)}
          </React.Fragment>
        ))}
      </p>
    );
  });
}

type Props = {
  messages: ChatMessage[];
  isThinking: boolean;
  thinkingStatus?: string;
  errorState?: { failedPrompt: string; errorMessage: string } | null;
  retryRequest?: () => void;
  importedMessageIds: Record<string, boolean>;
  onImport: (msgId: string, itemIndex: string | number, item: any) => void;
  onDeleteMessage?: (id: string) => void;
  scrollRef: RefObject<HTMLDivElement>;
};

export default function AIChatMessages({
  messages,
  isThinking,
  thinkingStatus = "Neural engine processing...",
  errorState,
  retryRequest,
  importedMessageIds,
  onImport,
  onDeleteMessage,
  scrollRef,
}: Props) {
  const [selectedMessageId, setSelectedMessageId] = React.useState<string | null>(null);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-8 py-6 space-y-6 scroll-smooth"
    >
      {messages.map((msg) => {
        return (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {msg.role === "assistant" && (
              <div
                className="flex items-center justify-center rounded-xl flex-shrink-0 self-start mt-1"
                style={{
                  width: "32px",
                  height: "32px",
                  background: "linear-gradient(135deg,#4a3fcc,#2d2480)",
                  border: "1px solid rgba(124,106,240,0.3)",
                }}
              >
                <SparkleIcon />
              </div>
            )}
            <div
              className={`max-w-[85%] ${msg.role === "user" ? "text-right" : ""}`}
            >
              {msg.role === "assistant" ? (
                <div
                  className="rounded-2xl px-5 py-4"
                  style={{
                    backgroundColor: "#161616",
                    border: "1px solid #1e1e1e",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  }}
                >
                  <div className="flex flex-col">
                    <div className="flex flex-col space-y-1">
                      {renderAssistantMessage(
                        msg.id,
                        msg.content,
                        importedMessageIds,
                        onImport
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 justify-end">
                  {selectedMessageId === msg.id && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMessageId(null);
                        if (onDeleteMessage) {
                          if (window.confirm("Are you sure you want to delete this message?")) {
                            onDeleteMessage(msg.id);
                          }
                        }
                      }}
                      className="flex items-center justify-center rounded-full w-8 h-8 self-center transition-colors hover:bg-red-500/20"
                      style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedMessageId(selectedMessageId === msg.id ? null : msg.id)}
                    className="rounded-2xl px-5 py-4 text-left inline-block transition-colors hover:bg-[#231f4a]"
                    style={{
                      backgroundColor: "#1e1a41",
                      border: "1px solid rgba(124,106,240,0.2)",
                      boxShadow: "0 4px 20px rgba(124,106,240,0.1)",
                      cursor: "pointer"
                    }}
                  >
                    <p className="text-[#e0e0e0] text-[14px] leading-relaxed m-0">
                      {msg.content}
                    </p>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#6358cc",
                        marginTop: "8px",
                        fontWeight: 600,
                        marginBottom: 0
                      }}
                      className="text-right"
                    >
                      YOU | {msg.time}
                    </p>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      {isThinking && (
        <div className="flex gap-4 animate-in fade-in duration-500">
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0 self-start mt-1"
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg,#4a3fcc,#2d2480)",
              border: "1px solid rgba(124,106,240,0.3)",
            }}
          >
            <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          </div>
          <div
            className="rounded-2xl px-5 py-4 flex items-center justify-center"
            style={{ backgroundColor: "#161616", border: "1px solid #1e1e1e" }}
          >
            <span className="text-[13px] text-[#888] font-medium italic">
              {thinkingStatus}
            </span>
          </div>
        </div>
      )}

      {errorState && (
        <div className="flex items-center justify-between rounded-xl px-4 py-3 mt-2 bg-red-500/10 border border-red-500/30">
          <span className="text-red-400 text-[13px] flex-1 mr-2">
            {errorState.errorMessage}
          </span>
          {retryRequest && (
            <button
              onClick={retryRequest}
              className="bg-red-500/20 hover:bg-red-500/30 transition-colors px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-[12px] font-medium"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}
