"use client";

import { useState } from "react";
import {
  ShieldIcon,
  CloseIcon,
  KeyIcon,
  AlertTriangleIcon,
  LockIcon,
  CheckCircleIcon,
  RefreshIcon,
  EyeOffIcon,
  EyeIcon,
} from "@/constants/Icons";
import { verifyAccountPassword } from "@/lib/supabase/authActions";
import { useLebenStore } from "@/store/useStore";

interface Props {
  onClose: () => void;
  onConfirmReset: () => void;
  lockedNotesCount: number;
}

export default function VaultResetModal({
  onClose,
  onConfirmReset,
  lockedNotesCount,
}: Props) {
  const userEmail = useLebenStore((s: any) => s.userEmail);
  const [step, setStep] = useState<1 | 2>(1); // 1 = Verify Account, 2 = Confirm Freeze

  // Password verification state
  const [accountPassword, setAccountPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isGuest = !userEmail;

  // Timeout helper to ensure network/browser never gets permanently stuck
  const withTimeout = async <T,>(
    promise: Promise<T>,
    timeoutMs = 8000,
  ): Promise<T> => {
    let timeoutHandle: any;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutHandle = setTimeout(() => {
        reject(
          new Error(
            "Request timed out. Please check your connection and try again.",
          ),
        );
      }, timeoutMs);
    });

    try {
      const result = await Promise.race([promise, timeoutPromise]);
      clearTimeout(timeoutHandle);
      return result;
    } catch (err) {
      clearTimeout(timeoutHandle);
      throw err;
    }
  };

  const handleVerifyAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isGuest) {
      setStep(2);
      return;
    }

    if (!accountPassword.trim()) {
      setError("Please enter your account password to verify your identity.");
      return;
    }

    setVerifying(true);

    try {
      const res = await withTimeout(verifyAccountPassword(accountPassword));
      if (res.error) {
        setError(res.error);
        setVerifying(false);
        return;
      }

      // Identity verified successfully -> Proceed to Step 2
      setVerifying(false);
      setStep(2);
    } catch (err: any) {
      setError(
        err?.message ||
          "Verification failed. Please check your password and try again.",
      );
      setVerifying(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-7 flex flex-col relative text-left"
        style={{
          backgroundColor: "#111111",
          border: "1px solid #222222",
          boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          style={{ width: "28px", height: "28px", color: "#555555" }}
          title="Close"
        >
          <CloseIcon width="12" height="12" />
        </button>

        {step === 1 ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(124,106,240,0.22), rgba(124,106,240,0.06))",
                  border: "1px solid rgba(124,106,240,0.3)",
                }}
              >
                <ShieldIcon width="20" height="20" stroke="#7c6af0" />
              </div>
              <div>
                <h3
                  className="font-bold leading-tight"
                  style={{ fontSize: "18px", color: "#f0f0f0" }}
                >
                  Step-Up Account Verification
                </h3>
                <p style={{ fontSize: "12px", color: "#888888" }}>
                  Verify your account password to protect your vault notes
                </p>
              </div>
            </div>

            <p
              className="leading-relaxed mb-5"
              style={{ fontSize: "12px", color: "#888888" }}
            >
              To prevent an unauthorized user from resetting your Personal vault
              on this device, please verify your Leben account password before
              proceeding.
            </p>

            <form onSubmit={handleVerifyAccount} className="space-y-4">
              <div>
                <label
                  className="block font-medium mb-1.5"
                  style={{ fontSize: "11px", color: "#555555" }}
                >
                  Account Email
                </label>
                <input
                  type="text"
                  disabled
                  value={userEmail || "Local Guest Mode"}
                  className="w-full px-3.5 py-2.5 rounded-xl outline-none cursor-not-allowed"
                  style={{
                    fontSize: "12px",
                    backgroundColor: "#161616",
                    border: "1px solid #222222",
                    color: "#888888",
                  }}
                />
              </div>

              {!isGuest && (
                <div>
                  <label
                    className="block font-medium mb-1.5"
                    style={{ fontSize: "11px", color: "#888888" }}
                  >
                    Enter Leben Account Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoFocus
                      required
                      value={accountPassword}
                      onChange={(e) => setAccountPassword(e.target.value)}
                      placeholder="Your account password"
                      className="w-full px-3.5 py-2.5 rounded-xl outline-none pr-12 transition-colors"
                      style={{
                        fontSize: "12px",
                        backgroundColor: "#161616",
                        border: "1px solid #222222",
                        color: "#f0f0f0",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-xs transition-colors hover:text-white"
                      style={{ color: "#555555" }}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="w-4 h-4" />
                      ) : (
                        <EyeIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div
                  className="p-3 rounded-xl leading-normal"
                  style={{
                    backgroundColor: "rgba(240,106,106,0.08)",
                    border: "1px solid rgba(240,106,106,0.25)",
                    color: "#f06a6a",
                    fontSize: "12px",
                  }}
                >
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl transition-colors hover:text-white"
                  style={{ fontSize: "12px", color: "#555555" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={verifying || (!isGuest && !accountPassword)}
                  className="px-5 py-2.5 rounded-xl font-semibold transition-opacity disabled:opacity-40"
                  style={{
                    fontSize: "12px",
                    backgroundColor: "#7c6af0",
                    color: "#f0f0f0",
                  }}
                >
                  {verifying ? "Verifying..." : "Verify & Continue"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(240,106,106,0.12)",
                  border: "1px solid rgba(240,106,106,0.25)",
                  color: "#f06a6a",
                }}
              >
                <AlertTriangleIcon width="20" height="20" />
              </div>
              <div>
                <h3
                  className="font-bold leading-tight"
                  style={{ fontSize: "18px", color: "#f0f0f0" }}
                >
                  Freeze Notes & Reset Vault
                </h3>
                <p style={{ fontSize: "12px", color: "#888888" }}>
                  Zero-Knowledge Data Protection Policy
                </p>
              </div>
            </div>

            {/* Explanatory cards */}
            <div className="space-y-3 mb-5">
              <div
                className="p-3.5 rounded-xl"
                style={{
                  backgroundColor: "#161616",
                  border: "1px solid #222222",
                }}
              >
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5">
                    <LockIcon width="14" height="14" stroke="#7c6af0" />
                  </span>
                  <div style={{ fontSize: "12px" }}>
                    <p
                      className="font-semibold mb-0.5"
                      style={{ color: "#f0f0f0" }}
                    >
                      Your existing {lockedNotesCount} personal notes will NOT
                      be deleted
                    </p>
                    <p style={{ color: "#888888", lineHeight: 1.5 }}>
                      To prevent an intruder from viewing your notes, they will
                      be sealed into your <strong>Frozen Vault Archive</strong>.
                      They cannot be decrypted without your previous key.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="p-3.5 rounded-xl"
                style={{
                  backgroundColor: "#161616",
                  border: "1px solid #222222",
                }}
              >
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-[#4caf7d]" />
                  </span>
                  <div style={{ fontSize: "12px" }}>
                    <p
                      className="font-semibold mb-0.5"
                      style={{ color: "#f0f0f0" }}
                    >
                      You will set up a fresh Master Password
                    </p>
                    <p style={{ color: "#888888", lineHeight: 1.5 }}>
                      Your Personal folder will start clean with a new password
                      and new recovery key for future notes.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="p-3.5 rounded-xl"
                style={{
                  backgroundColor: "#161616",
                  border: "1px solid #222222",
                }}
              >
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5">
                    <RefreshIcon
                      width="14"
                      height="14"
                      className="text-[#9d8ff5]"
                    />
                  </span>
                  <div style={{ fontSize: "12px" }}>
                    <p
                      className="font-semibold mb-0.5"
                      style={{ color: "#f0f0f0" }}
                    >
                      You can restore your frozen notes anytime
                    </p>
                    <p style={{ color: "#888888", lineHeight: 1.5 }}>
                      If you ever locate your old emergency recovery key or
                      remember your previous password, you can decrypt and merge
                      your archived notes back into your vault.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl transition-colors hover:text-white"
                style={{ fontSize: "12px", color: "#555555" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmReset}
                className="px-5 py-2.5 rounded-xl font-semibold transition-opacity hover:opacity-90"
                style={{
                  fontSize: "12px",
                  backgroundColor: "#f06a6a",
                  color: "#ffffff",
                }}
              >
                Freeze Notes & Set Up New Vault
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
