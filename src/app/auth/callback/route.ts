// Supabase redirects here after:
// 1. Email confirmation (when user clicks the link in their inbox)
// 2. OAuth sign in (Google, GitHub)
//
// This route receives a "code" in the URL query params,
// exchanges it for a real session, then redirects the user.

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  // Supabase puts the one-time code in the URL: /auth/callback?code=abc123
  const code = searchParams.get("code");

  // Optional: where to redirect after successful auth
  // Supabase lets you pass a "next" param so you can redirect to a specific page
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // This exchanges the temporary code for a permanent session cookie
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, send to an error page
  return NextResponse.redirect(
    `${origin}/auth/signin?error=auth-callback-failed`,
  );
}
