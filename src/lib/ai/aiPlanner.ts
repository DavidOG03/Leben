import { GoogleGenAI } from "@google/genai";
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
}

export async function generateDayPlan(
  input: PlannerInput,
): Promise<PlannerOutput> {
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
  });

  const pendingTasks = input.tasks.filter((t) => !t.completed);

  const prompt = `
You are a personal productivity AI for an app called Leben.
The user's data is below. Generate a realistic time-blocked day plan and 3 sharp insights.

TASKS (incomplete only):
${
  pendingTasks.length > 0
    ? pendingTasks
        .map(
          (t) =>
            `- [${t.priority ?? "medium"}] ${t.title}${t.category ? ` (${t.category})` : ""}${t.tag ? ` [${t.tag}]` : ""}`,
        )
        .join("\n")
    : "No pending tasks"
}

HABITS:
${input.habits.map((h) => `- ${h.name}`).join("\n") || "None"}

GOALS:
${
  input.goals
    .map(
      (g) =>
        `- ${g.title}${g.progress !== undefined ? ` (${g.progress}% complete)` : ""}`,
    )
    .join("\n") || "None"
}

RULES FOR SCHEDULE:
- Working hours: 8:00 AM to 8:00 PM
- Schedule high priority tasks during peak morning hours (8-12)
- Add a lunch/recharge break around 12:30
- Keep each block between 45 mins and 2 hours
- Only schedule tasks from the user's actual task list above
- Add short buffer gaps between tasks (15 mins)

Respond ONLY with valid JSON. No markdown, no backticks, no explanation.

{
  "schedule": [
    {
      "id": "unique string",
      "start": "HH:MM",
      "end": "HH:MM",
      "title": "task title from user's list",
      "description": "one sentence on how to approach this block",
      "tag": "DEEP WORK | MEETING | RECHARGE | ADMIN | REVIEW",
      "priority": "high | medium | low",
      "status": "pending"
    }
  ],
  "insights": [
    "insight 1 - specific to this user's tasks and patterns",
    "insight 2",
    "insight 3"
  ]
}
`;

  // New SDK: generateContent lives directly on ai.models
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const raw = response.text ?? "";
  const clean = raw.replace(/```json|```/g, "").trim();

  const parsed: PlannerOutput = JSON.parse(clean);
  return parsed;
}
