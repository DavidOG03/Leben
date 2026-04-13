// Purely presentational - just shows the signed out confirmation.
// No Supabase calls here. Sign out is triggered by the user's action
// in the app (e.g. a sign out button that calls the signOut() server action).

export const metadata = {
  title: "Signed Out | Leben",
};

export default function SignedOutPage() {
  return (
    <main className="signout-layout">
      <div className="signout-container">
        <div className="signout-icon" aria-hidden="true">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <div className="signout-card">
          <h1 className="signout-title">You&apos;ve been signed out</h1>

          <div className="signout-badge">
            <span>SESSION SECURED</span>
          </div>

          <p className="signout-subtitle">Your session has ended securely.</p>
          <p className="signout-message">
            Keep building your system when you&apos;re ready
          </p>

          <div className="signout-actions">
            <a href="/auth/signin" className="signout-primary-btn">
              Sign back in
            </a>
            <a href="/" className="signout-secondary-btn">
              Go to dashboard
            </a>
          </div>

          <div className="signout-security-note">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>ENCRYPTED END POINT</span>
          </div>
        </div>

        <p className="signout-brand">Leben</p>
      </div>
    </main>
  );
}
