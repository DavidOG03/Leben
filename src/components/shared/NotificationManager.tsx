"use client";

import { useEffect, useRef } from "react";
import { useLebenStore } from "@/store/useStore";

export default function NotificationManager() {
  const { tasks, habits, schedule } = useLebenStore();
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Request permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      
      const allRemindables = [
        ...tasks.map(t => ({ ...t, type: "Task" })),
        ...habits.map(h => ({ ...h, type: "Habit", title: h.label })),
        ...schedule.map(s => ({ ...s, type: "Event" }))
      ];

      allRemindables.forEach((item: any) => {
        if (!item.reminderAt || notifiedRef.current.has(item.id)) return;

        const reminderTime = new Date(item.reminderAt);
        
        // If reminder time has passed or is within the next minute
        if (reminderTime <= now && reminderTime > new Date(now.getTime() - 60000)) {
          if (Notification.permission === "granted") {
            new Notification(`Leben Reminder: ${item.type}`, {
              body: item.title,
              icon: "/favicon.ico"
            });
            notifiedRef.current.add(item.id);
          } else {
            // Fallback to alert if no permission
            console.log(`REMINDER: ${item.type} - ${item.title}`);
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [tasks, habits, schedule]);

  return null; // This is a logic-only component
}
