"use client";

// SignUpForm.tsx
// Full name, email, password with strength meter, confirm password, terms checkbox.

import { useState } from "react";
import { signUpWithEmail } from "@/lib/supabase/authActions";
import { AuthSocialButtons } from "./AuthSocialButtons";
import {
  PasswordStrengthBar,
  getPasswordStrength,
} from "./PasswordStrengthBar";
import { EyeIcon, EyeOffIcon } from "@/constants/Icons";

export function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Client-side validation before we even hit the server
  const validate = (): string | null => {
    if (!fullName.trim()) return "Please enter your full name.";
    if (!email.trim()) return "Please enter your email.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    // if (!agreedToTerms) return "Please agree to the terms to continue.";

    const { score } = getPasswordStrength(password);
    if (score < 2) return "Please choose a stronger password.";

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await signUpWithEmail({ fullName, email, password });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Force a full reload after successful sign up so the dashboard loads fresh Supabase data
    window.location.assign("/");
  };

  return (
    <div className="auth-card signup-card">
      <div className="auth-card-header">
        <h2 className="auth-card-title">Create your Leben account</h2>
        <p className="auth-card-subtitle">
          Start building a smarter life system
        </p>
      </div>

      {error && (
        <div className="auth-error" role="alert">
          {error}
        </div>
      )}

      <div className="auth-fields">
        <div className="field-group">
          <label htmlFor="fullName" className="field-label">
            FULL NAME
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="auth-input"
            autoComplete="name"
          />
        </div>

        <div className="field-group">
          <label htmlFor="email" className="field-label">
            EMAIL
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
          <label htmlFor="password" className="field-label">
            PASSWORD
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input pr-10"
              autoComplete="new-password"
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
          {/* Strength bar only renders when there is a password value */}
          <PasswordStrengthBar password={password} />
        </div>

        <div className="field-group">
          <label htmlFor="confirmPassword" className="field-label">
            CONFIRM PASSWORD
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirm(e.target.value)}
              className="auth-input pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
        {/* 
        <label className="terms-row">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="terms-checkbox"
          />
          <span className="terms-text">
            I agree to the{" "}
            <a href="/terms" className="terms-link">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="terms-link">
              Privacy Policy
            </a>
            .
          </span>
        </label> */}
      </div>

      <button
        className="auth-submit-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>

      <div className="auth-divider">
        <span>OR</span>
      </div>

      <AuthSocialButtons />

      <p className="auth-redirect-text">
        Already have an account?{" "}
        <a href="/auth/signin" className="auth-redirect-link">
          Sign in
        </a>
      </p>
    </div>
  );
}
