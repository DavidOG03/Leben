"use client";

import { useState } from "react";
import {
  LockIcon,
  KeyIcon,
  ShieldIcon,
  CloseIcon,
  CheckCircleIcon,
  EyeOffIcon,
  EyeIcon,
} from "@/constants/Icons";
import { useLebenStore } from "@/store/useStore";

interface Props {
  onClose: () => void;
  onRestore: (passwordOrKey: string) => boolean | { success: boolean; error?: string };
  frozenNotesCount: number;
}

export default function VaultRestoreModal({
  onClose,
  onRestore,
  frozenNotesCount,
}: Props) {
  const userEmail = useLebenStore((s: any) => s.userEmail);
  const [inputVal, setInputVal] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    setError(null);
    setRestoring(true);

    setTimeout(() => {
      const res = onRestore(inputVal.trim());
      const isCorrect = typeof res === "boolean" ? res : res.success;
      setRestoring(false);

      if (isCorrect) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        const errorMsg =
          typeof res === "object" && res.error
            ? res.error
            : "Invalid password or recovery key. Please check your spelling and try again.";
        setError(errorMsg);
      }
    }, 400);
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
        className="w-full max-w-sm rounded-2xl p-7 flex flex-col relative text-center"
        style={{
          backgroundColor: "#111111",
          border: "1px solid #222222",
          boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          style={{ width: "28px", height: "28px", color: "#555555" }}
          title="Close"
        >
          <CloseIcon width="12" height="12" />
        </button>

        {success ? (
          <div className="py-6 flex flex-col items-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{
                backgroundColor: "rgba(76,175,125,0.12)",
                border: "1px solid rgba(76,175,125,0.25)",
                color: "#4caf7d",
              }}
            >
              <CheckCircleIcon width="24" height="24" />
            </div>
            <h3
              className="font-bold mb-1"
              style={{ fontSize: "16px", color: "#f0f0f0" }}
            >
              Vault Notes Restored!
            </h3>
            <p style={{ fontSize: "12px", color: "#888888" }}>
              {frozenNotesCount} note{frozenNotesCount === 1 ? "" : "s"} merged
              back into your Personal vault.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Header Icon */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(124,106,240,0.22), rgba(124,106,240,0.06))",
                border: "1px solid rgba(124,106,240,0.3)",
                boxShadow: "0 0 30px rgba(124,106,240,0.2)",
              }}
            >
              <LockIcon width="22" height="22" stroke="#7c6af0" />
            </div>

            <h3
              className="font-bold mb-1.5"
              style={{
                fontSize: "19px",
                letterSpacing: "-0.01em",
                color: "#f0f0f0",
              }}
            >
              Restore Frozen Vault
            </h3>
            {userEmail && (
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full mb-3"
                style={{
                  backgroundColor: "#161616",
                  border: "1px solid #222222",
                  fontSize: "11px",
                  color: "#9d8ff5",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#7c6af0]" />
                <span>Account: {userEmail}</span>
              </div>
            )}
            <p
              className="leading-relaxed mb-5"
              style={{ fontSize: "12px", color: "#888888" }}
            >
              Enter the <strong>previous Master Password</strong> or{" "}
              <strong>Emergency Recovery Key</strong> used when these{" "}
              {frozenNotesCount} note
              {frozenNotesCount === 1 ? "" : "s"} were originally sealed.
            </p>

            <div
              className="w-full flex items-center gap-2 px-3 mb-3 rounded-xl transition-colors"
              style={{
                backgroundColor: "#161616",
                border: `1px solid ${error ? "rgba(240,106,106,0.3)" : "#222222"}`,
                height: "46px",
              }}
            >
              <KeyIcon width="14" height="14" />
              <input
                type={showPassword ? "text" : "password"}
                autoFocus
                required
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Old Password or REC-XXXX-..."
                className="flex-1 bg-transparent text-xs outline-none"
                style={{ color: "#f0f0f0" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs hover:text-white transition-colors"
                style={{ color: "#555555" }}
              >
                {showPassword ? (
                  <EyeOffIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </button>
            </div>

            {error && (
              <p
                className="mb-3 text-left leading-normal"
                style={{ fontSize: "11px", color: "#f06a6a" }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={restoring || !inputVal.trim()}
              className="w-full py-2.5 rounded-xl font-semibold text-xs transition-opacity disabled:opacity-40 mb-4"
              style={{
                backgroundColor: "#7c6af0",
                color: "#f0f0f0",
              }}
            >
              {restoring
                ? "Decrypting & Restoring..."
                : "Restore Notes to Personal Vault"}
            </button>

            <div
              className="flex items-center justify-center gap-1.5"
              style={{ fontSize: "10px", color: "#555555" }}
            >
              <ShieldIcon width="11" height="11" />
              <span>
                Notes will be safely decrypted and merged into Personal
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
