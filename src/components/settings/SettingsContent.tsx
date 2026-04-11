"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLebenStore } from "@/store/useStore";

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative flex-shrink-0 rounded-full transition-colors"
      style={{
        width: "42px",
        height: "24px",
        backgroundColor: on ? "#7c6af0" : "#2a2a2a",
        padding: "2px",
      }}
    >
      <div
        className="rounded-full bg-white transition-transform"
        style={{
          width: "20px",
          height: "20px",
          transform: on ? "translateX(18px)" : "translateX(0)",
        }}
      />
    </button>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p
      className="uppercase tracking-widest mb-4"
      style={{ fontSize: "10px", color: "#3a3a3a", letterSpacing: "0.16em" }}
    >
      {text}
    </p>
  );
}

export default function SettingsContent() {
  const [theme, setTheme] = useState<"Dark" | "Light">("Dark");
  const [notifs, setNotifs] = useState({
    audio: true,
    email: false,
    push: true,
  });
  const [user, setUser] = useState<any>(null);

  const purgeAll = useLebenStore((s) => s.purgeAll);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      }
    });
  }, []);

  const handlePurge = () => {
    const confirmed = window.confirm(
      "CRITICAL WARNING:\n\nThis will permanently delete all tasks, habits, goals, and books from the server. This action is irreversible. \n\nAre you absolutely sure?",
    );
    if (confirmed) {
      purgeAll();
      alert("Workspace has been purged.");
    }
  };

  const displayName = user?.user_metadata?.full_name || "Leben User";
  const displayEmail = user?.email || "---";

  return (
    <main
      className="flex-1 overflow-y-auto p-4 md:px-10 md:py-8"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Profile section */}
      <div className="flex items-start gap-6 mb-8">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              width: "88px",
              height: "88px",
              backgroundColor: "#1a1a1a",
              border: "1px solid #2a2a2a",
            }}
          >
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#2a2a3a,#1a1a28)" }}
            >
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="17" r="8" fill="#666" />
                <path d="M5 40c0-9.4 7.6-17 17-17s17 7.6 17 17" fill="#666" />
              </svg>
            </div>
          </div>
          <button
            className="absolute bottom-1.5 right-1.5 flex items-center justify-center rounded-full"
            style={{
              width: "22px",
              height: "22px",
              backgroundColor: "#1e1e1e",
              border: "1px solid #333",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M7 1L9 3M1 9l.5-2L7 1 9 3l-5.5 5.5L1 9z"
                stroke="#888"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Name / badge */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1
              className="font-black text-white"
              style={{ fontSize: "26px", letterSpacing: "-0.02em" }}
            >
              {user ? displayName : "Guest"}
            </h1>
          </div>
          <p style={{ fontSize: "13px", color: "#555" }}>{displayEmail}</p>
        </div>
      </div>

      {/* Display name + Workspace ID */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
      >
        {[
          { label: "DISPLAY NAME", val: displayName },
          {
            label: "WORKSPACE ID",
            val: user ? `OS-${user.id.substring(0, 8).toUpperCase()}` : "--",
          },
        ].map(({ label, val }) => (
          <div
            key={label}
            className="rounded-xl p-4"
            style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}
          >
            <p
              style={{
                fontSize: "9px",
                color: "#555",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              {label}
            </p>
            <p className="font-medium text-white" style={{ fontSize: "15px" }}>
              {val}
            </p>
          </div>
        ))}
      </div>

      {/* System Preferences
      <SectionLabel text="System Preferences" />
      <div className="space-y-3 mb-8">
        {/* Visual Theme 
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
        </div> */}

      {/* Notification Channels
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
      </div> */}

      {/* Danger zone */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl px-4 py-5 md:px-6 md:py-5 mt-8"
        style={{ backgroundColor: "#110a0a", border: "1px solid #2a1515" }}
      >
        <div>
          <p
            className="font-bold mb-1"
            style={{ fontSize: "15px", color: "#e85555" }}
          >
            Workspace Termination
          </p>
          <p style={{ fontSize: "12px", color: "#666", maxWidth: "480px" }}>
            Permanently delete all tasks, habits, goals, and books spanning your
            workspace. This action is irreversible.
          </p>
        </div>
        <button
          onClick={handlePurge}
          className="px-5 py-2.5 rounded-xl font-semibold transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "#e85555",
            color: "white",
            fontSize: "13px",
          }}
        >
          Purge Core
        </button>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between mt-6"
        style={{ paddingTop: "16px", borderTop: "1px solid #161616" }}
      >
        {/* <span
          style={{ fontSize: "10px", color: "#2a2a2a", letterSpacing: "0.1em" }}
        >
          LIVE SYNC: ACTIVE • DB SECURE
        </span> */}
        <span
          style={{ fontSize: "10px", color: "#2a2a2a", letterSpacing: "0.1em" }}
        >
          Leben V1.0
        </span>
      </div>
    </main>
  );
}
