import React from "react";
import type { Note } from "@/store/noteSlice";

export type SaveState = "saved" | "saving" | "unsaved";

export interface ActiveFormats {
  bold: boolean;
  italic: boolean;
  strike: boolean;
  h1: boolean;
  h2: boolean;
  ul: boolean;
  ol: boolean;
  quote: boolean;
}

export interface NotesEditorProps {
  note: Note | null;
  allNotes?: Note[];
  onSelectNote?: (id: string) => void;
  onBackToList?: () => void;
  isLocked?: boolean;
  vaultEnabled?: boolean;
  vaultLocked?: boolean;
  onSetupVault?: () => void;
  onUnlockRequest?: () => void;
  onUpdate: (
    id: string,
    updates: Partial<
      Pick<Note, "title" | "content" | "tags" | "notebook" | "pinned">
    >,
  ) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string, archive: boolean) => void;
  onRestore: (id: string) => void;
  relativeTime: (iso: string) => string;
}

export interface ToolbarButtonProps {
  children: React.ReactNode;
  active?: boolean;
  title?: string;
  onMouseDown?: (e: React.MouseEvent) => void;
}

export interface EditorHeaderProps {
  note: Note;
  title: string;
  isPersonal: boolean;
  vaultEnabled: boolean;
  onBackToList?: () => void;
  showAiPanel?: boolean;
  onToggleAi?: () => void;
  showTagInput: boolean;
  newTagInput: string;
  setNewTagInput: (val: string) => void;
  setShowTagInput: (val: boolean) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onToggleVault: () => void;
  onTogglePin: () => void;
  onArchive: (id: string, archive: boolean) => void;
  onDelete: (id: string) => void;
  onUpdateNotebook: (name: string) => void;
}

export interface EditorToolbarProps {
  activeFormats: ActiveFormats;
  onExecuteCommand: (command: string, value?: string) => void;
  onInsertCode: () => void;
  onInsertCheckbox: () => void;
}

export interface EditorStatusBarProps {
  saveState: SaveState;
  wordCount: number;
  readTime: number;
  updatedAt: string;
  relativeTime: (iso: string) => string;
}
