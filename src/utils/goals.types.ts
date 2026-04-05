export interface Milestone {
  id: string;
  label: string;
  done: boolean;
}

export interface Goal {
  id: string;
  title: string;
  deadline: string; // e.g. "Dec 2025"
  icon: string;
  milestones: Milestone[];
  tasksLinked: number;
  createdAt: number; // timestamp
  name: string;
  color: string;
  targetValue: number;
  currentValue: number;
}

export interface GoalFormData {
  color: string;
  targetValue: number;
  currentValue: number;
  title: string;
  deadline: string;
  icon: string;
  milestones: string[]; // raw strings from input, converted to Milestone on save
}

// Derived at render time -- never stored, always computed
export interface DerivedGoalStats {
  progress: number; // 0-100, from milestones done ratio
  status: GoalStatus;
  statusColor: string;
  daysLeft: number;
}

export type GoalStatus =
  | "ACTIVE"
  | "STEADY"
  | "ACCELERATED"
  | "AT RISK"
  | "COMPLETE";

export const STATUS_COLORS: Record<GoalStatus, string> = {
  ACTIVE: "#7c6af0",
  STEADY: "#888",
  ACCELERATED: "#9d8ff5",
  "AT RISK": "#e05c5c",
  COMPLETE: "#4caf8a",
};

// Pure utility: derive stats from a Goal object
export function deriveGoalStats(goal: Goal): DerivedGoalStats {
  const total = goal.milestones.length;
  const done = goal.milestones.filter((m) => m.done).length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  // Parse deadline into a date -- supports "Dec 2025" or "2025-12-01" formats
  const deadlineDate = new Date(goal.deadline);
  const now = new Date();
  const daysLeft = Math.ceil(
    (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  let status: GoalStatus;
  if (progress === 100) {
    status = "COMPLETE";
  } else if (daysLeft < 0) {
    status = "AT RISK";
  } else if (progress >= 70) {
    status = "ACCELERATED";
  } else if (progress >= 30) {
    status = "ACTIVE";
  } else {
    status = "STEADY";
  }

  return {
    progress,
    status,
    statusColor: STATUS_COLORS[status],
    daysLeft,
  };
}

export function generateMilestoneId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function generateGoalId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}
