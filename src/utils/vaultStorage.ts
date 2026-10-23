import { createClient } from "@/lib/supabase/client";
import type { VaultCryptoBundle } from "@/utils/vaultCrypto";

export interface VaultState {
  enabled: boolean;
  locked: boolean;
  cryptoBundle: VaultCryptoBundle | null;
  // Legacy backward-compatibility fields (no longer hold plaintext)
  password: string | null;
  recoveryKey: string | null;
  frozenPassword: string | null;
  frozenRecoveryKey: string | null;
}

/**
 * Returns the effective user key for vault storage.
 * If userId is not provided (e.g. during session transitions or guest mode),
 * falls back to the last active user session to preserve the user's setup.
 */
export function getVaultUserKey(userId?: string | null): string {
  if (userId && userId.trim()) return userId.trim();
  if (typeof window !== "undefined") {
    const lastUser = localStorage.getItem("notes_vault_last_active_user");
    if (lastUser && lastUser.trim()) return lastUser.trim();
  }
  return "guest";
}

/**
 * Retrieves the complete vault security state for the active user/session.
 * Never exposes or returns plaintext credentials.
 */
export function loadVaultState(userId?: string | null): VaultState {
  if (typeof window === "undefined") {
    return {
      enabled: false,
      locked: false,
      cryptoBundle: null,
      password: null,
      recoveryKey: null,
      frozenPassword: null,
      frozenRecoveryKey: null,
    };
  }

  const effectiveId = getVaultUserKey(userId);
  const uKey = (k: string) => `notes_vault_${effectiveId}_${k}`;
  const sKey = (k: string) => `notes_vault_session_${k}`;

  // Check user-scoped key first, then fallback to session key
  const enabledRaw =
    localStorage.getItem(uKey("enabled")) ??
    localStorage.getItem(sKey("enabled"));
  const enabled = enabledRaw === "true";

  let cryptoBundle: VaultCryptoBundle | null = null;
  const bundleRaw =
    localStorage.getItem(uKey("crypto_bundle")) ??
    localStorage.getItem(sKey("crypto_bundle"));
  if (bundleRaw) {
    try {
      cryptoBundle = JSON.parse(bundleRaw);
    } catch {}
  }

  // Check if session holds the decrypted in-memory vault key
  const hasSessionKey = Boolean(
    sessionStorage.getItem("notes_vault_session_key"),
  );

  const lockedRaw =
    localStorage.getItem(uKey("locked")) ??
    localStorage.getItem(sKey("locked"));
  // If enabled: locked if explicitly marked locked OR if bundle exists but no active session key
  const locked = enabled
    ? lockedRaw === "true" || (Boolean(cryptoBundle) && !hasSessionKey)
    : false;

  return {
    enabled,
    locked,
    cryptoBundle,
    password: null,
    recoveryKey: null,
    frozenPassword: null,
    frozenRecoveryKey: null,
  };
}

/**
 * Persists vault security state across user storage, active session, and Supabase cloud metadata.
 * Stores ONLY the zero-knowledge crypto bundle (salt, wrapped keys, canary).
 * Plaintext passwords and recovery keys are completely purged from local and cloud storage.
 */
export async function persistVaultState(
  userId: string | null | undefined,
  updates: Partial<VaultState>,
) {
  if (typeof window === "undefined") return;

  const effectiveId = getVaultUserKey(userId);
  const uKey = (k: string) => `notes_vault_${effectiveId}_${k}`;
  const sKey = (k: string) => `notes_vault_session_${k}`;

  if (userId && userId !== "guest") {
    localStorage.setItem("notes_vault_last_active_user", userId);
  }

  if (updates.enabled !== undefined) {
    const val = String(updates.enabled);
    localStorage.setItem(uKey("enabled"), val);
    localStorage.setItem(sKey("enabled"), val);
  }

  if (updates.locked !== undefined) {
    const val = String(updates.locked);
    localStorage.setItem(uKey("locked"), val);
    localStorage.setItem(sKey("locked"), val);
  }

  if (updates.cryptoBundle !== undefined) {
    if (updates.cryptoBundle) {
      const serialized = JSON.stringify(updates.cryptoBundle);
      localStorage.setItem(uKey("crypto_bundle"), serialized);
      localStorage.setItem(sKey("crypto_bundle"), serialized);
    } else {
      localStorage.removeItem(uKey("crypto_bundle"));
      localStorage.removeItem(sKey("crypto_bundle"));
    }
  }

  // Clean up any legacy plaintext keys from browser storage
  localStorage.removeItem(uKey("pwd"));
  localStorage.removeItem(sKey("pwd"));
  localStorage.removeItem(uKey("key"));
  localStorage.removeItem(sKey("key"));
  localStorage.removeItem(uKey("frozen_pwd"));
  localStorage.removeItem(sKey("frozen_pwd"));
  localStorage.removeItem(uKey("frozen_key"));
  localStorage.removeItem(sKey("frozen_key"));

  // Sync to Supabase user_metadata (Zero-Knowledge: NO PLAINTEXT PASSWORDS)
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const metadataUpdates: Record<string, any> = {};
      if (updates.enabled !== undefined)
        metadataUpdates.vault_enabled = updates.enabled;
      if (updates.locked !== undefined)
        metadataUpdates.vault_locked = updates.locked;
      if (updates.cryptoBundle !== undefined)
        metadataUpdates.vault_crypto_bundle = updates.cryptoBundle;

      // Actively purge plaintext credentials from Supabase metadata
      metadataUpdates.vault_pwd = null;
      metadataUpdates.vault_recovery_key = null;
      metadataUpdates.vault_frozen_pwd = null;
      metadataUpdates.vault_frozen_key = null;

      if (Object.keys(metadataUpdates).length > 0) {
        await supabase.auth.updateUser({ data: metadataUpdates });
      }
    }
  } catch (err) {
    // Non-blocking sync error
    console.warn("Vault metadata sync skipped:", err);
  }
}

/**
 * Hydrates vault crypto bundle from Supabase user_metadata upon login or initial load.
 */
export async function syncVaultFromSupabase(
  user: any,
): Promise<VaultState | null> {
  if (!user || typeof window === "undefined") return null;

  const meta = user.user_metadata || {};
  const effectiveId = user.id;
  const uKey = (k: string) => `notes_vault_${effectiveId}_${k}`;
  const sKey = (k: string) => `notes_vault_session_${k}`;

  localStorage.setItem("notes_vault_last_active_user", user.id);

  if (meta.vault_enabled !== undefined && meta.vault_enabled !== null) {
    const enabled = Boolean(meta.vault_enabled);
    const bundle: VaultCryptoBundle | null = meta.vault_crypto_bundle || null;

    localStorage.setItem(uKey("enabled"), String(enabled));
    localStorage.setItem(sKey("enabled"), String(enabled));

    if (bundle) {
      const serialized = JSON.stringify(bundle);
      localStorage.setItem(uKey("crypto_bundle"), serialized);
      localStorage.setItem(sKey("crypto_bundle"), serialized);
    }

    // Always purge local plaintext keys
    localStorage.removeItem(uKey("pwd"));
    localStorage.removeItem(sKey("pwd"));
    localStorage.removeItem(uKey("key"));
    localStorage.removeItem(sKey("key"));
    localStorage.removeItem(uKey("frozen_pwd"));
    localStorage.removeItem(sKey("frozen_pwd"));
    localStorage.removeItem(uKey("frozen_key"));
    localStorage.removeItem(sKey("frozen_key"));

    // Check if session has active vault key
    const hasSessionKey = Boolean(
      sessionStorage.getItem("notes_vault_session_key"),
    );
    const locked = enabled ? !hasSessionKey : false;

    localStorage.setItem(uKey("locked"), String(locked));
    localStorage.setItem(sKey("locked"), String(locked));

    return {
      enabled,
      locked,
      cryptoBundle: bundle,
      password: "",
      recoveryKey: "",
      frozenPassword: "",
      frozenRecoveryKey: "",
    };
  }

  return null;
}
