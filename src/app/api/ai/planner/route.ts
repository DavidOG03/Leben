import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const DAILY_TOKEN_LIMIT = 25000;

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // ── 1. Auth ────────────────────────────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  // ── 2. Cache lookup ────────────────────────────────────────────────────────
  const body = await request.json();
  const { tasks, habits, goals, forceRefresh } = body;

  if (!forceRefresh) {
    const { data: cached } = await supabase
      .from("ai_cache")
      .select("result")
      .eq("user_id", user.id)
      .eq("feature", "daily_plan")
      .eq("date", today)
      .maybeSingle();

    if (cached?.result) {
      return NextResponse.json({ text: cached.result, cached: true });
    }
  }

  // ── 3. Token-based rate limit check ────────────────────────────────────────
  const { data: usage } = await supabase
    .from("ai_usage")
    .select("tokens")
    .eq("user_id", user.id)
    .eq("date", today);

  const totalTokensUsed =
    usage?.reduce((acc, curr) => acc + curr.tokens, 0) ?? 0;

  if (totalTokensUsed >= DAILY_TOKEN_LIMIT) {
    return NextResponse.json(
      { error: "Daily AI token limit reached. Try again tomorrow." },
      { status: 429 },
    );
  }

  // ── 4. Build prompt ────────────────────────────────────────────────────────
  const pendingTasks = (tasks as any[]).filter((t) => !t.completed);

  const prompt = `
You are a personal productivity AI for an app called Leben.
The user's data is below. Generate a realistic time-blocked day plan, 3 sharp insights, and the ONE most critical task/habit/goal of the entire day as the 'mainFocus'.

TASKS (incomplete only):
${
  pendingTasks.length > 0
    ? pendingTasks
        .map(
          (t: any) =>
            `- id: "${t.id}" | priority: [${t.priority ?? "medium"}] | title: ${t.title}${t.category ? ` (${t.category})` : ""}${t.tag ? ` [${t.tag}]` : ""}`,
        )
        .join("\n")
    : "No pending tasks"
}

HABITS:
${(habits as any[]).map((h: any) => `- id: "${h.id}" | name: ${h.name}`).join("\n") || "None"}

GOALS:
${
  (goals as any[])
    .map(
      (g: any) =>
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

  // ── 5. Gemini call (server-side only — key never touches the browser) ──────
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
      httpOptions: { apiVersion: "v1" },
    });
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const raw = result.text ?? "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const tokenCount = result.usageMetadata?.totalTokenCount ?? 0;

    // ── 6. Log usage + write cache ───────────────────────────────────────────
    await Promise.all([
      supabase.from("ai_usage").insert({
        user_id: user.id,
        date: today,
        feature: "daily_plan",
        tokens: tokenCount,
      }),
      supabase.from("ai_cache").upsert(
        {
          user_id: user.id,
          feature: "daily_plan",
          date: today,
          result: clean,
        },
        { onConflict: "user_id,feature,date" },
      ),
    ]);

    return NextResponse.json({ text: clean, cached: false });
  } catch (err: any) {
    console.error("[/api/ai/planner] Gemini error:", err);
    return NextResponse.json(
      { error: "AI generation failed. Please try again." },
      { status: 500 },
    );
  }
}
