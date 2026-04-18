"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLebenStore } from "@/store/useStore";

interface Toast {
  id: string;
  title: string;
  body: string;
}

function ReminderToast({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 8000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        backgroundColor: "#1a1a1e",
        border: "1px solid rgba(124,106,240,0.3)",
        borderRadius: "12px",
        padding: "14px 16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        minWidth: "300px",
        maxWidth: "380px",
        animation: "lebenSlideIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
        pointerEvents: "all",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "8px",
          background: "rgba(124,106,240,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c6af0" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: "11px", color: "#7c6af0", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {toast.title}
        </p>
        <p style={{ marginTop: "4px", fontSize: "13px", color: "#e0e0e0", lineHeight: 1.4 }}>
          {toast.body}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        style={{ background: "none", border: "none", color: "#777", fontSize: "18px", cursor: "pointer", lineHeight: 1, padding: "0 2px" }}
      >
        ×
      </button>
    </div>
  );
}

// ---------- helpers ----------

/**
 * Returns a "day key" string like "2026-04-18" for a given ISO timestamp.
 * We use this so `notifiedRef` resets per-day instead of per-session.
 */
function dayKey(isoString: string): string {
  return isoString.split("T")[0];
}

/** Build a deduplication key that includes the day, so tomorrow's reminder fires fresh. */
function notifKey(id: string, reminderAt: string): string {
  return `${id}::${dayKey(reminderAt)}`;
}

export default function NotificationManager() {
  const tasks    = useLebenStore((state) => state.tasks);
  const habits   = useLebenStore((state) => state.habits);
  const schedule = useLebenStore((state) => state.schedule);
  const addNotification = useLebenStore((state) => state.addNotification);

  // Key format: "id::YYYY-MM-DD" → resets automatically on a new day
  const notifiedRef = useRef<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fireNotification = useCallback(
    (id: string, reminderAt: string, title: string, body: string) => {
      const key = notifKey(id, reminderAt);
      if (notifiedRef.current.has(key)) return; // already fired today
      notifiedRef.current.add(key);

      setToasts((prev) => [...prev, { id: `toast-${id}-${Date.now()}`, title, body }]);
      addNotification({ id: `${id}-${Date.now()}`, title, body });

      // Native browser push (only if already granted — don't prompt here)
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        try {
          new Notification(title, {
            body,
            icon: "/favicon.svg",
            badge: "/favicon.svg",
          });
        } catch {
          // Some browsers require a ServiceWorker for Notification; swallow silently
        }
      }
    },
    [addNotification],
  );

  // ── Habit streak motivation ──────────────────────────────────────────────────
  // Fire an evening nudge for any habit that isn't checked and has no reminderAt
  const streakNudgeRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    const checkStreakNudge = () => {
      const hour = new Date().getHours();
      // Only nudge in the evening (7pm–10pm)
      if (hour < 19 || hour >= 22) return;
      const today = new Date().toISOString().split("T")[0];

      habits.forEach((h: any) => {
        if (h.checked) return; // already done today
        const nudgeKey = `streak-nudge::${h.id}::${today}`;
        if (streakNudgeRef.current.has(nudgeKey)) return;
        streakNudgeRef.current.add(nudgeKey);

        const streakMsg =
          h.streak > 0
            ? `You're on a ${h.streak}-day streak! Don't break it now.`
            : `Complete "${h.name || h.label}" today to start a new streak!`;

        setToasts((prev) => [
          ...prev,
          { id: nudgeKey, title: "Streak Motivation", body: streakMsg },
        ]);
        addNotification({ id: nudgeKey, title: "Streak Motivation", body: streakMsg });

        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          try {
            new Notification("Streak Motivation 🔥", { body: streakMsg, icon: "/favicon.svg" });
          } catch { /* swallow */ }
        }
      });
    };

    const interval = setInterval(checkStreakNudge, 60_000); // check every minute
    checkStreakNudge();
    return () => clearInterval(interval);
  }, [habits, addNotification]);

  // ── Reminder checker ─────────────────────────────────────────────────────────
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const twoMinutesAgo = new Date(now.getTime() - 120_000);

      const allRemindables = [
        ...tasks
          .filter((t: any) => !t.completed && t.reminderAt)
          .map((t: any) => ({ id: t.id, reminderAt: t.reminderAt, type: "Task Reminder", label: t.title || t.name })),
        ...habits
          // ✅ Fixed: filter only on reminderAt, not on .checked
          .filter((h: any) => h.reminderAt)
          .map((h: any) => ({ id: h.id, reminderAt: h.reminderAt, type: "Habit Reminder", label: h.label || h.name })),
        ...schedule
          .filter((s: any) => s.status !== "completed" && s.reminderAt)
          .map((s: any) => ({ id: s.id, reminderAt: s.reminderAt, type: "Planner Reminder", label: s.title })),
      ];

      allRemindables.forEach((item: any) => {
        const reminderTime = new Date(item.reminderAt);

        if (reminderTime <= now && reminderTime > twoMinutesAgo) {
          // In the firing window → fire
          fireNotification(item.id, item.reminderAt, item.type, `Time for: ${item.label}`);
        } else if (reminderTime <= twoMinutesAgo) {
          // Stale → just suppress without broadcasting
          const key = notifKey(item.id, item.reminderAt);
          notifiedRef.current.add(key);
        }
      });
    };

    const interval = setInterval(checkReminders, 10_000);
    checkReminders();
    return () => clearInterval(interval);
  }, [tasks, habits, schedule, fireNotification]);

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes lebenSlideIn {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <ReminderToast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </>
  );
}
