import { StateCreator } from "zustand";
import {
  Goal,
  GoalFormData,
  Milestone,
  generateGoalId,
  generateMilestoneId,
} from "@/utils/goals.types";
import {
  fetchGoals,
  insertGoal,
  updateGoal as updateGoalDb,
  deleteGoal,
} from "@/lib/supabase/db";

export interface GoalsSlice {
  goals: Goal[];
  goalsLoaded: boolean;
  // Load from cloud with local/cloud merge + guard flag
  loadGoals: () => Promise<void>;
  setGoals: (goals: Goal[]) => void; // kept for back-compat
  addGoal: (data: GoalFormData | Goal) => Promise<void>;
  editGoal: (goalId: string, updates: Partial<Goal>) => Promise<void>;
  toggleMilestone: (goalId: string, milestoneId: string) => Promise<void>;
  removeGoal: (goalId: string) => Promise<void>;
  updateGoal: (goalId: string, updates: Partial<Goal>) => Promise<void>;
  updateGoalProgress: (goalId: string, currentValue: number) => Promise<void>;
  editMilestone: (goalId: string, milestoneId: string, newLabel: string) => Promise<void>;
  incrementTasksLinked: (goalId: string) => void;
}

export const createGoalsSlice: StateCreator<GoalsSlice, [], [], GoalsSlice> = (
  set,
  get,
) => ({
  goals: [],
  goalsLoaded: false,

  setGoals: (goals: Goal[]) => set({ goals }),

  loadGoals: async () => {
    const state = get() as any;
    if (state.goalsLoaded) return;
    // Guest mode: no fetch needed
    if (!state.userId) {
      set({ goalsLoaded: true } as any);
      return;
    }
    const cloudGoals = await fetchGoals();
    const localGoals = (get() as any).goals as Goal[];
    const mergedGoals = [
      ...localGoals.filter((g) => !cloudGoals.some((c) => c.id === g.id)),
      ...cloudGoals,
    ];
    set({ goals: mergedGoals, goalsLoaded: true } as any);
  },

  addGoal: async (data: GoalFormData | Goal) => {
    let newGoal: Goal;

    // Accept either a full Goal object or GoalFormData
    if (
      "milestones" in data &&
      Array.isArray((data as any).milestones) &&
      (data as any).milestones.length > 0 &&
      typeof (data as any).milestones[0] === "string"
    ) {
      // GoalFormData path — milestones are raw strings
      const fd = data as GoalFormData;
      const milestones: Milestone[] = (fd.milestones as string[])
        .filter((m) => m.trim() !== "")
        .map((label) => ({
          id: generateMilestoneId(),
          label,
          done: false,
        }));
      newGoal = {
        id: generateGoalId(),
        title: fd.title,
        name: fd.title,
        deadline: fd.deadline,
        icon: fd.icon,
        milestones,
        tasksLinked: 0,
        createdAt: new Date().toISOString(),
        color: fd.color,
        targetValue: fd.targetValue,
        currentValue: fd.currentValue,
      };
    } else {
      newGoal = data as Goal;
    }

    set((state) => ({ goals: [newGoal, ...state.goals] }));
    try {
      await insertGoal(newGoal);
    } catch {
      (get() as any).addOfflineMutation?.("insertGoal", [newGoal]);
    }
  },

  editGoal: async (goalId: string, updates: Partial<Goal>) => {
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === goalId ? { ...g, ...updates } : g,
      ),
    }));
    try {
      await updateGoalDb(goalId, updates);
    } catch {
      (get() as any).addOfflineMutation?.("updateGoal", [goalId, updates]);
    }
  },

  toggleMilestone: async (goalId: string, milestoneId: string) => {
    let updatedMilestones: Milestone[] = [];
    set((state) => {
      const updatedGoals = state.goals.map((g) => {
        if (g.id !== goalId) return g;
        updatedMilestones = g.milestones.map((m) => {
          if (m.id === milestoneId) {
            const newDone = !m.done;
            return {
              ...m,
              done: newDone,
              completedAt: newDone
                ? new Date().toISOString().split("T")[0]
                : undefined,
            };
          }
          return m;
        });
        return { ...g, milestones: updatedMilestones };
      });
      return { goals: updatedGoals };
    });
    if (updatedMilestones.length > 0) {
      try {
        await updateGoalDb(goalId, { milestones: updatedMilestones });
      } catch {
        (get() as any).addOfflineMutation?.("updateGoal", [goalId, { milestones: updatedMilestones }]);
      }
    }
  },

  removeGoal: async (goalId: string) => {
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== goalId),
    }));
    try {
      await deleteGoal(goalId);
    } catch {
      (get() as any).addOfflineMutation?.("deleteGoal", [goalId]);
    }
  },

  updateGoal: async (goalId: string, updates: Partial<Goal>) => {
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === goalId ? { ...g, ...updates } : g,
      ),
    }));
    try {
      await updateGoalDb(goalId, updates);
    } catch {
      (get() as any).addOfflineMutation?.("updateGoal", [goalId, updates]);
    }
  },

  updateGoalProgress: async (goalId: string, currentValue: number) => {
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === goalId ? { ...g, currentValue } : g,
      ),
    }));
    try {
      await updateGoalDb(goalId, { currentValue });
    } catch {
      (get() as any).addOfflineMutation?.("updateGoal", [goalId, { currentValue }]);
    }
  },

  editMilestone: async (goalId: string, milestoneId: string, newLabel: string) => {
    let updatedMilestones: Milestone[] = [];
    set((state) => {
      const updatedGoals = state.goals.map((g) => {
        if (g.id !== goalId) return g;
        updatedMilestones = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, label: newLabel } : m,
        );
        return { ...g, milestones: updatedMilestones };
      });
      return { goals: updatedGoals };
    });
    if (updatedMilestones.length > 0) {
      try {
        await updateGoalDb(goalId, { milestones: updatedMilestones });
      } catch {
        (get() as any).addOfflineMutation?.("updateGoal", [goalId, { milestones: updatedMilestones }]);
      }
    }
  },

  incrementTasksLinked: (goalId: string) => {
    let newCount = 0;
    set((state) => ({
      goals: state.goals.map((g) => {
        if (g.id === goalId) {
          newCount = g.tasksLinked + 1;
          return { ...g, tasksLinked: newCount };
        }
        return g;
      }),
    }));
    if (newCount > 0) {
      updateGoalDb(goalId, { tasksLinked: newCount });
    }
  },
});
