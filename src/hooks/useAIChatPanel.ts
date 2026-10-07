"use client";

import { useRef, useState } from "react";
import { useAIStore } from "@/store/useAIStore";
import { useLebenStore } from "@/store/useStore";
import type { Habit, ScheduleItem } from "@/store/useStore";
import type { ImportedEntityTracker, ImportKind } from "@/utils/aiChatTypes";
import {
  buildGoalDraft,
  buildHabitDraft,
  buildBookDraft,
  cleanupImportedText,
  detectRequestedKinds,
  getImportStateKey,
  isListImportRequest,
  parseDirectAddRequest,
  parsePlannerLine,
  parseStructuredListItems,
  resolveImportKinds,
  shortenImportedText,
  summarizeCounts,
} from "@/utils/aiChatImportUtils";

export function useAIChatPanel() {
  const { messages, addMessage, isThinking, setThinking, removeMessage } = useAIStore();
  
  const tasks = useLebenStore((s) => s.tasks);
  const habits = useLebenStore((s) => s.habits);
  const goals = useLebenStore((s) => s.goals);
  const schedule = useLebenStore((s) => s.schedule);
  const books = useLebenStore((s) => (s as any).books || []);
  
  const addTask = useLebenStore((s) => s.addTask);
  const deleteTask = useLebenStore((s) => s.deleteTask);
  const addHabit = useLebenStore((s) => s.addHabit);
  const removeHabit = useLebenStore((s) => s.removeHabit);
  const addGoal = useLebenStore((s) => s.addGoal);
  const removeGoal = useLebenStore((s) => s.removeGoal);
  const setSchedule = useLebenStore((s) => s.setSchedule);
  const addBook = useLebenStore((s) => (s as any).addBook);
  const removeBook = useLebenStore((s) => (s as any).removeBook);

  const [input, setInput] = useState("");
  const [thinkingStatus, setThinkingStatus] = useState("Thinking...");
  const [errorState, setErrorState] = useState<{ failedPrompt: string; errorMessage: string } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const [importedMessageIds, setImportedMessageIds] = useState<
    Record<string, boolean>
  >({});
  const importedTrackerRef = useRef<ImportedEntityTracker>({
    taskIds: [],
    habitIds: [],
    goalTitles: [],
    plannerIds: [],
    bookTitles: [],
  });

  const postAssistantMessage = (content: string) =>
    addMessage({
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

  const findLatestAssistantList = (requestedKinds?: ImportKind[]) => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const message = messages[index];
      if (message.role !== "assistant") continue;
      const items = parseStructuredListItems(message.content);
      if (items.length === 0) continue;
      if (
        requestedKinds?.length &&
        !items.some((item) => requestedKinds.includes(item.kind))
      )
        continue;
      return { message, items };
    }
    return null;
  };

  const createHabit = (text: string): Habit => {
    const draft = buildHabitDraft(text);
    return {
      id: `h${Date.now()}${Math.random().toString(36).slice(2, 5)}`,
      label: draft.label,
      sub: draft.sub,
      streak: 0,
      longestStreak: 0,
      color: "#4a90d9",
      icon: "🎯",
      checked: false,
      completedDates: [],
      name: draft.label,
      pct: 0,
    };
  };

  const createPlannerItem = (text: string): ScheduleItem | null => {
    const parsed = parsePlannerLine(text);
    if (!parsed) return null;
    return {
      id: `schedule-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      start: parsed.start,
      end: parsed.end,
      title: parsed.title,
      description: parsed.description,
      tag: "PLAN",
      priority: "medium",
      status: "pending",
    };
  };

  const importAssistantMessage = (msgId: string, itemIndex: string | number, item: any) => {
    const now = new Date().toISOString();
    
    if (item.kind === "planner") {
      const plannerItem = createPlannerItem(item.text);
      if (plannerItem) setSchedule([...schedule, plannerItem]);
    } else if (item.kind === "habit") {
      addHabit(createHabit(item.text));
    } else if (item.kind === "goal") {
      addGoal(buildGoalDraft(item.text, item.milestones, item.deadline));
    } else if (item.kind === "book") {
      if (addBook) addBook(buildBookDraft(item.text));
    } else if (item.kind === "task") {
      addTask({
        id: crypto.randomUUID(),
        title: cleanupImportedText(item.text) || item.text,
        completed: false,
        tag: "WORK",
        priority: "medium",
        date: now.slice(0, 10),
        createdAt: now,
      });
    }

    setImportedMessageIds(prev => ({
      ...prev,
      [`${msgId}-${itemIndex}`]: true
    }));
  };

  const handleDirectAdd = (kind: ImportKind, text: string) => {
    if (kind === "task") {
      const now = new Date().toISOString();
      addTask({
        id: crypto.randomUUID(),
        title:
          shortenImportedText(text, { maxChars: 52, maxWords: 8 }) ||
          cleanupImportedText(text),
        completed: false,
        tag: "WORK",
        priority: "medium",
        date: now.slice(0, 10),
        createdAt: now,
      });
      postAssistantMessage("Added 1 task to your task list.");
      return true;
    }
    if (kind === "habit") {
      addHabit(createHabit(text));
      postAssistantMessage("Added 1 habit to your habit tracker.");
      return true;
    }
    if (kind === "goal") {
      addGoal(buildGoalDraft(text));
      postAssistantMessage("Added 1 goal to your goal tracker.");
      return true;
    }
    const plannerItem = createPlannerItem(text);
    if (!plannerItem) {
      postAssistantMessage(
        "I couldn't parse that planner item. Use a time range like 9:00 AM - 10:00 AM deep work.",
      );
      return true;
    }
    setSchedule([...schedule, plannerItem]);
    postAssistantMessage("Added 1 planner block to your Daily Planner.");
    return true;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isThinking) return;
    const trimmedText = text.trim();
    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      content: trimmedText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    addMessage(userMsg);
    setInput("");

    const directRequest = parseDirectAddRequest(trimmedText);
    if (directRequest)
      return void handleDirectAdd(directRequest.kind, directRequest.text);

    setErrorState(null);
    setThinking(true);

    const lowerText = trimmedText.toLowerCase();
    let statuses: string[] = [];
    if (lowerText.includes("task")) {
      statuses = ["Analyzing tasks...", "Generating items...", "Prioritizing...", "Structuring...", "Refining...", "Finalizing..."];
    } else if (lowerText.includes("habit")) {
      statuses = ["Reviewing habits...", "Generating items...", "Structuring routines...", "Analyzing...", "Refining...", "Finalizing..."];
    } else if (lowerText.includes("goal")) {
      statuses = ["Weighing goals...", "Aligning milestones...", "Analyzing...", "Structuring...", "Refining...", "Finalizing..."];
    } else if (lowerText.includes("plan") || lowerText.includes("schedule")) {
      statuses = ["Structuring schedule...", "Allocating time...", "Analyzing...", "Optimizing...", "Refining...", "Finalizing..."];
    } else if (lowerText.includes("book")) {
      statuses = ["Retrieving books...", "Searching library...", "Analyzing...", "Curating...", "Refining...", "Finalizing..."];
    } else {
      statuses = ["Thinking...", "Analyzing...", "Processing...", "Synthesizing...", "Refining...", "Finalizing..."];
    }
    
    setThinkingStatus(statuses[0]);

    const intervalId = setInterval(() => {
      setThinkingStatus((prev) => {
        const currentIdx = statuses.indexOf(prev);
        const nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % statuses.length;
        return statuses[nextIdx];
      });
    }, 2000);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const resPromise = fetch("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({ messages: [...messages, userMsg] }),
        signal: controller.signal
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 120000)
      );

      const res = await Promise.race([resPromise, timeoutPromise]) as Response;
      
      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      if (data.text) {
        addMessage({
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.text,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }
    } catch (error: any) {
      if (error.name === "AbortError" || error.message === "AbortError") {
        setErrorState({
          failedPrompt: trimmedText,
          errorMessage: "AI process was stopped by user.",
        });
      } else if (error.message === "Timeout") {
        setErrorState({
          failedPrompt: trimmedText,
          errorMessage: "It took too long to fetch AI message.",
        });
      } else {
        console.error(error);
        setErrorState({
          failedPrompt: trimmedText,
          errorMessage: "Sorry, I encountered an error connecting to the neural engine.",
        });
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      clearInterval(intervalId);
      setThinking(false);
    }
  };

  const abortRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const retryRequest = () => {
    if (errorState?.failedPrompt) {
      sendMessage(errorState.failedPrompt);
    }
  };

  return {
    messages,
    input,
    setInput,
    isThinking,
    thinkingStatus,
    errorState,
    importedMessageIds,
    sendMessage,
    removeMessage,
    abortRequest,
    retryRequest,
    importAssistantMessage,
  };
}
