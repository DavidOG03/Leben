"use client";

// PasswordStrengthBar.tsx
// Shows a visual indicator of password strength below the password input.
// The logic scores the password and returns a label + color.

interface PasswordStrengthBarProps {
  password: string;
}

// ─── Strength scoring logic ───────────────────────────────────────────────────
// We export this so the parent form can also use it for validation.

export interface StrengthResult {
  score: number; // 0 to 4
  label: string; // "Weak", "Fair", "Good", "Strong"
  filledSegments: number; // how many of 3 segments to fill
}

export function getPasswordStrength(password: string): StrengthResult {
  if (!password) return { score: 0, label: "", filledSegments: 0 };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const map: Record<number, StrengthResult> = {
    0: { score: 0, label: "Too short", filledSegments: 0 },
    1: { score: 1, label: "Weak", filledSegments: 1 },
    2: { score: 2, label: "Fair", filledSegments: 2 },
    3: { score: 3, label: "Good", filledSegments: 3 },
    4: { score: 4, label: "Strong", filledSegments: 3 },
  };

  return map[score] ?? map[0];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  const { label, filledSegments, score } = getPasswordStrength(password);

  if (!password) return null;

  // Color changes with strength
  const colorMap: Record<number, string> = {
    1: "#ef4444", // red
    2: "#f59e0b", // amber
    3: "#3b82f6", // blue
    4: "#22c55e", // green
  };

  const color = colorMap[score] ?? "#ef4444";

  return (
    <div className="strength-bar-wrapper">
      <div className="strength-segments">
        {[1, 2, 3].map((segment) => (
          <div
            key={segment}
            className="strength-segment"
            style={{
              backgroundColor:
                segment <= filledSegments ? color : "rgba(255,255,255,0.1)",
              transition: "background-color 0.3s ease",
            }}
          />
        ))}
      </div>
      <span className="strength-label" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
