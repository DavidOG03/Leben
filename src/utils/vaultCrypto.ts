/**
 * Zero-Knowledge Client-Side Cryptography for Leben Notes Vault.
 * Uses Web Crypto API (AES-GCM-256 & PBKDF2 with SHA-256).
 *
 * Security Guarantees:
 * 1. Plaintext passwords and recovery keys are NEVER transmitted to or stored on any server.
 * 2. Personal notes are encrypted client-side with AES-GCM-256 before cloud persistence.
 * 3. The random 256-bit Vault Key is wrapped with keys derived locally from:
 *    - Master Password (via PBKDF2-SHA256, 100,000 iterations)
 *    - Emergency Recovery Key (canonicalized via PBKDF2-SHA256, 100,000 iterations)
 * 4. A canary token verifies decryption validity without exposing credentials.
 */

export interface VaultCryptoBundle {
  version: 1;
  salt: string;            // Base64 random 16-byte salt
  wrappedKeyByPwd: string; // "iv_b64:wrapped_key_b64"
  wrappedKeyByRec: string; // "iv_b64:wrapped_key_b64"
  canary: string;          // "iv_b64:ciphertext_b64" of known canary token
}

const CANARY_PLAINTEXT = "LEBEN_ZERO_KNOWLEDGE_VAULT_V1";
const PBKDF2_ITERATIONS = 100000;

// In-memory active vault key for the current session
let inMemoryVaultKey: CryptoKey | null = null;

// ── Base64 & Byte Utilities ──────────────────────────────────────────────────

export function bufferToBase64(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToBuffer(b64: string): Uint8Array {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function strToBuffer(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

export function bufferToStr(buf: ArrayBuffer | Uint8Array): string {
  return new TextDecoder().decode(buf);
}

export function canonicalizeRecoveryKey(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

// ── Key Derivation & Wrapping ────────────────────────────────────────────────

export async function deriveKeyFromSecret(
  secret: string,
  saltBytes: Uint8Array,
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    strToBuffer(secret),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt", "wrapKey", "unwrapKey"],
  );
}

export async function generateVaultKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
}

async function wrapVaultKey(
  vaultKey: CryptoKey,
  wrappingKey: CryptoKey,
): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrapped = await crypto.subtle.wrapKey(
    "raw",
    vaultKey,
    wrappingKey,
    { name: "AES-GCM", iv },
  );
  return `${bufferToBase64(iv)}:${bufferToBase64(new Uint8Array(wrapped))}`;
}

async function unwrapVaultKey(
  wrappedString: string,
  unwrappingKey: CryptoKey,
): Promise<CryptoKey> {
  const [ivB64, keyB64] = wrappedString.split(":");
  if (!ivB64 || !keyB64) throw new Error("Invalid wrapped key format");

  const iv = base64ToBuffer(ivB64);
  const wrappedBytes = base64ToBuffer(keyB64);

  return crypto.subtle.unwrapKey(
    "raw",
    wrappedBytes,
    unwrappingKey,
    { name: "AES-GCM", iv },
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
}

// ── Vault Setup (Client-Side Only) ───────────────────────────────────────────

export async function createVaultCryptoBundle(
  password: string,
  recoveryKey: string,
): Promise<{ bundle: VaultCryptoBundle; vaultKey: CryptoKey }> {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const saltB64 = bufferToBase64(saltBytes);

  // Derive wrapping keys
  const pwdWrappingKey = await deriveKeyFromSecret(password.trim(), saltBytes);
  const recCanonical = canonicalizeRecoveryKey(recoveryKey);
  const recWrappingKey = await deriveKeyFromSecret(recCanonical, saltBytes);

  // Generate master AES-GCM-256 vault key
  const vaultKey = await generateVaultKey();

  // Wrap vault key with both password and recovery key
  const wrappedKeyByPwd = await wrapVaultKey(vaultKey, pwdWrappingKey);
  const wrappedKeyByRec = await wrapVaultKey(vaultKey, recWrappingKey);

  // Create canary verification token
  const canary = await encryptWithKey(CANARY_PLAINTEXT, vaultKey);

  const bundle: VaultCryptoBundle = {
    version: 1,
    salt: saltB64,
    wrappedKeyByPwd,
    wrappedKeyByRec,
    canary,
  };

  // Set active vault key in memory and session
  setActiveVaultKey(vaultKey);

  return { bundle, vaultKey };
}

/**
 * DRY Helper: Updates the master password and recovery key for an existing vault
 * without re-encrypting the underlying personal notes.
 * Re-wraps the active 256-bit vaultKey with new wrapping keys.
 */
export async function updateVaultCredentials(
  newPassword: string,
  newRecoveryKey: string,
  bundle: VaultCryptoBundle,
  vaultKey?: CryptoKey | null,
): Promise<VaultCryptoBundle> {
  const key = vaultKey || (await getActiveVaultKey());
  if (!key) throw new Error("Vault is locked or active vault key is missing");

  // Generate a fresh salt for the new credentials
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const saltB64 = bufferToBase64(saltBytes);

  const pwdWrappingKey = await deriveKeyFromSecret(newPassword.trim(), saltBytes);
  const recCanonical = canonicalizeRecoveryKey(newRecoveryKey);
  const recWrappingKey = await deriveKeyFromSecret(recCanonical, saltBytes);

  const wrappedKeyByPwd = await wrapVaultKey(key, pwdWrappingKey);
  const wrappedKeyByRec = await wrapVaultKey(key, recWrappingKey);
  const canary = await encryptWithKey(CANARY_PLAINTEXT, key);

  const updatedBundle: VaultCryptoBundle = {
    version: 1,
    salt: saltB64,
    wrappedKeyByPwd,
    wrappedKeyByRec,
    canary,
  };

  return updatedBundle;
}

// ── Vault Unlocking (Client-Side Verification) ────────────────────────────────

export async function tryUnlockVaultWithSecret(
  secret: string,
  bundle: VaultCryptoBundle,
): Promise<{ success: boolean; vaultKey?: CryptoKey; isRecoveryKey?: boolean; error?: string }> {
  try {
    const saltBytes = base64ToBuffer(bundle.salt);

    // 1. First attempt: treat secret as master password
    try {
      const pwdKey = await deriveKeyFromSecret(secret.trim(), saltBytes);
      const unwrapped = await unwrapVaultKey(bundle.wrappedKeyByPwd, pwdKey);
      const canaryText = await decryptWithKey(bundle.canary, unwrapped);
      if (canaryText === CANARY_PLAINTEXT) {
        setActiveVaultKey(unwrapped);
        return { success: true, vaultKey: unwrapped, isRecoveryKey: false };
      }
    } catch {
      // Password unwrap failed, will try recovery key next
    }

    // 2. Second attempt: treat secret as emergency recovery key
    try {
      const recCanonical = canonicalizeRecoveryKey(secret);
      if (recCanonical.length >= 8) {
        const recKey = await deriveKeyFromSecret(recCanonical, saltBytes);
        const unwrapped = await unwrapVaultKey(bundle.wrappedKeyByRec, recKey);
        const canaryText = await decryptWithKey(bundle.canary, unwrapped);
        if (canaryText === CANARY_PLAINTEXT) {
          setActiveVaultKey(unwrapped);
          return { success: true, vaultKey: unwrapped, isRecoveryKey: true };
        }
      }
    } catch {
      // Recovery key unwrap failed
    }

    return { success: false, error: "Incorrect master password or recovery key." };
  } catch (err: any) {
    return { success: false, error: err?.message || "Decryption verification failed." };
  }
}

// ── In-Memory & Session Vault Key Management ──────────────────────────────────

export async function setActiveVaultKey(key: CryptoKey | null): Promise<void> {
  inMemoryVaultKey = key;
  if (typeof window !== "undefined") {
    if (key) {
      try {
        const raw = await crypto.subtle.exportKey("raw", key);
        sessionStorage.setItem("notes_vault_session_key", bufferToBase64(new Uint8Array(raw)));
      } catch {}
    } else {
      sessionStorage.removeItem("notes_vault_session_key");
    }
  }
}

export async function getActiveVaultKey(): Promise<CryptoKey | null> {
  if (inMemoryVaultKey) return inMemoryVaultKey;

  if (typeof window !== "undefined") {
    const b64 = sessionStorage.getItem("notes_vault_session_key");
    if (b64) {
      try {
        const raw = base64ToBuffer(b64);
        const imported = await crypto.subtle.importKey(
          "raw",
          raw,
          { name: "AES-GCM", length: 256 },
          true,
          ["encrypt", "decrypt"],
        );
        inMemoryVaultKey = imported;
        return imported;
      } catch {
        sessionStorage.removeItem("notes_vault_session_key");
      }
    }
  }
  return null;
}

export function clearActiveVaultKey(): void {
  inMemoryVaultKey = null;
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("notes_vault_session_key");
  }
}

// ── Content Encryption & Decryption (AES-GCM-256) ─────────────────────────────

export async function encryptWithKey(
  plaintext: string,
  key: CryptoKey,
): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = strToBuffer(plaintext);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data,
  );
  return `ENC:v1:${bufferToBase64(iv)}:${bufferToBase64(new Uint8Array(encrypted))}`;
}

export async function decryptWithKey(
  ciphertextPackage: string,
  key: CryptoKey,
): Promise<string> {
  if (!ciphertextPackage.startsWith("ENC:v1:")) {
    // Return original text if not encrypted
    return ciphertextPackage;
  }

  const parts = ciphertextPackage.split(":");
  // Format: "ENC:v1:<iv>:<ciphertext>"
  const ivB64 = parts[2];
  const cipherB64 = parts[3];

  if (!ivB64 || !cipherB64) {
    throw new Error("Malformed encrypted payload");
  }

  const iv = base64ToBuffer(ivB64);
  const cipherBytes = base64ToBuffer(cipherB64);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    cipherBytes,
  );

  return bufferToStr(decrypted);
}

/**
 * Checks if note content is encrypted with zero-knowledge AES-GCM.
 */
export function isEncryptedContent(content: string): boolean {
  return typeof content === "string" && content.startsWith("ENC:v1:");
}
