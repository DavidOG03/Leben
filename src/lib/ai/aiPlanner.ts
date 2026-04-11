import type { Task, Habit, ScheduleItem } from "@/store/useStore";

interface Goal {
  title: string;
  progress?: number;
}

interface PlannerInput {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
}

interface PlannerOutput {
  schedule: ScheduleItem[];
  insights: string[];
  mainFocus: { title: string; reason: string };
}

/**
 * Calls the secure server-side /api/ai/planner route.
 * The Gemini API key is never sent to the browser.
 * Rate limiting and caching are handled server-side.
 */
export async function generateDayPlan(
  input: PlannerInput,
  _onWait?: (sec: number) => void, // kept for API compatibility; no longer needed
  forceRefresh = false,
): Promise<PlannerOutput> {
  const res = await fetch("/api/ai/planner", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tasks: input.tasks,
      habits: input.habits,
      goals: input.goals,
      forceRefresh,
    }),
  });

  if (res.status === 429) {
    const { error } = await res.json();
    throw new Error(error ?? "Daily AI limit reached. Try again tomorrow.");
  }
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({}));
    throw new Error(error ?? "AI generation failed. Please try again.");
  }

  const { text } = await res.json();
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as PlannerOutput;
}
