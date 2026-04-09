"use server";

// authActions.ts
// ALL Supabase auth calls live here.
// Components never call supabase directly - they import from this file.
// This keeps auth logic centralized and easy to debug.

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthResult {
  error: string | null;
}

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}

// ─── Sign In ──────────────────────────────────────────────────────────────────

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  // redirect() throws internally, so it must be called outside try/catch
  redirect("/");
}

// ─── Sign Up ──────────────────────────────────────────────────────────────────

export async function signUpWithEmail(data: SignUpData): Promise<AuthResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      // This stores the user's full name in their Supabase profile metadata
      data: { full_name: data.fullName },
    },
  });

  if (error) return { error: error.message };

  // After signup, Supabase sends a confirmation email.
  // We redirect to a "check your email" page.
  redirect("/");
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOut(): Promise<void> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  await supabase.auth.signOut();

  redirect("/auth/signout");
}

// ─── OAuth (Google / GitHub) ──────────────────────────────────────────────────

// OAuth is handled client-side because it opens a popup/redirect.
// These actions are called from client components using the browser Supabase client.
// See AuthSocialButtons.tsx for the implementation.

export type OAuthProvider = "google" | "github";
