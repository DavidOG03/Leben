import { GoogleGenAI } from "@google/genai";
import type { Task, Habit, ScheduleItem } from "@/store/useStore";
import { executeWithRateLimit, generateOpenAiRateLimitError } from "@/lib/ai/withRateLimit";

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

export async function generateDayPlan(
  input: PlannerInput,
  onWait?: (sec: number) => void
): Promise<PlannerOutput> {

  const pendingTasks = input.tasks.filter((t) => !t.completed);

  const prompt = `
You are a personal productivity AI for an app called Leben.
The user's data is below. Generate a realistic time-blocked day plan, 3 sharp insights, and the ONE most critical task/habit/goal of the entire day as the 'mainFocus'.

TASKS (incomplete only):
${
  pendingTasks.length > 0
    ? pendingTasks
        .map(
          (t) =>
            `- id: "${t.id}" | priority: [${t.priority ?? "medium"}] | title: ${t.title}${t.category ? ` (${t.category})` : ""}${t.tag ? ` [${t.tag}]` : ""}`,
        )
        .join("\n")
    : "No pending tasks"
}

HABITS:
${input.habits.map((h) => `- id: "${h.id}" | name: ${h.name}`).join("\n") || "None"}

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
- Plan the user's day from morning to evening (e.g. 7:00 AM to 9:00 PM)
- Include Tasks, Habits, and actions advancing Goals
- Schedule high priority tasks during peak morning hours (8-12)
- Add a lunch/recharge break around 12:30
- Keep each block between 45 mins and 2 hours (Habits can be shorter, e.g. 15-30 mins)
- Add short buffer gaps between blocks (15 mins)
- For every block mapped to a user task or habit, you MUST set "taskId" to its accurate id.

Respond ONLY with valid JSON. No markdown, no backticks, no explanation.

{
  "mainFocus": {
    "title": "the absolute #1 most important thing today",
    "reason": "sharp psychological or strategic reason why (max 8 words)"
  },
  "schedule": [
    {
      "id": "unique string for this slot",
      "taskId": "must be the exact id string from the user's task or habit list (or null if it's a break/custom event)",
      "start": "HH:MM",
      "end": "HH:MM",
      "title": "task title from user's list",
      "description": "one sentence on how to approach this block",
      "tag": "DEEP WORK | MEETING | RECHARGE | ADMIN | REVIEW | HABIT",
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

  const geminiCall = async () => {
    const ai = new GoogleGenAI({
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
    });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const raw = response.text ?? "";
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean) as PlannerOutput;
  };

  const openAiCall = async () => {
    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!openAiResponse.ok) {
      throw generateOpenAiRateLimitError(openAiResponse);
    }

    const data = await openAiResponse.json();
    const raw = data.choices[0].message.content ?? "";
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean) as PlannerOutput;
  };

  return executeWithRateLimit(geminiCall, openAiCall, onWait);
}
