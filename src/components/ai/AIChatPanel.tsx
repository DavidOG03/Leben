"use client";

import { useEffect, useRef } from "react";
import AIChatMessages from "./AIChatMessages";
import { useAIChatPanel } from "../../hooks/useAIChatPanel";

const suggestions = [
  { icon: "", label: "Analyze my productivity" },
  { icon: "", label: "Generate task list" },
  { icon: "", label: "Optimize my schedule" },
];

export default function AIChatPanel() {
  const {
    messages,
    input,
    setInput,
    isThinking,
    importedMessageIds,
    sendMessage,
    importAssistantMessage,
  } = useAIChatPanel();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isThinking]);

  return (
    <div
      className="flex flex-col flex-1 overflow-hidden"
      style={{ borderRight: "1px solid #161616" }}
    >
      <AIChatMessages
        messages={messages}
        isThinking={isThinking}
        importedMessageIds={importedMessageIds}
        onImport={importAssistantMessage}
        scrollRef={scrollRef}
      />

      <div className="px-8 pb-4 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.label}
            onClick={() => sendMessage(suggestion.label)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:bg-[#1a1a1a] hover:border-[#7c6af0]/50 group"
            style={{
              backgroundColor: "#0e0e0e",
              border: "1px solid #1a1a1a",
              color: "#888",
              fontSize: "12px",
            }}
          >
            <span className="group-hover:scale-110 transition-transform">
              {suggestion.icon}
            </span>
            {suggestion.label}
          </button>
        ))}
      </div>

      <div className="px-8 pb-6 pt-2 border-t border-white/[0.02]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-3 rounded-2xl px-5 py-4 transition-all focus-within:border-[#7c6af0]/40"
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
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
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
            NEURAL ENGINE V1.0
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
