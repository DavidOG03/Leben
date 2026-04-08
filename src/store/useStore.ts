import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createGoalsSlice, GoalsSlice } from "./goalSlice";
import { createBooksSlice, BooksSlice } from "./bookSlice";

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
}

export interface ScheduleItem {
  id: string;
  start: string;
  end: string;
  title: string;
  description: string;
  tag: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed";
}

interface TasksHabitsSlice {
  tasks: Task[];
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  toggleTask: (id: string) => void;
  toggleHabit: (id: string) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  removeHabit: (id: string) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  schedule: ScheduleItem[];
  setSchedule: (schedule: ScheduleItem[]) => void;
}

export type LebenState = TasksHabitsSlice & GoalsSlice & BooksSlice;

export const useLebenStore = create<LebenState>()(
  persist(
    (set, get, store) => ({
      // --- Tasks & Habits slice ---
      tasks: [],
      habits: [],

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t,
          ),
        })),

      toggleHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;

            const today = new Date().toISOString().split("T")[0];
            const dates = h.completedDates ?? [];
            const alreadyDone = dates.includes(today);

            const newChecked = !h.checked;
            const newStreak = newChecked
              ? h.streak + 1
              : Math.max(0, h.streak - 1);
            const newLongest =
              newStreak > (h.longestStreak || 0)
                ? newStreak
                : h.longestStreak || 0;

            return {
              ...h,
              checked: newChecked,
              streak: newStreak,
              longestStreak: newLongest,
              completedDates: alreadyDone
                ? dates.filter((d) => d !== today)
                : [...dates, today],
            };
          }),
        })),

      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

      addHabit: (habit) =>
        set((state) => ({ habits: [...state.habits, habit] })),

      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      removeHabit: (id) =>
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) })),

      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...updates } : h,
          ),
        })),

      schedule: [],
      setSchedule: (schedule) => set({ schedule }),

      // --- Goals slice ---
      ...createGoalsSlice(set, get, store),

      // --- Books slice ---
      ...createBooksSlice(set, get, store),
    }),
    { name: "leben-storage" },
  ),
);
