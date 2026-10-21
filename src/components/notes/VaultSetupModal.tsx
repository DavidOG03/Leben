"use client";

import { useState, useEffect } from "react";
import {
  CloseIcon,
  LockIcon,
  KeyIcon,
  EyeIcon,
  EyeOffIcon,
  ClockCircleIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  DownloadIcon,
  ShieldIcon,
} from "@/constants/Icons";
import { useLebenStore } from "@/store/useStore";

interface Props {
  onClose: () => void;
  onEnable: (password: string, recoveryKey: string) => void;
}

function generateRecoveryKey(userIdentifier?: string | null) {
  const hex = () => Math.random().toString(16).substring(2, 6).toUpperCase();
  let userHex = "";
  if (userIdentifier) {
    userHex = userIdentifier
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 4)
      .toUpperCase();
  }
  if (!userHex || userHex.length < 4) {
    userHex = (userHex + hex()).slice(0, 4);
  }
  return `REC-${userHex}-${hex()}-${hex()}-${hex()}-${hex()}`;
}

function getPasswordStrength(pwd: string) {
  if (pwd.length === 0) return 0;
  if (pwd.length < 6) return 1;
  if (pwd.length < 8) return 2;
  if (pwd.length < 10) return 3;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNum = /[0-9]/.test(pwd);
  const hasSym = /[^A-Za-z0-9]/.test(pwd);
  const complexity = [hasUpper, hasLower, hasNum, hasSym].filter(
    Boolean,
  ).length;
  return complexity >= 3 ? 4 : 3;
}

const strengthLabels = [
  "",
  "Weak — try a longer password",
  "Fair — add symbols & numbers",
  "Good — almost there",
  "Strong — 14 characters, symbols & numbers",
];

const strengthColors = ["", "#f06a6a", "#f0a44f", "#f0d44f", "#4caf7d"];

export default function VaultSetupModal({ onClose, onEnable }: Props) {
  const userId = useLebenStore((s: any) => s.userId);
  const userEmail = useLebenStore((s: any) => s.userEmail);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [recoveryKey] = useState(() =>
    generateRecoveryKey(userId || userEmail),
  );
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  const shortId = userId
    ? userId.replace(/-/g, "").slice(0, 8).toLowerCase()
    : userEmail
      ? userEmail
          .split("@")[0]
          .replace(/[^a-zA-Z0-9]/g, "")
          .slice(0, 8)
          .toLowerCase()
      : "guest";

  const downloadFileName = `leben-vault-recovery-${shortId}.txt`;

  const strength = getPasswordStrength(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canEnable = password.length >= 6 && passwordsMatch && keySaved;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(recoveryKey).catch(() => {});
    setCopied(true);
    setKeySaved(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadKey = () => {
    const text = [
      "============================================================",
      "LEBEN PERSONAL NOTES VAULT — EMERGENCY RECOVERY KEY",
      "============================================================",
      `Account Email : ${userEmail || "Local Guest"}`,
      `User ID       : ${userId || "Local Guest"}`,
      `Key Scope ID  : ${shortId}`,
      `Created At    : ${new Date().toUTCString()}`,
      "",
      "RECOVERY KEY:",
      recoveryKey,
      "",
      "============================================================",
      "IMPORTANT INSTRUCTIONS & SECURITY NOTICE:",
      "1. This recovery key is uniquely configured for your Leben account.",
      "2. If you ever forget your master vault password, you can use",
      "   this exact key in the 'Forgot password? Use recovery key' prompt.",
      "3. You can also use this key to unfreeze and restore your archived notes.",
      "4. Leben uses zero-knowledge encryption: our servers and engineers",
      "   cannot decrypt your vault or recover your password for you.",
      "5. Keep this file in a safe, private location.",
      "============================================================",
    ].join("\n");

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setKeySaved(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleEnable = () => {
    if (canEnable) onEnable(password, recoveryKey);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 relative overflow-y-auto"
        style={{
          backgroundColor: "#111111",
          border: "1px solid #222222",
          maxHeight: "90vh",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
          style={{ width: "28px", height: "28px", color: "#888888" }}
        >
          <CloseIcon />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: "44px",
              height: "44px",
              background:
                "linear-gradient(135deg, rgba(124,106,240,0.22), rgba(124,106,240,0.06))",
              border: "1px solid rgba(124,106,240,0.25)",
            }}
          >
            <LockIcon className="w-5 h-5 text-[#7c6af0]" />
          </div>
          <div className="flex items-center gap-2">
            <div
              className="rounded-full"
              style={{
                width: "7px",
                height: "7px",
                backgroundColor: "#4caf7d",
              }}
            />
            <span style={{ fontSize: "12px", color: "#888888" }}>
              Vault Security Setup
              {/* {userEmail ? `• ${userEmail}` : ""} */}
            </span>
          </div>
        </div>

        <h2
          className="font-black text-[#f0f0f0] mb-2"
          style={{
            fontSize: "26px",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          Protect your notes
        </h2>
        <p
          className="mb-6"
          style={{ fontSize: "13px", color: "#888888", lineHeight: 1.6 }}
        >
          Set up a password to safeguard your sensitive notes.
        </p>

        {/* Master Password */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label
              style={{ fontSize: "12px", color: "#888888", fontWeight: 500 }}
            >
              Password
            </label>
            <span style={{ fontSize: "11px", color: "#7c6af0" }}>Required</span>
          </div>
          <div
            className="flex items-center gap-2 px-3 rounded-xl mb-2"
            style={{
              backgroundColor: "#161616",
              border: "1px solid #222222",
              height: "44px",
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="flex-1 bg-transparent outline-none"
              style={{
                fontSize: "13px",
                color: "#f0f0f0",
                letterSpacing: "0.08em",
              }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{ color: "#888888" }}
            >
              {showPassword ? (
                <EyeOffIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Strength bar */}
          {password.length > 0 && (
            <>
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((seg) => (
                  <div
                    key={seg}
                    className="flex-1 rounded-full transition-all duration-300"
                    style={{
                      height: "3px",
                      backgroundColor:
                        seg <= strength ? strengthColors[strength] : "#222222",
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span
                  style={{ fontSize: "10px", color: strengthColors[strength] }}
                >
                  ✓ {strengthLabels[strength]}
                </span>
                <span style={{ fontSize: "10px", color: "#555555" }}>
                  Entropy: {Math.round(password.length * 5.5)} bits
                </span>
              </div>
            </>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label
              style={{ fontSize: "12px", color: "#888888", fontWeight: 500 }}
            >
              Confirm Password
            </label>
            {passwordsMatch && (
              <span style={{ fontSize: "11px", color: "#4caf7d" }}>
                Match verified
              </span>
            )}
          </div>
          <div
            className="flex items-center gap-2 px-3 rounded-xl"
            style={{
              backgroundColor: "#161616",
              border: `1px solid ${passwordsMatch ? "rgba(76,175,125,0.4)" : "#222222"}`,
              height: "44px",
            }}
          >
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="flex-1 bg-transparent outline-none"
              style={{
                fontSize: "13px",
                color: "#f0f0f0",
                letterSpacing: "0.08em",
              }}
            />
            {passwordsMatch ? (
              <CheckCircleIcon className="text-[#4caf7d]" />
            ) : (
              <button
                onClick={() => setShowConfirm(!showConfirm)}
                style={{ color: "#888888" }}
              >
                <EyeIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Warning box */}
        <div
          className="flex gap-3 p-4 rounded-xl mb-5"
          style={{
            backgroundColor: "rgba(240,106,106,0.08)",
            border: "1px solid rgba(240,106,106,0.25)",
          }}
        >
          <AlertTriangleIcon className="flex-shrink-0 mt-0.5 text-[#f06a6a]" />
          <div>
            <p
              className="font-semibold mb-1"
              style={{ fontSize: "12px", color: "#f06a6a" }}
            >
              Crucial: Save your recovery key
            </p>
            <p style={{ fontSize: "11px", color: "#e0a0a0", lineHeight: 1.5 }}>
              If you forget your password, your notes cannot be recovered
              without it. We cannot reset or access your encrypted vault.
            </p>
          </div>
        </div>

        {/* Recovery Key */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label style={{ fontSize: "12px", color: "#888888" }}>
              Emergency Recovery Key
            </label>
            {keySaved ? (
              <span style={{ fontSize: "11px", color: "#4caf7d" }}>
                ✓ Key saved
              </span>
            ) : (
              <span style={{ fontSize: "11px", color: "#888888" }}>
                Copy or download required
              </span>
            )}
          </div>
          <div
            className="flex items-center gap-2 px-3 rounded-xl mb-1.5"
            style={{
              backgroundColor: "#161616",
              border: `1px solid ${keySaved ? "rgba(76,175,125,0.4)" : "#222222"}`,
              height: "44px",
            }}
          >
            <KeyIcon width="15" height="15" stroke="#7c6af0" />
            <span
              className="flex-1 font-mono"
              style={{
                fontSize: "12px",
                color: "#f0f0f0",
                letterSpacing: "0.04em",
              }}
            >
              {recoveryKey}
            </span>
            <button
              onClick={handleCopyKey}
              className="px-2.5 py-1 rounded-lg transition-colors hover:bg-white/10"
              style={{
                fontSize: "11px",
                color: copied ? "#4caf7d" : "#888888",
                backgroundColor: "#1c1c1c",
                border: "1px solid #222222",
              }}
            >
              {copied ? "Copied!" : "Copy Key"}
            </button>
          </div>
          {/* <p style={{ fontSize: "11px", color: "#666666", marginTop: "4px" }}>
            Uniquely scoped to account:{" "}
            <span style={{ color: "#9d8ff5" }}>{userEmail || shortId}</span>
          </p> */}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mb-2">
          <button
            onClick={handleDownloadKey}
            title={`Downloads as: ${downloadFileName}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors hover:bg-white/5"
            style={{
              fontSize: "13px",
              color: downloaded ? "#4caf7d" : "#888888",
              backgroundColor: "#161616",
              border: `1px solid ${downloaded ? "rgba(76,175,125,0.4)" : "#222222"}`,
            }}
          >
            <DownloadIcon />
            {downloaded ? "Downloaded ✓" : "Download recovery key"}
          </button>
          <button
            onClick={handleEnable}
            disabled={!canEnable}
            title={
              !keySaved
                ? "Please copy or download your recovery key to enable the vault lock"
                : !canEnable
                  ? "Passwords must match (min 6 characters)"
                  : ""
            }
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-opacity"
            style={{
              fontSize: "13px",
              backgroundColor: canEnable ? "#7c6af0" : "#1c1c1c",
              border: canEnable ? "1px solid transparent" : "1px solid #222222",
              color: canEnable ? "#ffffff" : "#555555",
              cursor: canEnable ? "pointer" : "not-allowed",
            }}
          >
            <LockIcon className="w-3.5 h-3.5" />
            Enable lock
          </button>
        </div>

        {/* Requirement hint */}
        {!keySaved && password.length >= 6 && passwordsMatch && (
          <p
            className="text-center mt-2"
            style={{ fontSize: "11px", color: "#888888" }}
          >
            ⚠️ You must copy or download your recovery key before enabling the
            lock.
          </p>
        )}
      </div>
    </div>
  );
}
