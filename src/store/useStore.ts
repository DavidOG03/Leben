import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createGoalsSlice, GoalsSlice } from "./goalSlice";
import { createBooksSlice, BooksSlice } from "./bookSlice";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  tag: "WORK" | "PERSONAL";
  date: string;
}

export interface Habit {
  id: string;
  label: string;
  streak: number;
  checked: boolean;
}

interface TasksHabitsSlice {
  tasks: Task[];
  habits: Habit[];
  toggleTask: (id: string) => void;
  toggleHabit: (id: string) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  removeHabit: (id: string) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
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
          habits: state.habits.map((h: any) => {
            if (h.id === id) {
              const newChecked = !h.checked;
              const newStreak = newChecked ? h.streak + 1 : Math.max(0, h.streak - 1);
              const newLongest = newStreak > (h.longestStreak || 0) ? newStreak : (h.longestStreak || 0);
              return { ...h, checked: newChecked, streak: newStreak, longestStreak: newLongest };
            }
            return h;
          }),
        })),

      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

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

      // --- Goals slice ---
      ...createGoalsSlice(set, get, store),

      // --- Books slice ---
      ...createBooksSlice(set, get, store),
    }),
    { name: "leben-storage" },
  ),
);
