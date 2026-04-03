export type TaskTag = "WORK" | "PERSONAL";
export type Priority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  tag: TaskTag;
  priority: Priority;
  date: string;
  subtasks?: { done: number; total: number };
  completed?: boolean;
  completedDate?: string;
}
