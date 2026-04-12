export const metadata = {
  title: "Check your email | Leben",
};

export default function VerifyEmailPage() {
  return (
    <main className="signout-layout">
      {" "}
      {/* reuse your existing auth CSS */}
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
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>

        <div className="signout-card">
          <h1 className="signout-title">Check your email</h1>

          <div className="signout-badge">
            <span>CONFIRMATION SENT</span>
          </div>

          <p className="signout-subtitle">
            We sent a confirmation link to your email address.
          </p>
          <p className="signout-message">
            Click the link in the email to activate your account.
          </p>

          <div className="signout-actions">
            <a href="/auth/signin" className="signout-secondary-btn">
              Back to sign in
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
            <span>CHECK YOUR SPAM FOLDER IF YOU DON&apos;T SEE IT</span>
          </div>
        </div>

        <p className="signout-brand">Leben</p>
      </div>
    </main>
  );
}
