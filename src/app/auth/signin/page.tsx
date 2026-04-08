// app/auth/signin/page.tsx
// Thin page - just composes the layout and passes props to sub-components.
// All logic lives in SignInForm.tsx and authActions.ts

import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";
import { SignInForm } from "@/components/auth/SignInForm";
import "@/app/auth/auth.css";

export const metadata = {
  title: "Sign In | Leben",
};

export default function SignInPage() {
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
          heading="Welcome back"
          subheading="Continue building your life system with the digital curator designed for focused execution."
        />

        <div className="auth-social-proof">
          <div className="avatar-stack" aria-hidden="true">
            {["DG", "AM", "LK"].map((initials) => (
              <div key={initials} className="avatar">
                {initials}
              </div>
            ))}
          </div>
          <span className="social-proof-text">JOINED BY 12K+ CREATORS</span>
        </div>
      </section>

      {/* Right: Sign in form */}
      <section className="auth-right">
        <SignInForm />
      </section>

      {/* Footer */}
      <footer className="auth-footer">
        <a href="/privacy">PRIVACY POLICY</a>
        <a href="/terms">TERMS OF SERVICE</a>
        <span>© 2026 LEBEN</span>
      </footer>
    </main>
  );
}
