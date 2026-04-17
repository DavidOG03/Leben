import { NextResponse } from "next/server";
import { unifiedAiCall } from "@/lib/ai/unifiedClient";
import { buildUserContext } from "@/lib/ai/contextBuilder";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    // 1. Fetch live user data as context (Tasks, Habits, Goals, Books)
    const { contextString } = await buildUserContext();

    // 2. Prep systematic instruction to bound the AI's persona
    const systemPrompt = {
      role: "system",
      content: `You are the Leben AI Productivity Engine. 
Your primary goal is to help the user manage their tasks, habits, and goals.

CRITICAL INSTRUCTION:
- You must ONLY use the provided USER CONTEXT to answer questions about the user's performance, status, or plans.
- If the user asks about something not in their context, try to relate it back to their productivity or focus. 
- Be concise, sharp, and encouraging.

USER CONTEXT:
${contextString}

TODAY'S DATE: ${new Date().toLocaleDateString()}
`
    };

    // 3. Inject system prompt at the start of the conversation for strict bounding
    const messagesWithContext = [systemPrompt, ...messages];

    // Use the unified AI client which now handles SDK calls, system instructions, and failovers
    const text = await unifiedAiCall(messagesWithContext);
    
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("[Chat API Error]:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
