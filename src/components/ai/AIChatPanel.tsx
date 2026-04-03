"use client";

import { useState } from "react";

interface Message {
  id: number;
  role: "assistant" | "user";
  content: string;
  time: string;
  thinking?: boolean;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Good morning. I've analyzed your upcoming schedule and previous productivity patterns. Today looks optimal for deep work between 10 AM and 1 PM.",
    time: "08:30 AM",
  },
  {
    id: 2,
    role: "user",
    content: "Yes, please. Also, can you summarize my top 3 objectives for this week based on the project sync notes from yesterday?",
    time: "08:32 AM",
  },
  {
    id: 3,
    role: "assistant",
    content: "",
    time: "08:30 AM",
    thinking: true,
  },
];

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2l1.5 4L14 8l-4.5 1.5L8 14l-1.5-4.5L2 8l4.5-1.5L8 2z" stroke="white" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

const suggestions = [
  { icon: "📊", label: "Analyze my productivity" },
  { icon: "✦", label: "Generate task list" },
  { icon: "📅", label: "Optimize my schedule" },
];

export default function AIChatPanel() {
  const [messages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col flex-1 overflow-hidden" style={{ borderRight: "1px solid #161616" }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {msg.role === "assistant" && (
              <div className="flex items-center justify-center rounded-xl flex-shrink-0 self-start mt-1" style={{ width: "32px", height: "32px", background: "linear-gradient(135deg,#4a3fcc,#2d2480)", border: "1px solid rgba(124,106,240,0.3)" }}>
                <SparkleIcon />
              </div>
            )}
            <div className="max-w-md">
              {msg.thinking ? (
                <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: "#161616", border: "1px solid #1e1e1e" }}>
                  <p style={{ fontSize: "11px", color: "#555", marginBottom: "6px" }}>ASSISTANT • {msg.time}</p>
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="rounded-full"
                        style={{
                          width: "6px", height: "6px",
                          backgroundColor: "#7c6af0",
                          animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                    <span style={{ fontSize: "12px", color: "#555", marginLeft: "4px" }}>Leben Assistant is thinking...</span>
                  </div>
                </div>
              ) : msg.role === "assistant" ? (
                <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: "#161616", border: "1px solid #1e1e1e" }}>
                  <p style={{ fontSize: "13px", color: "#ccc", lineHeight: 1.6 }}>{msg.content}</p>
                </div>
              ) : (
                <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: "#1e1a40", border: "1px solid rgba(124,106,240,0.2)" }}>
                  <p style={{ fontSize: "13px", color: "#e0e0e0", lineHeight: 1.6 }}>{msg.content}</p>
                  <p style={{ fontSize: "10px", color: "#555", marginTop: "6px", textAlign: "right" }}>YOU • {msg.time}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Suggestion chips */}
      <div className="px-8 pb-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s.label}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:border-purple-800"
            style={{ backgroundColor: "#141414", border: "1px solid #222", color: "#aaa", fontSize: "12px" }}
          >
            <span style={{ fontSize: "13px" }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-8 pb-5 pt-2">
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}
        >
          <button style={{ color: "#555", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message or ask for an insight..."
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: "13px", color: "#888" }}
          />
          <button
            className="flex items-center justify-center rounded-lg flex-shrink-0 transition-opacity hover:opacity-80"
            style={{ width: "32px", height: "32px", backgroundColor: "#1e1e1e", border: "1px solid #2a2a2a", color: "#888" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 7H2M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <p style={{ fontSize: "10px", color: "#2a2a2a", textAlign: "center", marginTop: "8px", letterSpacing: "0.06em" }}>
          NEURAL ENGINE V2.4 • SECURE END-TO-END ENCRYPTED
        </p>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}
