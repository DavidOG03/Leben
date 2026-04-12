import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  // 2. Fetch usage
  const { data: usage } = await supabase
    .from("ai_usage")
    .select("tokens")
    .eq("user_id", user.id)
    .eq("date", today);

  const totalUsed = usage?.reduce((acc, curr) => acc + curr.tokens, 0) ?? 0;
  const limit = 25000; // Match the limit in route.ts

  return NextResponse.json({
    used: totalUsed,
    limit: limit,
    remaining: Math.max(0, limit - totalUsed),
    percentage: Math.min(100, Math.round((totalUsed / limit) * 100)),
  });
}
