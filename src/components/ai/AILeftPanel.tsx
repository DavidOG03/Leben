"use client";

const navItems = [
  { label: "Quick Prompt", icon: <BoltIcon />, active: true },
  // { label: "Smart Tasks", icon: <CheckIcon /> },
  // { label: "Calendar", icon: <CalIcon /> },
  // { label: "Focus Mode", icon: <FocusIcon /> },
  // { label: "History", icon: <HistoryIcon /> },
];

const prompts = [
  { title: "Plan my day", sub: "Daily focus mapping" },
  { title: "Weekly review", sub: "Metric aggregation" },
  { title: "Summarize goals", sub: "Quarterly alignment" },
  { title: "Identify focus blocks", sub: "Calendar optimization" },
];

import {
  BoltIcon,
  CalIcon,
  CheckIcon,
  FocusIcon,
  HistoryIcon,
} from "@/constants/Icons";
import { useAIStore } from "@/store/useAIStore";

export default function AILeftPanel() {
  const { addMessage, setThinking, messages } = useAIStore();

  const handlePrompt = async (title: string) => {
    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      content: title,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    addMessage(userMsg);
    setThinking(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();

      if (data.text) {
        addMessage({
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.text,
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
  };

  return (
    <aside
      className="flex flex-col flex-shrink-0 overflow-y-auto"
      style={{
        width: "250px",
        borderRight: "1px solid #161616",
        backgroundColor: "#0c0c0c",
        padding: "24px 0",
      }}
    >
      {/* AI identity */}
      <div className="flex items-center gap-3 px-5 mb-6">
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{
            width: "40px",
            height: "40px",
            background: "linear-gradient(135deg,#4a3fcc,#2d2480)",
            border: "1px solid rgba(124,106,240,0.4)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 2l2 5.5L16 9l-5 1.5L9 16l-2-5.5L2 9l5-1.5L9 2z"
              stroke="white"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p
            className="font-bold text-white"
            style={{ fontSize: "14px", letterSpacing: "-0.01em" }}
          >
            Leben AI
          </p>
          <p style={{ fontSize: "11px", color: "#555" }}>Productivity Engine</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 mb-6 space-y-px">
        {navItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left"
            style={{
              backgroundColor: item.active ? "#1e1e1e" : "transparent",
              color: item.active ? "#f0f0f0" : "#555",
              fontSize: "13px",
              fontWeight: item.active ? 500 : 400,
            }}
          >
            <span style={{ color: item.active ? "#7c6af0" : "#444" }}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Quick Prompts */}
      <div className="px-5 flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#7c6af0] animate-pulse" />
          <p
            className="uppercase tracking-widest"
            style={{
              fontSize: "9px",
              color: "#3a3a3a",
              letterSpacing: "0.14em",
            }}
          >
            Quick Prompts
          </p>
        </div>
        <div className="space-y-2">
          {prompts.map((p) => (
            <button
              key={p.title}
              onClick={() => handlePrompt(p.title)}
              className="w-full text-left rounded-xl px-4 py-3 border border-[#1e1e1e] bg-[#141414] transition-all hover:bg-[#1a1a1a] hover:border-[#4a3fcc]/30 group"
            >
              <p
                className="font-medium text-white group-hover:text-[#7c6af0] transition-colors"
                style={{ fontSize: "13px" }}
              >
                {p.title}
              </p>
              <p style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>
                {p.sub}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Pro upgrade
      <div 
        className="mx-4 mt-5 rounded-xl p-4 relative overflow-hidden group transition-all hover:scale-[1.02]" 
        style={{ backgroundColor: "#121220", border: "1px solid #252535" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <p className="font-semibold mb-1" style={{ fontSize: "11px", color: "#7c6af0", letterSpacing: "0.06em", textTransform: "uppercase" }}>Pro Upgrade</p>
        <p style={{ fontSize: "11px", color: "#666", lineHeight: 1.5, marginBottom: "12px" }}>Unlock advanced neural processing for faster insights.</p>
        <button className="w-full py-2 rounded-lg font-semibold transition-all hover:shadow-[0_0_20px_rgba(124,106,240,0.3)] relative z-10" style={{ background: "linear-gradient(135deg,#5a4fd4,#7c6af0)", color: "white", fontSize: "12px" }}>
          Upgrade Now
        </button>
      </div> */}
    </aside>
  );
}
