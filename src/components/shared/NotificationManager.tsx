"use client";

import { useEffect, useRef } from "react";
import { useLebenStore } from "@/store/useStore";

export default function NotificationManager() {
  const tasks = useLebenStore((state) => state.tasks);
  const habits = useLebenStore((state) => state.habits);
  const schedule = useLebenStore((state) => state.schedule);
  const notifiedRef = useRef<Set<string>>(new Set());

  // Clear old notifications periodically (every hour) to allow re-notifying if reminders are updated
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();

      const allRemindables = [
        ...tasks.map((t: any) => ({ ...t, type: "Task" })),
        ...habits.map((h: any) => ({ ...h, type: "Habit", title: h.label })),
        ...schedule.map((s: any) => ({ ...s, type: "Event" })),
      ];

      const itemsWithReminders = allRemindables.filter(
        (item) => item.reminderAt,
      );
      if (itemsWithReminders.length > 0) {
        console.log(
          `🔔 Checking ${itemsWithReminders.length} items with reminders at ${now.toLocaleTimeString()}`,
        );
      }

      allRemindables.forEach((item: any) => {
        if (!item.reminderAt || notifiedRef.current.has(item.id)) return;

        const reminderTime = new Date(item.reminderAt);

        if (
          reminderTime <= now &&
          reminderTime > new Date(now.getTime() - 300000)
        ) {
          if (Notification.permission === "granted") {
            new Notification(`Leben Reminder: ${item.type}`, {
              body: item.title,
              icon: "/favicon.svg",
            });
            console.log(
              `🔔 NOTIFIED: ${item.type} - ${item.title} (scheduled for ${reminderTime.toLocaleTimeString()})`,
            );
            notifiedRef.current.add(item.id);
          } else {
            console.log(
              `🔔 REMINDER: ${item.type} - ${item.title} (at ${reminderTime.toLocaleTimeString()}) - Browser notifications disabled`,
            );
          }
        }
      });
    }; // <-- this was missing

    const interval = setInterval(checkReminders, 60000);
    checkReminders(); // run immediately on mount too
    return () => clearInterval(interval);
  }, [tasks, habits, schedule]);
}
