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
      .eq("feature", "morning_brief")
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
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
      httpOptions: { apiVersion: "v1" },
    });
    const result: any = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    console.log("[/api/ai/brief] Raw Gemini result keys:", Object.keys(result));

    // Attempt multiple ways to extract text based on SDK version
    let raw = "";
    if (typeof result.text === "string") {
      raw = result.text;
    } else if (typeof result.response?.text === "function") {
      raw = await result.response.text();
    } else if (result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      raw = result.response.candidates[0].content.parts[0].text;
    }

    if (!raw) {
      console.error("[/api/ai/brief] No text in result:", result);
      throw new Error("Gemini returned an empty response.");
    }

    const clean = raw.replace(/```json|```/g, "").trim();
    const tokenCount =
      result.usageMetadata?.totalTokenCount ??
      result.response?.usageMetadata?.totalTokenCount ??
      0;

    // ── 5. Log usage + write cache ───────────────────────────────────────────
    await Promise.all([
      supabase.from("ai_usage").insert({
        user_id: user.id,
        date: today,
        feature: "morning_brief",
        tokens: tokenCount,
      }),
      supabase.from("ai_cache").upsert(
        {
          user_id: user.id,
          feature: "morning_brief",
          date: today,
          result: clean,
        },
        { onConflict: "user_id,feature,date" },
      ),
    ]);

    return NextResponse.json({ text: clean, cached: false });
  } catch (err: any) {
    console.error("[/api/ai/brief] Gemini error:", err.message);

    // Parse the raw error message to return a clean, user-friendly response
    const msg: string = err.message ?? "";
    let friendlyError =
      "Something went wrong generating your brief. Please try again.";
    let status = 500;

    if (
      msg.includes("503") ||
      msg.includes("UNAVAILABLE") ||
      msg.includes("high demand")
    ) {
      friendlyError =
        "The AI is currently experiencing high demand. Please try again in a moment.";
      status = 503;
    } else if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
      friendlyError = "Daily AI limit reached. Try again tomorrow.";
      status = 429;
    } else if (msg.includes("404") || msg.includes("NOT_FOUND")) {
      friendlyError = "AI model temporarily unavailable. Please try again.";
      status = 503;
    } else if (msg.includes("401") || msg.includes("UNAUTHENTICATED")) {
      friendlyError =
        "AI service authentication failed. Please contact support.";
      status = 500;
    }

    return NextResponse.json({ error: friendlyError }, { status });
  }
}
