"use client";

// SignInForm.tsx
// Handles email/password sign in.
// Calls the server action from authActions.ts - no direct Supabase calls here.

import { useState } from "react";
import { signInWithEmail } from "@/lib/supabase/authActions";
import { AuthSocialButtons } from "./AuthSocialButtons";
import { EyeIcon, EyeOffIcon } from "@/constants/Icons";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    // signInWithEmail is a server action - it runs on the server.
    // If successful it redirects, if not it returns { error: string }
    const result = await signInWithEmail(email, password);

    if (result?.error) {
      setError(result.error || "This user does not exist");
      setLoading(false);
    }
    // If no error, the server action redirects - no need to do anything here
  };

  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <h2 className="auth-card-title">Sign In</h2>
        <p className="auth-card-subtitle">
          Enter your credentials to access your workspace.
        </p>
      </div>

      {error && (
        <div className="auth-error" role="alert">
          {error}
        </div>
      )}

      <div className="auth-fields">
        <div className="field-group">
          <label htmlFor="email" className="field-label">
            EMAIL ADDRESS
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            autoComplete="email"
          />
        </div>

        <div className="field-group">
          <div className="field-label-row">
            <label htmlFor="password" className="field-label">
              PASSWORD
            </label>
            <a href="/auth/forgot-password" className="forgot-link">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input pr-10"
              autoComplete="current-password"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
      </div>

      <button
        className="auth-submit-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <div className="auth-divider">
        <span>OR CONTINUE WITH</span>
      </div>

      <AuthSocialButtons />

      <p className="auth-redirect-text">
        Don&apos;t have an account?{" "}
        <a href="/auth/signup" className="auth-redirect-link">
          Sign up
        </a>
      </p>
    </div>
  );
}
