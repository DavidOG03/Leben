"use client";

import { useState, useRef, useEffect } from "react";
import { useAIStore } from "@/store/useAIStore";
import { useLebenStore } from "@/store/useStore";
import { SparkleIcon } from "@/constants/Icons";

const suggestions = [
  { icon: "", label: "Analyze my productivity" },
  { icon: "", label: "Generate task list" },
  { icon: "", label: "Optimize my schedule" },
];

export default function AIChatPanel() {
  const { messages, addMessage, isThinking, setThinking } = useAIStore();
  const addTask = useLebenStore((s) => s.addTask);
  const [input, setInput] = useState("");
  const [importedMessageIds, setImportedMessageIds] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const renderInlineFormatting = (text: string) => {
    const parts: Array<string | JSX.Element> = [];
    const boldRegex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let keyIndex = 0;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <span key={`bold-${match.index}-${keyIndex++}`} className="font-semibold">
          {match[1]}
        </span>,
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  const parseAssistantContent = (content: string) => {
    const lines = content.split("\n");
    const blocks: Array<{
      type: "paragraph" | "list";
      content: string[];
    }> = [];
    let currentList: string[] = [];

    const flushList = () => {
      if (currentList.length > 0) {
        blocks.push({ type: "list", content: currentList });
        currentList = [];
      }
    };

    for (const line of lines) {
      const trimmed = line.trim();
      const listMatch = trimmed.match(/^([*+-])\s+(.*)$/);
      if (listMatch) {
        currentList.push(listMatch[2].trim());
        continue;
      }

      if (trimmed === "") {
        flushList();
        continue;
      }

      flushList();
      blocks.push({ type: "paragraph", content: [trimmed] });
    }
    flushList();

    return blocks;
  };

  const extractTaskItems = (content: string) => {
    return content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => /^([*+-])\s+/.test(line))
      .map((line) => line.replace(/^([*+-])\s+/, ""))
      .filter(Boolean);
  };

  const importAssistantTasks = (messageId: string, content: string) => {
    const items = extractTaskItems(content);
    if (items.length === 0) return;

    const now = new Date().toISOString();
    items.forEach((title) => {
      addTask({
        id: crypto.randomUUID(),
        title,
        completed: false,
        tag: "WORK",
        priority: "medium",
        date: now.slice(0, 10),
        createdAt: now,
      });
    });

    setImportedMessageIds((current) => ({ ...current, [messageId]: true }));
  };

  const renderAssistantMessage = (message: string) => {
    const blocks = parseAssistantContent(message);
    return blocks.map((block, index) => {
      if (block.type === "list") {
        return (
          <ul key={`list-${index}`} className="list-disc ml-5 space-y-1 text-[#ccc] text-[14px] leading-relaxed">
            {block.content.map((item, itemIndex) => (
              <li key={`item-${index}-${itemIndex}`}>{renderInlineFormatting(item)}</li>
            ))}
          </ul>
        );
      }

      return (
        <p key={`para-${index}`} className="text-[#ccc] text-[14px] leading-relaxed">
          {block.content.map((line, lineIndex) => (
            <span key={`line-${index}-${lineIndex}`}>{renderInlineFormatting(line)}</span>
          ))}
        </p>
      );
    });
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  async function sendMessage(text: string) {
    if (!text.trim() || isThinking) return;

    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      content: text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    addMessage(userMsg);
    setInput("");
    setThinking(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();

      if (data.text) {
        // Simple "streaming" effect
        const aiMsgId = (Date.now() + 1).toString();
        const fullContent = data.text;

        addMessage({
          id: aiMsgId,
          role: "assistant",
          content: fullContent, // In a real app we'd stream, here we simulate it
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setThinking(false);
    }
  }

  return (
    <div
      className="flex flex-col flex-1 overflow-hidden"
      style={{ borderRight: "1px solid #161616" }}
    >
      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-8 py-6 space-y-6 scroll-smooth"
      >
        {messages.map((msg) => (
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
                    <div className="space-y-3">{renderAssistantMessage(msg.content)}</div>
                    {extractTaskItems(msg.content).length > 0 && (
                      <button
                        type="button"
                        onClick={() => importAssistantTasks(msg.id, msg.content)}
                        disabled={importedMessageIds[msg.id]}
                        className="self-start rounded-lg px-3 py-2 text-[11px] font-semibold transition-colors"
                        style={{
                          backgroundColor: importedMessageIds[msg.id] ? "#2a2a2a" : "#2d2480",
                          color: importedMessageIds[msg.id] ? "#888" : "#fff",
                          border: importedMessageIds[msg.id] ? "1px solid #3a3a3a" : "1px solid #6258f2",
                        }}
                      >
                        {importedMessageIds[msg.id]
                          ? `Tasks added`
                          : `Import ${extractTaskItems(msg.content).length} task${extractTaskItems(msg.content).length > 1 ? "s" : ""}`}
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
                    YOU • {msg.time}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

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
              style={{
                backgroundColor: "#161616",
                border: "1px solid #1e1e1e",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#555] font-medium italic">
                  Neural engine processing...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion chips */}
      <div className="px-8 pb-4 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => sendMessage(s.label)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:bg-[#1a1a1a] hover:border-[#7c6af0]/50 group"
            style={{
              backgroundColor: "#0e0e0e",
              border: "1px solid #1a1a1a",
              color: "#888",
              fontSize: "12px",
            }}
          >
            <span className="group-hover:scale-110 transition-transform">
              {s.icon}
            </span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-8 pb-6 pt-2 border-t border-white/[0.02]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-end gap-3 rounded-2xl px-5 py-4 transition-all focus-within:border-[#7c6af0]/40"
          style={{ backgroundColor: "#0c0c0c", border: "1px solid #1e1e1e" }}
        >
          <button
            type="button"
            className="mb-1 text-[#444] hover:text-[#7c6af0] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1v14M1 8h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask neural engine..."
            className="flex-1 bg-transparent outline-none resize-none max-h-32 pt-0.5"
            style={{ fontSize: "14px", color: "#ccc" }}
            rows={1}
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="flex items-center justify-center rounded-xl flex-shrink-0 transition-all disabled:opacity-20 hover:scale-105"
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: input.trim() ? "#2d2480" : "#1a1a1a",
              border: "1px solid #3a3060",
              color: "#fff",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path
                d="M12 7H2M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
        <div className="flex items-center justify-center gap-2 mt-4 opacity-30">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/20" />
          <p
            style={{
              fontSize: "9px",
              color: "#888",
              letterSpacing: "0.15em",
              fontWeight: 700,
            }}
          >
            NEURAL ENGINE V1.0 • CORE RESPONSIVE
          </p>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/20" />
        </div>
      </div>

      <style jsx global>{`
        .scroll-smooth {
          scroll-behavior: smooth;
        }
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #1a1a1a;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #222;
        }
      `}</style>
    </div>
  );
}
