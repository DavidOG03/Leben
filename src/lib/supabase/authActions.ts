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

  return { error: null };
}

export async function signUpWithEmail(data: SignUpData): Promise<AuthResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { full_name: data.fullName },
    },
  });

  if (error) return { error: error.message };

  return { error: null };
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

// ─── Step-Up Vault Verification Actions ────────────────────────────────────────

export async function verifyAccountPassword(
  password: string
): Promise<AuthResult> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      return { error: "No active user session found. Please sign in again." };
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });

    if (signInError) {
      return { error: signInError.message };
    }

    return { error: null };
  } catch (err: any) {
    return { error: err?.message || "Verification failed." };
  }
}

// ─── Vault Cloud Sync Actions ─────────────────────────────────────────────────

export async function saveUserVaultData(vaultData: {
  enabled: boolean;
  password?: string | null;
  recoveryKey?: string | null;
  locked: boolean;
  frozenPassword?: string | null;
  frozenRecoveryKey?: string | null;
}): Promise<AuthResult> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "No active user session." };
    }

    const metadataUpdates: Record<string, any> = {
      vault_enabled: vaultData.enabled,
      vault_locked: vaultData.locked,
    };
    if (vaultData.password !== undefined) metadataUpdates.vault_pwd = vaultData.password;
    if (vaultData.recoveryKey !== undefined) metadataUpdates.vault_recovery_key = vaultData.recoveryKey;
    if (vaultData.frozenPassword !== undefined) metadataUpdates.vault_frozen_pwd = vaultData.frozenPassword;
    if (vaultData.frozenRecoveryKey !== undefined) metadataUpdates.vault_frozen_key = vaultData.frozenRecoveryKey;

    const { error: updateError } = await supabase.auth.updateUser({
      data: metadataUpdates,
    });

    if (updateError) {
      return { error: updateError.message };
    }

    return { error: null };
  } catch (err: any) {
    return { error: err?.message || "Failed to save vault data" };
  }
}

export async function fetchUserVaultData() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    const meta = user.user_metadata || {};
    return {
      enabled: meta.vault_enabled ?? false,
      locked: meta.vault_locked ?? false,
      password: meta.vault_pwd ?? null,
      recoveryKey: meta.vault_recovery_key ?? null,
      frozenPassword: meta.vault_frozen_pwd ?? null,
      frozenRecoveryKey: meta.vault_frozen_key ?? null,
    };
  } catch {
    return null;
  }
}
