"use client";

import { useState } from "react";

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative flex-shrink-0 rounded-full transition-colors"
      style={{ width: "42px", height: "24px", backgroundColor: on ? "#7c6af0" : "#2a2a2a", padding: "2px" }}
    >
      <div
        className="rounded-full bg-white transition-transform"
        style={{ width: "20px", height: "20px", transform: on ? "translateX(18px)" : "translateX(0)" }}
      />
    </button>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p className="uppercase tracking-widest mb-4" style={{ fontSize: "10px", color: "#3a3a3a", letterSpacing: "0.16em" }}>
      {text}
    </p>
  );
}

const intelligenceFeatures = [
  { id: "predictive", label: "Predictive Scheduling", sub: "Auto-arrange tasks based on focus windows", locked: false },
  { id: "summaries", label: "Smart Summaries", sub: "LLM-driven briefing for unread archives", locked: false },
  { id: "synthesis", label: "Contextual Synthesis", sub: "Beta feature: multi-document linking", locked: true },
];

export default function SettingsContent() {
  const [theme, setTheme] = useState<"Dark" | "Light">("Dark");
  const [notifs, setNotifs] = useState({ audio: true, email: false, push: true });
  const [neuralOn, setNeuralOn] = useState(true);
  const [features, setFeatures] = useState<Record<string, boolean>>({ predictive: true, summaries: true, synthesis: false });

  return (
    <main className="flex-1 overflow-y-auto" style={{ padding: "32px 40px", backgroundColor: "#0a0a0a" }}>
      {/* Profile section */}
      <div className="flex items-start gap-6 mb-8">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="rounded-2xl overflow-hidden" style={{ width: "88px", height: "88px", backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
            <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#2a2a3a,#1a1a28)" }}>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="17" r="8" fill="#666" /><path d="M5 40c0-9.4 7.6-17 17-17s17 7.6 17 17" fill="#666" /></svg>
            </div>
          </div>
          <button
            className="absolute bottom-1.5 right-1.5 flex items-center justify-center rounded-full"
            style={{ width: "22px", height: "22px", backgroundColor: "#1e1e1e", border: "1px solid #333" }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M7 1L9 3M1 9l.5-2L7 1 9 3l-5.5 5.5L1 9z" stroke="#888" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        {/* Name / badge */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-black text-white" style={{ fontSize: "26px", letterSpacing: "-0.02em" }}>Julian Thorne</h1>
            <span className="px-2.5 py-1 rounded-lg font-semibold" style={{ fontSize: "10px", backgroundColor: "rgba(124,106,240,0.15)", color: "#9d8ff5", border: "1px solid rgba(124,106,240,0.25)", letterSpacing: "0.06em" }}>
              PRO CURATOR
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "#555" }}>julian.thorne@leben.premium</p>
        </div>
      </div>

      {/* Display name + Workspace ID */}
      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {[
          { label: "DISPLAY NAME", val: "Julian Thorne" },
          { label: "WORKSPACE ID", val: "OS-8829-ALPHA" },
        ].map(({ label, val }) => (
          <div key={label} className="rounded-xl p-4" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
            <p style={{ fontSize: "9px", color: "#555", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>{label}</p>
            <p className="font-medium text-white" style={{ fontSize: "15px" }}>{val}</p>
          </div>
        ))}
      </div>

      {/* System Preferences */}
      <SectionLabel text="System Preferences" />
      <div className="space-y-3 mb-8">
        {/* Visual Theme */}
        <div className="rounded-xl p-5" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg" style={{ width: "34px", height: "34px", backgroundColor: "#1a1a1a", border: "1px solid #222" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#888" strokeWidth="1.3" /><path d="M8 2v12M2 8h12" stroke="#888" strokeWidth="1.3" strokeLinecap="round" /><path d="M8 2a6 6 0 010 12z" fill="#888" fillOpacity="0.4" /></svg>
              </div>
              <div>
                <p className="font-medium text-white" style={{ fontSize: "14px" }}>Visual Theme</p>
                <p style={{ fontSize: "11px", color: "#555" }}>Synchronize interface with circadian rhythm</p>
              </div>
            </div>
            <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid #2a2a2a" }}>
              {(["Dark", "Light"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className="px-4 py-1.5 transition-colors"
                  style={{ fontSize: "12px", backgroundColor: theme === t ? "#2a2a2a" : "transparent", color: theme === t ? "#f0f0f0" : "#555" }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notification Channels */}
        <div className="rounded-xl p-5" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center rounded-lg" style={{ width: "34px", height: "34px", backgroundColor: "#1a1a1a", border: "1px solid #222" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2a4.5 4.5 0 00-4.5 4.5v2.8L2 11h12l-1.5-1.7V6.5A4.5 4.5 0 008 2z" stroke="#888" strokeWidth="1.3" strokeLinejoin="round" /><path d="M6 13a2 2 0 004 0" stroke="#888" strokeWidth="1.3" strokeLinecap="round" /></svg>
            </div>
            <div>
              <p className="font-medium text-white" style={{ fontSize: "14px" }}>Notification Channels</p>
              <p style={{ fontSize: "11px", color: "#555" }}>Manage how Leben communicates vital updates</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            {[
              { key: "audio" as const, label: "System Audio" },
              { key: "email" as const, label: "Email Digests" },
              { key: "push" as const, label: "Mobile Push" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <span style={{ fontSize: "13px", color: "#aaa" }}>{label}</span>
                <Toggle on={notifs[key]} onChange={() => setNotifs((p) => ({ ...p, [key]: !p[key] }))} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Intelligence Layer */}
      <SectionLabel text="Intelligence Layer" />
      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Neural Engine */}
        <div className="rounded-xl p-5" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-white" style={{ fontSize: "15px" }}>Neural Engine v2.4</p>
                <span className="px-2 py-0.5 rounded font-semibold" style={{ fontSize: "9px", backgroundColor: "rgba(74,200,120,0.15)", color: "#4ac878", border: "1px solid rgba(74,200,120,0.25)", letterSpacing: "0.08em" }}>STABLE</span>
              </div>
              <p style={{ fontSize: "12px", color: "#555", lineHeight: 1.5 }}>Advanced synaptic processing for deep pattern recognition across your workspace.</p>
            </div>
            <Toggle on={neuralOn} onChange={() => setNeuralOn((v) => !v)} />
          </div>
          <div className="mt-4">
            <div className="flex justify-between mb-1.5">
              <span style={{ fontSize: "10px", color: "#444" }}></span>
              <span style={{ fontSize: "10px", color: "#555" }}>LOAD: 24%</span>
            </div>
            <div className="rounded-full overflow-hidden" style={{ height: "3px", backgroundColor: "#1a1a1a" }}>
              <div className="h-full rounded-full" style={{ width: "24%", background: "linear-gradient(90deg,#5a4fd4,#7c6af0)" }} />
            </div>
          </div>
        </div>

        {/* Feature toggles */}
        <div className="space-y-3">
          {intelligenceFeatures.map((feat) => (
            <div key={feat.id} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e", opacity: feat.locked ? 0.6 : 1 }}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-lg" style={{ width: "28px", height: "28px", backgroundColor: "#1a1a1a" }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2" width="11" height="9" rx="1.3" stroke="#666" strokeWidth="1.1" /><path d="M1 5h11M4 1v2M9 1v2" stroke="#666" strokeWidth="1.1" strokeLinecap="round" /></svg>
                </div>
                <div>
                  <p className="font-medium text-white" style={{ fontSize: "12px" }}>{feat.label}</p>
                  <p style={{ fontSize: "10px", color: "#555" }}>{feat.sub}</p>
                </div>
              </div>
              {feat.locked ? (
                <span className="px-2 py-1 rounded" style={{ fontSize: "9px", color: "#555", backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", letterSpacing: "0.08em" }}>LOCKED</span>
              ) : (
                <Toggle on={features[feat.id]} onChange={() => setFeatures((p) => ({ ...p, [feat.id]: !p[feat.id] }))} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="flex items-center justify-between rounded-xl px-6 py-5" style={{ backgroundColor: "#110a0a", border: "1px solid #2a1515" }}>
        <div>
          <p className="font-bold mb-1" style={{ fontSize: "15px", color: "#e85555" }}>Workspace Termination</p>
          <p style={{ fontSize: "12px", color: "#666", maxWidth: "480px" }}>
            Permanently delete all neural mappings and stored insights. This action is irreversible.
          </p>
        </div>
        <button className="px-5 py-2.5 rounded-xl font-semibold transition-opacity hover:opacity-90" style={{ backgroundColor: "#e85555", color: "white", fontSize: "13px" }}>
          Purge Core
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6" style={{ paddingTop: "16px", borderTop: "1px solid #161616" }}>
        <span style={{ fontSize: "10px", color: "#2a2a2a", letterSpacing: "0.1em" }}>LAST SYNC: 2M AGO • LATENCY: 14MS</span>
        <span style={{ fontSize: "10px", color: "#2a2a2a", letterSpacing: "0.1em" }}>Leben V4.0.2 // BUILD 8283-CURATOR</span>
      </div>
    </main>
  );
}
