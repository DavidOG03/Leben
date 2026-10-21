"use client";

import { useState } from "react";
import {
  LockIcon,
  KeyIcon,
  EyeIcon,
  EyeOffIcon,
  ShieldIcon,
  CloseIcon,
} from "@/constants/Icons";
import { useLebenStore } from "@/store/useStore";

interface Props {
  onUnlock: (
    password: string,
  ) => boolean | { success: boolean; error?: string };
  onClose?: () => void;
  onOpenResetModal?: () => void;
}

type LockState = "default" | "error" | "rate_limit" | "unlocking";

export default function VaultLockModal({
  onUnlock,
  onClose,
  onOpenResetModal,
}: Props) {
  const userEmail = useLebenStore((s: any) => s.userEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [useRecovery, setUseRecovery] = useState(false);
  const [lockState, setLockState] = useState<LockState>("default");
  const [customError, setCustomError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [countdown, setCountdown] = useState(0);

  const handleUnlock = () => {
    if (lockState === "rate_limit" || !password) return;

    setLockState("unlocking");
    setCustomError(null);

    // Simulate unlock check
    setTimeout(() => {
      const res = onUnlock(password);
      const isSuccess = typeof res === "boolean" ? res : res.success;
      if (isSuccess) {
        // Parent unmounts modal
      } else {
        const errorMsg = typeof res === "object" ? res.error : undefined;
        if (errorMsg) {
          setCustomError(errorMsg);
        }
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 5) {
          setLockState("rate_limit");
          setCountdown(30);
          const interval = setInterval(() => {
            setCountdown((c) => {
              if (c <= 1) {
                clearInterval(interval);
                setLockState("default");
                setAttempts(0);
                return 0;
              }
              return c - 1;
            });
          }, 1000);
        } else {
          setLockState("error");
        }
        setPassword("");
      }
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleUnlock();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Lock card */}
      <div
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center text-center relative"
        style={{
          backgroundColor: "#111111",
          border: "1px solid #222222",
        }}
      >
        {/* Optional close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
            style={{ width: "28px", height: "28px", color: "#888888" }}
            title="Close"
          >
            <CloseIcon />
          </button>
        )}

        {/* Lock icon with glow */}
        <div
          className="flex items-center justify-center rounded-full mb-6"
          style={{
            width: "80px",
            height: "80px",
            background:
              "linear-gradient(135deg, rgba(124,106,240,0.22), rgba(124,106,240,0.06))",
            boxShadow: "0 0 32px rgba(124,106,240,0.2)",
            border: "1px solid rgba(124,106,240,0.3)",
          }}
        >
          <LockIcon width="32" height="32" stroke="#7c6af0" strokeWidth="1.8" />
        </div>

        <h2
          className="font-bold text-[#f0f0f0] mb-1.5"
          style={{ fontSize: "22px", letterSpacing: "-0.02em" }}
        >
          {useRecovery ? "Enter Recovery Key" : "Your Personal Vault is locked"}
        </h2>

        <p className="mb-6" style={{ fontSize: "13px", color: "#888888" }}>
          {useRecovery
            ? "Enter your emergency recovery key (REC-...)"
            : "Enter your password to access your Personal notes"}
        </p>

        {/* Password or Recovery Key input */}
        <div
          className="w-full flex items-center gap-2 px-3 mb-2 rounded-xl"
          style={{
            backgroundColor: "#161616",
            border: `1px solid ${lockState === "error" ? "rgba(240,106,106,0.5)" : "#222222"}`,
            height: "48px",
          }}
        >
          <input
            type={showPassword || useRecovery ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (lockState === "error") {
                setLockState("default");
                setCustomError(null);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              useRecovery ? "REC-XXXX-XXXX-XXXX..." : "Vault password"
            }
            className="flex-1 bg-transparent outline-none"
            style={{
              fontSize: "13px",
              color: "#f0f0f0",
              letterSpacing: useRecovery ? "0.02em" : "0.06em",
            }}
            disabled={lockState === "rate_limit" || lockState === "unlocking"}
            autoFocus
          />
          {!useRecovery && (
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{ color: "#888888" }}
            >
              {showPassword ? (
                <EyeOffIcon width="15" height="15" />
              ) : (
                <EyeIcon width="15" height="15" />
              )}
            </button>
          )}
        </div>

        {/* Error / rate limit messages */}
        {lockState === "error" && (
          <p
            className="w-full text-left mb-3"
            style={{ fontSize: "11px", color: "#f06a6a", lineHeight: 1.4 }}
          >
            {customError ||
              (useRecovery
                ? "Invalid recovery key. Please check and try again."
                : `Incorrect password. ${5 - attempts} attempt${5 - attempts !== 1 ? "s" : ""} remaining.`)}
          </p>
        )}
        {lockState === "rate_limit" && (
          <p
            className="w-full text-left mb-3"
            style={{ fontSize: "11px", color: "#f06a6a" }}
          >
            Too many attempts. Try again in {countdown}s.
          </p>
        )}

        {/* Unlock button */}
        <button
          onClick={handleUnlock}
          disabled={
            lockState === "rate_limit" || lockState === "unlocking" || !password
          }
          className="w-full py-3 rounded-xl font-semibold mb-4 transition-opacity"
          style={{
            fontSize: "14px",
            backgroundColor:
              lockState === "rate_limit" || !password ? "#1c1c1c" : "#7c6af0",
            border:
              lockState === "rate_limit" || !password
                ? "1px solid #222222"
                : "1px solid transparent",
            color:
              lockState === "rate_limit" || !password ? "#555555" : "#ffffff",
            cursor:
              lockState === "rate_limit" || !password
                ? "not-allowed"
                : "pointer",
            opacity: lockState === "unlocking" ? 0.7 : 1,
          }}
        >
          {lockState === "unlocking"
            ? "Verifying..."
            : useRecovery
              ? "Unlock with Key"
              : "Unlock Vault"}
        </button>

        {/* Forgot password / Back toggle */}
        <button
          onClick={() => {
            setUseRecovery(!useRecovery);
            setPassword("");
            setLockState("default");
            setCustomError(null);
          }}
          style={{ fontSize: "12px", color: "#9d8ff5" }}
          className="hover:opacity-80 transition-opacity mb-3"
        >
          {useRecovery
            ? "Back to password"
            : "Forgot password? Use recovery key"}
        </button>

        {onOpenResetModal && (
          <button
            type="button"
            onClick={onOpenResetModal}
            style={{ fontSize: "12px", color: "#888888" }}
            className="hover:text-[#f0f0f0] transition-colors underline mb-6"
          >
            Forgot password & recovery key? Reset & freeze vault
          </button>
        )}
      </div>
    </div>
  );
}
