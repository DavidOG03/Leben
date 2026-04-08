// app/auth/signup/page.tsx

import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";
import { SignUpForm } from "@/components/auth/SignUpForm";
import "@/app/auth/auth.css";

export const metadata = {
  title: "Create Account | Leben",
};

const SIGNUP_FEATURES = [
  {
    label: "EFFICIENCY",
    description: "Automated workflows for your daily digital life.",
  },
  {
    label: "PRIVACY",
    description: "Local-first data processing with end-to-end security.",
  },
];

export default function SignUpPage() {
  return (
    <main className="auth-layout">
      {/* Left: Hero panel */}
      <section className="auth-left">
        <div className="auth-logo">
          <div className="logo-icon" aria-hidden="true">
            ✦
          </div>
          <span className="logo-text">Leben</span>
        </div>

        <AuthHeroPanel
          heading="Join the Intelligence Layer"
          subheading="Your cognitive evolution starts here."
          features={SIGNUP_FEATURES}
        />
      </section>

      {/* Right: Sign up form */}
      <section className="auth-right">
        {/* "Sign In" top-right link */}
        <a href="/auth/signin" className="top-signin-link">
          Sign In
        </a>
        <SignUpForm />
      </section>

      <footer className="auth-footer">
        <a href="/privacy">PRIVACY POLICY</a>
        <a href="/terms">TERMS OF SERVICE</a>
        <a href="/support">SUPPORT</a>
        <span>© 2026 LEBEN. ALL RIGHTS RESERVED.</span>
      </footer>
    </main>
  );
}
