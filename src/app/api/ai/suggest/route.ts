import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { unifiedAiCall } from "@/lib/ai/unifiedClient";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing prompt" },
        { status: 400 }
      );
    }

    // Call the unified AI client (environment variables accessible here!)
    const result = await unifiedAiCall(prompt, { json: true });

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("[AI Suggest API] Error:", error);
    return NextResponse.json(
      { error: error.message || "AI call failed" },
      { status: 500 }
    );
  }
}
