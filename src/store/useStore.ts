import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createGoalsSlice, GoalsSlice } from "./goalSlice";
import { createBooksSlice, BooksSlice } from "./bookSlice";
import {
  deleteTask,
  insertHabit,
  insertTask,
  removeHabit,
  updateHabit,
  updateTask,
  purgeAllData,
} from "@/lib/supabase/db";
import { calcStreak, calcLongestStreak } from "@/utils/habits";

export interface Notification {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  tag: "WORK" | "PERSONAL";
  date: string;
  createdAt: string;
  completedAt?: string;

  // Added for planner + AI
  priority?: "high" | "medium" | "low"; // optional so existing tasks don't break
  category?: string; // optional free-text label e.g. "Engineering"
  reminderAt?: string; // ISO timestamp
}

export interface Habit {
  id: string;
  name: string;
  label: string;
  sub: string;
  icon: string;
  streak: number;
  longestStreak: number;
  checked: boolean;
  color: string;
  pct: number;
  completedDates: string[];
  reminderAt?: string; // ISO timestamp
}

export interface ScheduleItem {
  id: string;
  taskId?: string;
  start: string;
  end: string;
  title: string;
  description: string;
  tag: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed";
  reminderAt?: string; // ISO timestamp
}

interface TasksHabitsSlice {
  tasks: Task[];
  habits: Habit[];
  setTasks: (tasks: Task[]) => void;
  setHabits: (habits: Habit[]) => void;
  addHabit: (habit: Habit) => void;
  toggleTask: (id: string) => void;
  toggleHabit: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  removeHabit: (id: string) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  schedule: ScheduleItem[];
  setSchedule: (schedule: ScheduleItem[]) => void;
  toggleScheduleItem: (id: string) => void;
  updateScheduleItem: (id: string, updates: Partial<ScheduleItem>) => void;
  isSidebarOpen: boolean;
  toggleSidebar: (isOpen?: boolean) => void;
  isSyncing: boolean;
  setIsSyncing: (isSyncing: boolean) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "read" | "date">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  isNotificationOpen: boolean;
  setNotificationOpen: (open: boolean) => void;
  clearStore: () => void;
  purgeAll: () => void;
}

export type LebenState = TasksHabitsSlice & GoalsSlice & BooksSlice;

export const useLebenStore = create<LebenState>()(
  persist(
    (set, get, store) => ({
      // --- Tasks & Habits slice ---
      tasks: [],
      habits: [],
      isSidebarOpen: false,
      isSyncing: false,
      setIsSyncing: (isSyncing) => set({ isSyncing }),
      notifications: [],
      isNotificationOpen: false,
      setNotificationOpen: (isNotificationOpen) => set({ isNotificationOpen }),
      addNotification: (n) =>
        set((state) => ({
          notifications: [
            {
              ...n,
              read: false,
              date: new Date().toISOString(),
            },
            ...state.notifications,
          ].slice(0, 50), // Keep last 50
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      toggleSidebar: (isOpen) =>
        set((state) => ({
          isSidebarOpen: isOpen !== undefined ? isOpen : !state.isSidebarOpen,
        })),
      setTasks: (tasks) => set({ tasks }),
      setHabits: (habits) => {
        const today = new Date().toISOString().split("T")[0];
        const habitsWithChecked = habits.map(h => ({
          ...h,
          checked: h.completedDates?.includes(today) ?? false
        }));
        set({ habits: habitsWithChecked });
      },

      toggleTask: (id) => {
        const today = new Date().toISOString().split("T")[0];
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id === id) {
              const newCompleted = !t.completed;
              return {
                ...t,
                completed: newCompleted,
                completedAt: newCompleted ? today : undefined,
                reminderAt: newCompleted ? undefined : t.reminderAt,
              };
            }
            return t;
          }),
        }));
        const task = get().tasks.find((t) => t.id === id);
        if (task) {
          updateTask(id, {
            completed: task.completed,
            completedAt: task.completedAt,
            reminderAt: task.reminderAt,
          });
        }
      },
      toggleHabit: (id) => {
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;

            const today = new Date().toISOString().split("T")[0];
            const dates = h.completedDates ?? [];
            const alreadyDone = dates.includes(today);

            const newDates = alreadyDone
              ? dates.filter((d) => d !== today)
              : [...dates, today];

            const newStreak = calcStreak(newDates);
            const newLongest = calcLongestStreak(newDates);

            return {
              ...h,
              checked: !alreadyDone,
              streak: newStreak,
              longestStreak: newLongest,
              completedDates: newDates,
              reminderAt: !alreadyDone ? undefined : h.reminderAt,
            };
          }),
        }));
        const updated = get().habits.find((h) => h.id === id);
        if (updated) updateHabit(id, updated);
      },
      addTask: (task) => {
        set((state) => ({ tasks: [...state.tasks, task] }));
        insertTask(task);
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
        updateTask(id, updates);
      },

      addHabit: (habit) => {
        set((state) => ({ habits: [...state.habits, habit] }));
        insertHabit(habit);
      },
      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
        deleteTask(id);
      },

      removeHabit: (id) => {
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }));
        removeHabit(id);
      },

      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...updates } : h,
          ),
        })),

      schedule: [],
      setSchedule: (schedule) => set({ schedule }),
      toggleScheduleItem: (id) =>
        set((state) => {
          const scheduleItem = state.schedule.find((s) => s.id === id);
          if (!scheduleItem) return state;

          const newStatus: "pending" | "completed" =
            scheduleItem.status === "completed" ? "pending" : "completed";
          const newSchedule = state.schedule.map((s) =>
            s.id === id ? { ...s, status: newStatus } : s,
          );

          let newTasks = state.tasks;
          if (scheduleItem.taskId) {
            newTasks = state.tasks.map((t) =>
              t.id === scheduleItem.taskId
                ? {
                    ...t,
                    completed: newStatus === "completed",
                    reminderAt:
                      newStatus === "completed" ? undefined : t.reminderAt,
                  }
                : t,
            );
          }

          return { 
            schedule: newSchedule, 
            tasks: newTasks 
          };
        }),

      updateScheduleItem: (id, updates) =>
        set((state) => ({
          schedule: state.schedule.map((s) =>
            s.id === id ? { ...s, ...updates } : s,
          ),
        })),

      clearStore: () => {
        set({
          tasks: [],
          habits: [],
          goals: [],
          books: [],
          schedule: [],
          notifications: [],
        });
      },
      purgeAll: () => {
        get().clearStore();
        purgeAllData();
      },

      // --- Goals slice ---
      ...createGoalsSlice(set, get, store),

      // --- Books slice ---
      ...createBooksSlice(set, get, store),
    }),
    { name: "leben-storage" },
  ),
);
