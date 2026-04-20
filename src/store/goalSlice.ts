import { StateCreator } from "zustand";
import {
  Goal,
  GoalFormData,
  Milestone,
  generateGoalId,
  generateMilestoneId,
} from "@/utils/goals.types";
import { insertGoal, updateGoal as updateGoalDb, deleteGoal } from "@/lib/supabase/db";

export interface GoalsSlice {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  addGoal: (data: GoalFormData) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  removeGoal: (goalId: string) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  editMilestone: (goalId: string, milestoneId: string, newLabel: string) => void;
  incrementTasksLinked: (goalId: string) => void;
}

// StateCreator<FullStore, [], [], GoalsSlice> -- the slice only knows about itself
// but receives the full store's set/get so cross-slice calls work when needed
export const createGoalsSlice: StateCreator<GoalsSlice, [], [], GoalsSlice> = (
  set,
) => ({
  goals: [],
  setGoals: (goals: Goal[]) => set({ goals }),

  addGoal: (data: GoalFormData) => {
    const milestones: Milestone[] = data.milestones
      .filter((m) => m.trim() !== "")
      .map((label) => ({
        id: generateMilestoneId(),
        label,
        done: false,
      }));

    const newGoal: Goal = {
      id: generateGoalId(),
      title: data.title,
      deadline: data.deadline,
      icon: data.icon,
      milestones,
      tasksLinked: 0,
      createdAt: new Date().toISOString(),
      name: data.title,
      color: data.color,
      targetValue: data.targetValue,
      currentValue: data.currentValue,
    };

    set((state) => ({ goals: [...state.goals, newGoal] }));
    insertGoal(newGoal);
  },

  toggleMilestone: (goalId: string, milestoneId: string) => {
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
      updateGoalDb(goalId, { milestones: updatedMilestones });
    }
  },

  removeGoal: (goalId: string) => {
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== goalId),
    }));
    deleteGoal(goalId);
  },

  updateGoal: (goalId: string, updates: Partial<Goal>) => {
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === goalId ? { ...g, ...updates } : g,
      ),
    }));
    updateGoalDb(goalId, updates);
  },

  editMilestone: (goalId: string, milestoneId: string, newLabel: string) => {
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
      updateGoalDb(goalId, { milestones: updatedMilestones });
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
