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
    <div className="flex items-start gap-3 bg-[#1a1a1e] border border-purple-500/30 rounded-[12px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] min-w-[300px] max-w-[380px] animate-slide-in">
      <div className="w-8 h-8 rounded-2xl bg-purple-500/15 flex items-center justify-center flex-shrink-0">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7c6af0"
          strokeWidth="2"
          className="block"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </div>

      <div className="flex-1">
        <p className="m-0 text-[11px] text-[#7c6af0] font-bold uppercase tracking-[0.08em]">
          {toast.title}
        </p>
        <p className="mt-1 text-[13px] text-[#e0e0e0] leading-[1.4]">
          {toast.body}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-[#777] hover:text-[#ddd] transition-colors text-[16px] leading-none focus:outline-none"
      >
        ×
      </button>
    </div>
  );
}

export default function NotificationManager() {
  const tasks = useLebenStore((state) => state.tasks);
  const habits = useLebenStore((state) => state.habits);
  const schedule = useLebenStore((state) => state.schedule);
  const updateTask = useLebenStore((state) => state.updateTask);
  const updateHabit = useLebenStore((state) => state.updateHabit);

  const notifiedRef = useRef<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fireNotification = useCallback(
    (id: string, title: string, body: string) => {
      setToasts((prev) => [...prev, { id: `toast-${id}`, title, body }]);

      if (
        typeof Notification !== "undefined" &&
        Notification.permission === "granted"
      ) {
        new Notification(title, {
          body,
          icon: "/favicon.svg",
          badge: "/favicon.svg",
        });
      }

      notifiedRef.current.add(id);
    },
    [],
  );

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 300000);

      const allRemindables = [
        ...tasks.map((t: any) => ({ ...t, type: "Task Reminder", itemType: "task" })),
        ...habits.map((h: any) => ({
          ...h,
          type: "Habit Reminder",
          title: h.label,
          itemType: "habit",
        })),
        ...schedule.map((s: any) => ({ ...s, type: "Planner Reminder", itemType: "schedule" })),
      ];

      allRemindables.forEach((item: any) => {
        if (!item.reminderAt || notifiedRef.current.has(item.id)) return;

        const reminderTime = new Date(item.reminderAt);

        // Check if reminder is upcoming (within next 5 minutes)
        if (reminderTime >= now && reminderTime <= fiveMinutesFromNow) {
          fireNotification(item.id, item.type, item.title);
        }
        // Check if reminder time has passed (missed reminder)
        else if (reminderTime < now) {
          fireNotification(
            item.id,
            item.type,
            `You missed the reminder for "${item.title}"`
          );

          // Clear the reminder and mark as notified
          if (item.itemType === "task") {
            updateTask(item.id, { reminderAt: undefined });
          } else if (item.itemType === "habit") {
            updateHabit(item.id, { reminderAt: undefined });
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    checkReminders();
    return () => clearInterval(interval);
  }, [tasks, habits, schedule, fireNotification, updateTask, updateHabit]);

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ReminderToast toast={toast} onDismiss={dismissToast} />
          </div>
        ))}
      </div>
    </>
  );
}
