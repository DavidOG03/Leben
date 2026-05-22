"use client";

export type ImportKind = "task" | "habit" | "goal" | "planner";

export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  time: string;
  thinking?: boolean;
};

export type StructuredListItem = {
  raw: string;
  text: string;
  kind: ImportKind;
  section: string | null;
};

export type MessageBlock = {
  type: "paragraph" | "list";
  content: string[];
};

export type ImportedEntityTracker = {
  taskIds: string[];
  habitIds: string[];
  goalTitles: string[];
  plannerIds: string[];
};
