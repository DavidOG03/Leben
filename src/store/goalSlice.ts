import { StateCreator } from "zustand";
import {
  Goal,
  GoalFormData,
  Milestone,
  generateGoalId,
  generateMilestoneId,
} from "@/utils/goals.types";

export interface GoalsSlice {
  goals: Goal[];
  addGoal: (data: GoalFormData) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  removeGoal: (goalId: string) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  incrementTasksLinked: (goalId: string) => void;
}

// StateCreator<FullStore, [], [], GoalsSlice> -- the slice only knows about itself
// but receives the full store's set/get so cross-slice calls work when needed
export const createGoalsSlice: StateCreator<GoalsSlice, [], [], GoalsSlice> = (
  set,
) => ({
  goals: [],

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
      createdAt: Date.now(),
      name: data.title,
      color: data.color,
      targetValue: data.targetValue,
      currentValue: data.currentValue,
    };

    set((state) => ({ goals: [...state.goals, newGoal] }));
  },

  toggleMilestone: (goalId: string, milestoneId: string) => {
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id !== goalId
          ? g
          : {
              ...g,
              milestones: g.milestones.map((m) =>
                m.id === milestoneId ? { ...m, done: !m.done } : m,
              ),
            },
      ),
    }));
  },

  removeGoal: (goalId: string) => {
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== goalId),
    }));
  },

  updateGoal: (goalId: string, updates: Partial<Goal>) => {
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === goalId ? { ...g, ...updates } : g,
      ),
    }));
  },

  incrementTasksLinked: (goalId: string) => {
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === goalId ? { ...g, tasksLinked: g.tasksLinked + 1 } : g,
      ),
    }));
  },
});
