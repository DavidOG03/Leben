import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createGoalsSlice, GoalsSlice } from "./goalSlice";
import { createBooksSlice, BooksSlice } from "./bookSlice";
import {
  deleteTask,
  fetchTasks,
  insertHabit,
  insertTask,
  removeHabit,
  updateHabit,
  updateTask,
  fetchHabits,
  fetchProductivityHistory,
  upsertProductivityHistory,
  upsertNotificationPrefs,
  purgeAllData,
  insertGoal,
  updateGoal as updateGoalDb,
  deleteGoal,
  insertBook,
  updateBook as updateBookDb,
  deleteBook,
} from "@/lib/supabase/db";
import { calcStreak, calcLongestStreak } from "@/utils/habits";

// ── Types ─────────────────────────────────────────────────────────────────────

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
  tag?: "WORK" | "PERSONAL" | string;
  date?: string;
  createdAt?: string;
  completedAt?: string | null;
  // Added for planner + AI
  priority?: "high" | "medium" | "low";
  category?: string;
  reminderAt?: string | null;
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
  reminderAt?: string | null;
  // Scheduling fields (from mobile)
  frequency?: "daily" | "weekly";
  targetDaysPerWeek?: number;
  timeOfDay?: "morning" | "afternoon" | "evening" | "anytime";
  createdAt?: string;
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

export interface NotificationPrefs {
  push: boolean;
  morningBriefing: boolean;
  middayNudge: boolean;
  eveningWrapUp: boolean;
  streakSavers: boolean;
  goalUpdates: boolean;
}

export type OfflineMutationAction =
  | "insertTask" | "updateTask" | "deleteTask"
  | "insertHabit" | "updateHabit" | "removeHabit"
  | "insertGoal" | "updateGoal" | "deleteGoal"
  | "insertBook" | "updateBook" | "deleteBook"
  | "upsertProductivityHistory";

export interface OfflineMutation {
  id: string;
  action: OfflineMutationAction;
  args: any[];
}

export interface ToastMessage {
  id: string;
  message: string;
  type: "info" | "syncing" | "success" | "error";
}

interface ProductivityRecord {
  completed: number;
  total: number;
}

interface TasksHabitsSlice {
  // ── Auth ────────────────────────────────────────────────────────────────────
  userId: string | null;
  userFullName: string | null;
  userEmail: string | null;
  setUser: (id: string | null, email: string | null, fullName?: string | null) => void;
  // Back-compat aliases
  setUserId: (userId: string | null) => void;
  setUserDetails: (fullName: string | null, email: string | null) => void;

  // ── Offline Queue & Toasts ──────────────────────────────────────────────────
  offlineQueue: OfflineMutation[];
  addOfflineMutation: (action: OfflineMutationAction, args: any[]) => void;
  processOfflineQueue: () => Promise<void>;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;

  // ── Tasks ───────────────────────────────────────────────────────────────────
  tasks: Task[];
  tasksLoaded: boolean;
  loadTasks: () => Promise<void>;
  cleanStaleTasks: () => Promise<void>;
  setTasks: (tasks: Task[]) => void; // back-compat
  addTask: (task: Task) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => void; // back-compat sync
  editTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => void; // back-compat
  removeTask: (id: string) => Promise<void>;

  // ── Habits ──────────────────────────────────────────────────────────────────
  habits: Habit[];
  habitsLoaded: boolean;
  loadHabits: () => Promise<void>;
  setHabits: (habits: Habit[]) => void; // back-compat
  addHabit: (habit: Habit) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => void; // back-compat
  editHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  removeHabit: (id: string) => void; // back-compat
  deleteHabit: (id: string) => Promise<void>;

  // ── Planner ─────────────────────────────────────────────────────────────────
  schedule: ScheduleItem[];
  setSchedule: (schedule: ScheduleItem[]) => void;
  toggleScheduleItem: (id: string) => void;
  updateScheduleItem: (id: string, updates: Partial<ScheduleItem>) => void;

  // ── Productivity History ─────────────────────────────────────────────────────
  productivityHistory: Record<string, ProductivityRecord>;
  historyLoaded: boolean;
  loadHistory: () => Promise<void>;
  setProductivityHistory: (history: Record<string, ProductivityRecord>) => void; // back-compat
  updateHistory: (date: string, completedDelta: number, totalDelta: number) => void; // back-compat sync
  updateHistoryDelta: (date: string, completedDelta: number, totalDelta: number) => Promise<void>;

  // ── UI ───────────────────────────────────────────────────────────────────────
  isSidebarOpen: boolean;
  toggleSidebar: (isOpen?: boolean) => void;
  isSyncing: boolean;
  setIsSyncing: (isSyncing: boolean) => void;

  // ── Notifications ────────────────────────────────────────────────────────────
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "read" | "date">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  isNotificationOpen: boolean;
  setNotificationOpen: (open: boolean) => void;

  // ── Notification Preferences ─────────────────────────────────────────────────
  notificationPrefs: NotificationPrefs;
  updateNotificationPrefs: (prefs: Partial<NotificationPrefs>) => Promise<void>;

  // ── Morning Brief ────────────────────────────────────────────────────────────
  morningBrief: any | null;
  morningBriefGeneratedAt: number | null;
  setMorningBrief: (brief: any | null) => void;
  clearMorningBrief: () => void;
  lastDigestDate: string | null;
  setLastDigestDate: (date: string) => void;

  // ── System ───────────────────────────────────────────────────────────────────
  clearStore: () => void;
  purgeAll: () => Promise<void>;
}

export type LebenState = TasksHabitsSlice & GoalsSlice & BooksSlice;

// ── Initial State ─────────────────────────────────────────────────────────────

const initialState = {
  userId: null,
  userFullName: null,
  userEmail: null,
  offlineQueue: [],
  toasts: [],
  tasks: [],
  tasksLoaded: false,
  habits: [],
  habitsLoaded: false,
  goals: [],
  goalsLoaded: false,
  books: [],
  booksLoaded: false,
  productivityHistory: {},
  historyLoaded: false,
  schedule: [],
  isSidebarOpen: false,
  isSyncing: false,
  notifications: [],
  isNotificationOpen: false,
  morningBrief: null,
  morningBriefGeneratedAt: null,
  lastDigestDate: null,
  notificationPrefs: {
    push: true,
    morningBriefing: true,
    middayNudge: true,
    eveningWrapUp: true,
    streakSavers: true,
    goalUpdates: true,
  },
};

// ── Store ─────────────────────────────────────────────────────────────────────

export const useLebenStore = create<LebenState>()(
  persist(
    (set, get, store) => ({
      ...initialState,

      // ── Auth ──────────────────────────────────────────────────────────────────
      setUser: (id, email, fullName = null) =>
        set({ userId: id, userEmail: email, userFullName: fullName }),
      setUserId: (userId) => set({ userId }),
      setUserDetails: (userFullName, userEmail) => set({ userFullName, userEmail }),

      // ── Offline Queue & Toasts ────────────────────────────────────────────────
      addOfflineMutation: (action, args) => {
        set((s) => ({
          offlineQueue: [
            ...s.offlineQueue,
            { id: Math.random().toString(36).substring(7), action, args },
          ],
        }));
      },

      processOfflineQueue: async () => {
        const state = get();
        if (state.isSyncing || state.offlineQueue.length === 0) return;
        if (!state.userId) return;

        set({ isSyncing: true });
        get().addToast({ message: "Syncing changes...", type: "syncing" });

        let successCount = 0;
        let failed = false;

        for (const mutation of state.offlineQueue) {
          try {
            switch (mutation.action) {
              case "insertTask": await insertTask(mutation.args[0]); break;
              case "updateTask": await updateTask(mutation.args[0], mutation.args[1]); break;
              case "deleteTask": await deleteTask(mutation.args[0]); break;
              case "insertHabit": await insertHabit(mutation.args[0]); break;
              case "updateHabit": await updateHabit(mutation.args[0], mutation.args[1]); break;
              case "removeHabit": await removeHabit(mutation.args[0]); break;
              case "upsertProductivityHistory":
                await upsertProductivityHistory(mutation.args[0], mutation.args[1], mutation.args[2]);
                break;
              case "insertGoal": await insertGoal(mutation.args[0]); break;
              case "updateGoal": await updateGoalDb(mutation.args[0], mutation.args[1]); break;
              case "deleteGoal": await deleteGoal(mutation.args[0]); break;
              case "insertBook": await insertBook(mutation.args[0]); break;
              case "updateBook": await updateBookDb(mutation.args[0], mutation.args[1]); break;
              case "deleteBook": await deleteBook(mutation.args[0]); break;
            }
            set((s) => ({
              offlineQueue: s.offlineQueue.filter((m) => m.id !== mutation.id),
            }));
            successCount++;
          } catch (err) {
            console.error("Failed to process offline mutation", err);
            failed = true;
            break;
          }
        }

        set({ isSyncing: false });
        set((s) => ({ toasts: s.toasts.filter((t) => t.type !== "syncing") }));

        if (failed) {
          get().addToast({ message: "Network issue. Sync paused.", type: "error" });
        } else if (successCount > 0) {
          get().addToast({ message: "All changes synced!", type: "success" });
        }
      },

      addToast: (toast) => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
        if (toast.type !== "syncing") {
          setTimeout(() => get().removeToast(id), 4000);
        }
      },

      removeToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      },

      // ── Tasks ─────────────────────────────────────────────────────────────────
      setTasks: (tasks) => set({ tasks }),

      loadTasks: async () => {
        if (get().tasksLoaded) return;
        if (!get().userId) {
          set({ tasksLoaded: true });
          return;
        }
        const cloudTasks = await fetchTasks();
        const localTasks = get().tasks;
        const mergedTasks = [
          ...localTasks.filter((t) => !cloudTasks.some((c) => c.id === t.id)),
          ...cloudTasks,
        ];
        set({ tasks: mergedTasks });
        await get().cleanStaleTasks();
        set({ tasksLoaded: true });
      },

      cleanStaleTasks: async () => {
        const tasks = get().tasks;
        const now = Date.now();
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

        const staleTasks = tasks.filter((t) => {
          if (!t.completed || !t.completedAt) return false;
          return now - new Date(t.completedAt).getTime() > TWENTY_FOUR_HOURS;
        });

        if (staleTasks.length > 0) {
          const staleIds = staleTasks.map((t) => t.id);
          set((s) => ({
            tasks: s.tasks.filter((t) => !staleIds.includes(t.id)),
          }));
          for (const id of staleIds) {
            try {
              await deleteTask(id);
            } catch {
              get().addOfflineMutation("deleteTask", [id]);
            }
          }
        }
      },

      addTask: async (task) => {
        set((s) => ({ tasks: [task, ...s.tasks] }));
        const today = new Date().toISOString().split("T")[0];
        get().updateHistoryDelta(task.date || today, 0, 1);
        try {
          await insertTask(task);
        } catch {
          get().addOfflineMutation("insertTask", [task]);
        }
      },

      toggleTask: async (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;

        const today = new Date().toISOString().split("T")[0];
        const newCompleted = !task.completed;
        const updates = {
          completed: newCompleted,
          completedAt: newCompleted ? today : undefined,
          reminderAt: newCompleted ? undefined : task.reminderAt,
        };

        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
        get().updateHistoryDelta(task.date || today, newCompleted ? 1 : -1, 0);

        try {
          await updateTask(id, updates);
        } catch {
          get().addOfflineMutation("updateTask", [id, updates]);
        }
      },

      // Back-compat sync version (used by existing AI chat hook)
      updateTask: (id, updates) => {
        const task = get().tasks.find((t) => t.id === id);
        if (task && updates.completed !== undefined && updates.completed !== task.completed) {
          const today = new Date().toISOString().split("T")[0];
          const dateStr = updates.completed
            ? (updates.completedAt ?? today)
            : (task.completedAt ?? today);
          get().updateHistory(dateStr, updates.completed ? 1 : -1, 0);
        }
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
        updateTask(id, updates).catch(() =>
          get().addOfflineMutation("updateTask", [id, updates]),
        );
      },

      editTask: async (id, updates) => {
        const task = get().tasks.find((t) => t.id === id);
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
        if (task && updates.completed !== undefined && updates.completed !== task.completed) {
          const today = new Date().toISOString().split("T")[0];
          const dateStr = updates.completed
            ? (updates.completedAt ?? today)
            : (task.completedAt ?? today);
          get().updateHistoryDelta(
            typeof dateStr === "string" ? dateStr.split("T")[0] : today,
            updates.completed ? 1 : -1,
            0,
          );
        }
        try {
          await updateTask(id, updates);
        } catch {
          get().addOfflineMutation("updateTask", [id, updates]);
        }
      },

      // Back-compat sync version
      deleteTask: (id) => {
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
        deleteTask(id).catch(() => get().addOfflineMutation("deleteTask", [id]));
      },

      removeTask: async (id) => {
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
        try {
          await deleteTask(id);
        } catch {
          get().addOfflineMutation("deleteTask", [id]);
        }
      },

      // ── Habits ────────────────────────────────────────────────────────────────
      setHabits: (habits) => {
        const today = new Date().toISOString().split("T")[0];
        const habitsWithChecked = habits.map((h) => ({
          ...h,
          checked: h.completedDates?.includes(today) ?? false,
        }));
        set({ habits: habitsWithChecked });
      },

      loadHabits: async () => {
        if (get().habitsLoaded) return;
        if (!get().userId) {
          set({ habitsLoaded: true });
          return;
        }
        const cloudHabits = await fetchHabits();
        const localHabits = get().habits;
        const mergedHabits = [
          ...localHabits.filter((h) => !cloudHabits.some((c) => c.id === h.id)),
          ...cloudHabits,
        ];
        set({ habits: mergedHabits, habitsLoaded: true });
      },

      addHabit: async (habit) => {
        set((s) => ({ habits: [...s.habits, habit] }));
        try {
          await insertHabit(habit);
        } catch {
          get().addOfflineMutation("insertHabit", [habit]);
        }
      },

      toggleHabit: async (id) => {
        const today = new Date().toISOString().split("T")[0];
        const habit = get().habits.find((h) => h.id === id);
        if (!habit) return;

        const alreadyDone = habit.completedDates.includes(today);
        const newDates = alreadyDone
          ? habit.completedDates.filter((d) => d !== today)
          : [...habit.completedDates, today];

        const newStreak = calcStreak(newDates);
        const newLongest = calcLongestStreak(newDates);
        const updates = {
          checked: !alreadyDone,
          streak: newStreak,
          longestStreak: newLongest,
          completedDates: newDates,
          reminderAt: !alreadyDone ? undefined : habit.reminderAt,
        };

        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        }));

        try {
          await updateHabit(id, updates);
        } catch {
          get().addOfflineMutation("updateHabit", [id, updates]);
        }
      },

      // Back-compat sync version
      updateHabit: (id, updates) => {
        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        }));
        updateHabit(id, updates).catch(() =>
          get().addOfflineMutation("updateHabit", [id, updates]),
        );
      },

      editHabit: async (id, updates) => {
        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        }));
        try {
          await updateHabit(id, updates);
        } catch {
          get().addOfflineMutation("updateHabit", [id, updates]);
        }
      },

      // Back-compat sync version
      removeHabit: (id) => {
        set((s) => ({ habits: s.habits.filter((h) => h.id !== id) }));
        removeHabit(id).catch(() => get().addOfflineMutation("removeHabit", [id]));
      },

      deleteHabit: async (id) => {
        set((s) => ({ habits: s.habits.filter((h) => h.id !== id) }));
        try {
          await removeHabit(id);
        } catch {
          get().addOfflineMutation("removeHabit", [id]);
        }
      },

      // ── Planner ───────────────────────────────────────────────────────────────
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
            newTasks = state.tasks.map((t) => {
              if (t.id === scheduleItem.taskId) {
                const dateStr =
                  t.date || new Date().toISOString().split("T")[0];
                if (t.completed !== (newStatus === "completed")) {
                  get().updateHistory(
                    dateStr,
                    newStatus === "completed" ? 1 : -1,
                    0,
                  );
                }
                return {
                  ...t,
                  completed: newStatus === "completed",
                  reminderAt:
                    newStatus === "completed" ? undefined : t.reminderAt,
                };
              }
              return t;
            });
          }

          return { schedule: newSchedule, tasks: newTasks };
        }),

      updateScheduleItem: (id, updates) =>
        set((state) => ({
          schedule: state.schedule.map((s) =>
            s.id === id ? { ...s, ...updates } : s,
          ),
        })),

      // ── Productivity History ───────────────────────────────────────────────────
      setProductivityHistory: (history) => set({ productivityHistory: history }),

      loadHistory: async () => {
        if (get().historyLoaded) return;
        const cloudHistory = await fetchProductivityHistory();
        const localHistory = get().productivityHistory || {};
        const mergedHistory = { ...localHistory };
        for (const [date, data] of Object.entries(cloudHistory)) {
          mergedHistory[date] = data; // cloud wins on conflict
        }
        set({ productivityHistory: mergedHistory, historyLoaded: true });
      },

      // Back-compat sync version
      updateHistory: (date, completedDelta, totalDelta) => {
        set((state) => {
          const history = { ...(state.productivityHistory || {}) };
          if (!history[date]) history[date] = { completed: 0, total: 0 };
          const newCompleted = Math.max(0, history[date].completed + completedDelta);
          const newTotal = Math.max(0, history[date].total + totalDelta);
          history[date] = { completed: newCompleted, total: newTotal };
          // Async fire-and-forget
          upsertProductivityHistory(date, newCompleted, newTotal).catch(() =>
            get().addOfflineMutation("upsertProductivityHistory", [date, newCompleted, newTotal]),
          );
          return { productivityHistory: history };
        });
      },

      updateHistoryDelta: async (date, completedDelta, totalDelta) => {
        const existing = (get().productivityHistory || {})[date] || { completed: 0, total: 0 };
        const completed = Math.max(0, Number(existing.completed || 0) + Number(completedDelta || 0));
        const total = Math.max(0, Number(existing.total || 0) + Number(totalDelta || 0));
        set((s) => ({
          productivityHistory: {
            ...(s.productivityHistory || {}),
            [date]: { completed, total },
          },
        }));
        try {
          await upsertProductivityHistory(date, completed, total);
        } catch {
          get().addOfflineMutation("upsertProductivityHistory", [date, completed, total]);
        }
      },

      // ── UI ────────────────────────────────────────────────────────────────────
      isSidebarOpen: false,
      toggleSidebar: (isOpen) =>
        set((state) => ({
          isSidebarOpen: isOpen !== undefined ? isOpen : !state.isSidebarOpen,
        })),
      isSyncing: false,
      setIsSyncing: (isSyncing) => set({ isSyncing }),

      // ── Notifications ─────────────────────────────────────────────────────────
      notifications: [],
      isNotificationOpen: false,
      setNotificationOpen: (isNotificationOpen) => set({ isNotificationOpen }),
      addNotification: (n) =>
        set((state) => ({
          notifications: [
            { ...n, read: false, date: new Date().toISOString() },
            ...state.notifications,
          ].slice(0, 50),
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

      // ── Notification Preferences ──────────────────────────────────────────────
      notificationPrefs: initialState.notificationPrefs,
      updateNotificationPrefs: async (prefs) => {
        set((state) => ({
          notificationPrefs: { ...state.notificationPrefs, ...prefs },
        }));
        if (get().userId) {
          await upsertNotificationPrefs(get().notificationPrefs).catch(
            (err) => console.error("Failed to save notification prefs:", err),
          );
        }
      },

      // ── Morning Brief ─────────────────────────────────────────────────────────
      morningBrief: null,
      morningBriefGeneratedAt: null,
      setMorningBrief: (brief) =>
        set({ morningBrief: brief, morningBriefGeneratedAt: Date.now() }),
      clearMorningBrief: () =>
        set({ morningBrief: null, morningBriefGeneratedAt: null }),
      lastDigestDate: null,
      setLastDigestDate: (date) => set({ lastDigestDate: date }),

      // ── System ────────────────────────────────────────────────────────────────
      clearStore: () => {
        set({
          ...initialState,
          morningBrief: null,
          morningBriefGeneratedAt: null,
          tasks: [],
          habits: [],
          goals: [],
          books: [],
          productivityHistory: {},
        });
      },

      purgeAll: async () => {
        set({
          ...initialState,
          morningBrief: null,
          morningBriefGeneratedAt: null,
          tasks: [],
          habits: [],
          goals: [],
          books: [],
          productivityHistory: {},
        });
        await purgeAllData();
      },

      // ── Goal slice ────────────────────────────────────────────────────────────
      ...createGoalsSlice(set, get, store),

      // ── Books slice ───────────────────────────────────────────────────────────
      ...createBooksSlice(set, get, store),
    }),
    {
      name: "leben-storage",
      // Persist user data & core app state
      partialize: (state) => ({
        userId: state.userId,
        userEmail: state.userEmail,
        userFullName: state.userFullName,
        tasks: state.tasks,
        habits: state.habits,
        goals: state.goals,
        books: state.books,
        productivityHistory: state.productivityHistory,
        schedule: state.schedule,
        notificationPrefs: state.notificationPrefs,
        lastDigestDate: state.lastDigestDate,
        morningBrief: state.morningBrief,
        morningBriefGeneratedAt: state.morningBriefGeneratedAt,
        offlineQueue: state.offlineQueue,
      }),
    },
  ),
);
