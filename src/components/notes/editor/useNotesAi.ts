"use client";

import { useState } from "react";
import type { Note } from "@/store/noteSlice";
import type { AiAction } from "../NotesAiModal";
import { useLebenStore, Task } from "@/store/useStore";

interface UseNotesAiProps {
  note: Note | null;
  allNotes?: Note[];
  editorRef: React.RefObject<HTMLDivElement>;
  title: string;
  setTitle: (t: string) => void;
  latestTitle: React.MutableRefObject<string>;
  onUpdate: (
    id: string,
    updates: Partial<
      Pick<Note, "title" | "content" | "tags" | "notebook" | "pinned">
    >,
  ) => void;
  setSaveState: (state: "saved" | "saving" | "unsaved") => void;
}

export function useNotesAi({
  note,
  allNotes,
  editorRef,
  title,
  setTitle,
  latestTitle,
  onUpdate,
  setSaveState,
}: UseNotesAiProps) {
  const [aiAction, setAiAction] = useState<AiAction | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleTriggerAi = async (act: AiAction) => {
    if (!note) return;
    setAiAction(act);
    setAiLoading(true);
    setAiError(null);
    setAiData(null);

    try {
      const res = await fetch("/api/ai/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: act,
          noteTitle: title || note.title,
          noteContent: editorRef.current?.innerHTML || note.content,
          tags: note.tags,
          notebook: note.notebook,
          allNotes: (allNotes || []).map((n) => ({
            id: n.id,
            title: n.title,
            content: n.content,
            tags: n.tags,
            notebook: n.notebook,
          })),
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to process AI request");
      }

      const json = await res.json();
      setAiData(json.result);
    } catch (err: any) {
      console.error("[Notes AI] error:", err);
      setAiError(err.message || "Failed to complete AI action");
    } finally {
      setAiLoading(false);
    }
  };

  const handleInsertSummary = (tldr: string, keyPoints: string[] = []) => {
    if (!note) return;
    const bulletsHtml =
      keyPoints && keyPoints.length > 0
        ? `<ul style="margin: 6px 0 0 16px; padding: 0;">${keyPoints
            .map((p) => `<li>${p}</li>`)
            .join("")}</ul>`
        : "";
    const blockquoteHtml = `<blockquote style="border-left: 3px solid #7c6af0; background: rgba(124,106,240,0.08); padding: 10px 14px; margin: 12px 0; border-radius: 6px; color: #d0c8fa;"><strong style="color:#ffffff;">TL;DR:</strong> ${tldr}${bulletsHtml}</blockquote><p><br></p>`;
    const updatedHtml = blockquoteHtml + (editorRef.current?.innerHTML || "");
    if (editorRef.current) {
      editorRef.current.innerHTML = updatedHtml;
    }
    onUpdate(note.id, { content: updatedHtml });
  };

  const handleImportTask = async (
    taskTitle: string,
    category?: string,
    priority?: "high" | "medium" | "low",
  ) => {
    const { addTask } = useLebenStore.getState();
    const newTask: Task = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      title: taskTitle,
      completed: false,
      tag: category?.toUpperCase() === "PERSONAL" ? "PERSONAL" : "WORK",
      priority: priority || "medium",
      date: new Date().toISOString().split("T")[0],
    };
    await addTask(newTask);
  };

  const handleImportAllTasks = async (
    tasks: Array<{
      title: string;
      category?: string;
      priority?: "high" | "medium" | "low";
    }>,
  ) => {
    const { addTask } = useLebenStore.getState();
    const today = new Date().toISOString().split("T")[0];
    for (const t of tasks) {
      await addTask({
        id:
          Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        title: t.title,
        completed: false,
        tag: t.category?.toUpperCase() === "PERSONAL" ? "PERSONAL" : "WORK",
        priority: t.priority || "medium",
        date: today,
      });
    }
  };

  const handleAcceptImprovement = (
    improvedTitle: string,
    improvedContent: string,
  ) => {
    if (!note) return;
    setTitle(improvedTitle);
    latestTitle.current = improvedTitle;
    if (editorRef.current) {
      editorRef.current.innerHTML = improvedContent;
    }
    onUpdate(note.id, { title: improvedTitle, content: improvedContent });
    setSaveState("saved");
  };

  const handleCloseAiModal = () => {
    setAiAction(null);
    setAiData(null);
    setAiError(null);
  };

  return {
    aiAction,
    aiLoading,
    aiData,
    aiError,
    handleTriggerAi,
    handleInsertSummary,
    handleImportTask,
    handleImportAllTasks,
    handleAcceptImprovement,
    handleCloseAiModal,
  };
}
