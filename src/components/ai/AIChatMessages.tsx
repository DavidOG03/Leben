"use client";

import type { RefObject } from "react";
import { SparkleIcon } from "@/constants/Icons";
import {
  getImportStateKey,
  getImportButtonLabel,
  parseAssistantContent,
  parseStructuredListItems,
} from "@/utils/aiChatImportUtils";
import type { ChatMessage, ImportKind } from "@/utils/aiChatTypes";

function renderInlineFormatting(text: string) {
  const parts: Array<string | JSX.Element> = [];
  const boldRegex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIndex = 0;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <span key={`bold-${match.index}-${keyIndex++}`} className="font-semibold">
        {match[1]}
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function renderAssistantMessage(message: string) {
  return parseAssistantContent(message).map((block, index) =>
    block.type === "list" ? (
      <ul
        key={`list-${index}`}
        className="list-disc ml-5 space-y-1 text-[#ccc] text-[14px] leading-relaxed"
      >
        {block.content.map((item, itemIndex) => (
          <li key={`item-${index}-${itemIndex}`}>
            {renderInlineFormatting(item)}
          </li>
        ))}
      </ul>
    ) : (
      <p
        key={`para-${index}`}
        className="text-[#ccc] text-[14px] leading-relaxed"
      >
        {block.content.map((line, lineIndex) => (
          <span key={`line-${index}-${lineIndex}`}>
            {renderInlineFormatting(line)}
          </span>
        ))}
      </p>
    ),
  );
}

type Props = {
  messages: ChatMessage[];
  isThinking: boolean;
  importedMessageIds: Record<string, boolean>;
  onImport: (messageId: string, content: string) => void;
  scrollRef: RefObject<HTMLDivElement>;
};

export default function AIChatMessages({
  messages,
  isThinking,
  importedMessageIds,
  onImport,
  scrollRef,
}: Props) {
  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-8 py-6 space-y-6 scroll-smooth"
    >
      {messages.map((msg) => {
        const items =
          msg.role === "assistant" ? parseStructuredListItems(msg.content) : [];
        const counts = items.reduce(
          (acc, item) => {
            acc[item.kind] = (acc[item.kind] ?? 0) + 1;
            return acc;
          },
          {} as Partial<Record<ImportKind, number>>,
        );
        const importKey = getImportStateKey(msg.id);

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
                  <div className="flex flex-col gap-3">
                    <div className="space-y-3">
                      {renderAssistantMessage(msg.content)}
                    </div>
                    {items.length > 0 && (
                      <button
                        type="button"
                        onClick={() => onImport(msg.id, msg.content)}
                        disabled={importedMessageIds[importKey]}
                        className="self-start rounded-lg px-3 py-2 text-[11px] font-semibold transition-colors"
                        style={{
                          backgroundColor: importedMessageIds[importKey]
                            ? "#2a2a2a"
                            : "#2d2480",
                          color: importedMessageIds[importKey]
                            ? "#888"
                            : "#fff",
                          border: importedMessageIds[importKey]
                            ? "1px solid #3a3a3a"
                            : "1px solid #6258f2",
                        }}
                      >
                        {getImportButtonLabel(
                          counts,
                          Boolean(importedMessageIds[importKey]),
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-2xl px-5 py-4 text-left"
                  style={{
                    backgroundColor: "#1e1a41",
                    border: "1px solid rgba(124,106,240,0.2)",
                    boxShadow: "0 4px 20px rgba(124,106,240,0.1)",
                  }}
                >
                  <p className="text-[#e0e0e0] text-[14px] leading-relaxed">
                    {msg.content}
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#6358cc",
                      marginTop: "8px",
                      fontWeight: 600,
                    }}
                  >
                    YOU | {msg.time}
                  </p>
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
            className="rounded-2xl px-5 py-4"
            style={{ backgroundColor: "#161616", border: "1px solid #1e1e1e" }}
          >
            <span className="text-[12px] text-[#555] font-medium italic">
              Neural engine processing...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
