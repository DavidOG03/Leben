import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const DAILY_LIMIT = 15;

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
      .eq("feature", "morning_brief")
      .eq("date", today)
      .maybeSingle();

    if (cached?.result) {
      return NextResponse.json({ text: cached.result, cached: true });
    }
  }

  // ── 3. Rate limit check ────────────────────────────────────────────────────
  const { count } = await supabase
    .from("ai_usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("date", today);

  if ((count ?? 0) >= DAILY_LIMIT) {
    return NextResponse.json(
      { error: "Daily AI limit reached. Try again tomorrow." },
      { status: 429 }
    );
  }

  // ── 4. Gemini call (server-side only — key never touches the browser) ──────
  const prompt = `
You are an AI productivity assistant for an app called Leben.

Given the user's current tasks, habits, and goals, write a short morning brief.

Respond ONLY with valid JSON. No markdown, no backticks, no explanation.

{
  "summary": "One sentence describing the day ahead based on their actual tasks",
  "insights": [
    "Insight 1 - specific to their data, max 12 words",
    "Insight 2 - specific to their data, max 12 words"
  ]
}

User data:
Tasks: ${JSON.stringify(tasks)}
Habits: ${JSON.stringify(habits)}
Goals: ${JSON.stringify(goals)}
`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const raw = response.text ?? "";
    const clean = raw.replace(/```json|```/g, "").trim();

    // ── 5. Log usage + write cache ───────────────────────────────────────────
    await Promise.all([
      supabase.from("ai_usage").insert({
        user_id: user.id,
        date: today,
        feature: "morning_brief",
      }),
      supabase.from("ai_cache").upsert(
        {
          user_id: user.id,
          feature: "morning_brief",
          date: today,
          result: clean,
        },
        { onConflict: "user_id,feature,date" }
      ),
    ]);

    return NextResponse.json({ text: clean, cached: false });
  } catch (err: any) {
    console.error("[/api/ai/brief] Gemini error:", err);
    return NextResponse.json(
      { error: "AI generation failed. Please try again." },
      { status: 500 }
    );
  }
}
