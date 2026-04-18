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
  // CalIcon,
  // CheckIcon,
  // FocusIcon,
  // HistoryIcon,
} from "@/constants/Icons";
import { useAIStore } from "@/store/useAIStore";
import { useState } from "react";

export default function AILeftPanel() {
  const { addMessage, setThinking, messages } = useAIStore();
  const [isOpen, setIsOpen] = useState(false);

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
    setIsOpen(false); // close panel after selecting a prompt on mobile

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

  const panelContent = (
    <>
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
    </>
  );

  return (
    <>
      {/* ── Mobile toggle button (absolutely positioned) ─────────── */}
      <button
        className="md:hidden absolute top-[68px] left-3 z-30 flex items-center justify-center rounded-lg transition-colors"
        style={{
          width: "30px",
          height: "30px",
          background: isOpen ? "rgba(124,106,240,0.15)" : "#161616",
          border: `1px solid ${isOpen ? "rgba(124,106,240,0.4)" : "#222"}`,
          color: isOpen ? "#7c6af0" : "#555",
        }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle prompts panel"
        title="Quick Prompts"
      >
        {/* Toggle panel icon (two vertical columns) */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect
            x="1"
            y="1"
            width="4"
            height="12"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <rect
            x="9"
            y="1"
            width="4"
            height="12"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        </svg>
      </button>

      {/* ── Mobile slide-in overlay ───────────────────────────────── */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-20"
          onClick={() => setIsOpen(false)}
          style={{ background: "rgba(0,0,0,0.5)" }}
        />
      )}
      <aside
        className={`
          md:hidden fixed top-[56px] left-0 bottom-0 z-20 flex flex-col overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          width: "260px",
          borderRight: "1px solid #161616",
          backgroundColor: "#0c0c0c",
          padding: "24px 0",
        }}
      >
        {panelContent}
      </aside>

      {/* ── Desktop: always-visible sidebar ──────────────────────── */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0 overflow-y-auto"
        style={{
          width: "250px",
          borderRight: "1px solid #161616",
          backgroundColor: "#0c0c0c",
          padding: "24px 0",
        }}
      >
        {panelContent}
      </aside>
    </>
  );
}
