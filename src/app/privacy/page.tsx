import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ShieldIcon, LockIcon, CheckCircleIcon } from "@/constants/Icons";

export const metadata: Metadata = {
  title: "Privacy Policy — Leben",
  description:
    "Learn how Leben protects your personal operating system with zero-knowledge encryption, minimal data collection, and complete user ownership.",
};

export default function PrivacyPolicyPage() {
  return (
    <div
      className="min-h-screen text-[#d1d1d6] flex flex-col selection:bg-[#7c6af0]/30 selection:text-white"
      style={{ backgroundColor: "#0a0a0a", fontFamily: "var(--font-dm-sans), sans-serif" }}
    >
      {/* ── Top Navigation Bar ────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-12 py-4 border-b border-[#161616] backdrop-blur-md"
        style={{ backgroundColor: "rgba(10, 10, 10, 0.85)" }}
      >
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/leben-icon-white.png"
            alt="Leben Logo"
            width={28}
            height={28}
            className="transition-transform group-hover:scale-105"
          />
          <span className="font-bold text-white text-base tracking-[-0.02em]">
            Leben
          </span>
          <span
            className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase border border-[#7c6af0]/30"
            style={{ backgroundColor: "rgba(124, 106, 240, 0.12)", color: "#a594fd" }}
          >
            Privacy Policy
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/notes"
            className="text-[13px] text-[#888] hover:text-white px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
          >
            Notes
          </Link>
          <Link
            href="/auth/signin"
            className="text-[13px] font-medium text-white px-4 py-1.5 rounded-lg border border-[#2a2a2a] hover:border-[#7c6af0] transition-colors"
            style={{ backgroundColor: "#141414" }}
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* ── Main Content Area ─────────────────────────────────────────────── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 md:px-10 py-12 md:py-16">
        {/* Hero Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 border border-[#7c6af0]/30 bg-[#7c6af0]/10 text-[#a594fd]">
            <ShieldIcon width="13" height="13" />
            <span>Zero-Knowledge & Privacy-First Architecture</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-extrabold text-white tracking-[-0.03em] leading-[1.15] mb-4"
          >
            Privacy is built into our core, not an afterthought.
          </h1>

          <p className="text-base md:text-lg text-[#8e8e93] max-w-2xl leading-relaxed">
            Leben is designed as your personal operating system. We believe your thoughts, personal documents, habits, and daily schedules belong exclusively to you.
          </p>

          <div className="mt-4 text-xs text-[#555] flex items-center gap-3">
            <span>Effective Date: October 2026</span>
            <span>•</span>
            <span>Version 2.0</span>
          </div>
        </div>

        {/* ── Three Pillars Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <div
            className="p-5 rounded-xl border border-[#1a1a1a] flex flex-col gap-2.5"
            style={{ backgroundColor: "#111" }}
          >
            <div className="w-8 h-8 rounded-lg bg-[#7c6af0]/15 flex items-center justify-center text-[#7c6af0]">
              <LockIcon width="16" height="16" />
            </div>
            <h3 className="text-sm font-bold text-white">Zero-Knowledge Vault</h3>
            <p className="text-xs text-[#777] leading-relaxed">
              Personal notes are encrypted on your device with AES-GCM-256 before leaving your browser. Even our engineers cannot access or decrypt your notes.
            </p>
          </div>

          <div
            className="p-5 rounded-xl border border-[#1a1a1a] flex flex-col gap-2.5"
            style={{ backgroundColor: "#111" }}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <CheckCircleIcon width="16" height="16" />
            </div>
            <h3 className="text-sm font-bold text-white">No Ad Trackers</h3>
            <p className="text-xs text-[#777] leading-relaxed">
              We do not sell your personal data, profile you for targeted advertisers, or embed third-party surveillance scripts.
            </p>
          </div>

          <div
            className="p-5 rounded-xl border border-[#1a1a1a] flex flex-col gap-2.5"
            style={{ backgroundColor: "#111" }}
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400">
              <ShieldIcon width="16" height="16" />
            </div>
            <h3 className="text-sm font-bold text-white">Full User Ownership</h3>
            <p className="text-xs text-[#777] leading-relaxed">
              You maintain 100% control over your workspace. Export, modify, or permanently purge all records from our database with a single click.
            </p>
          </div>
        </div>

        {/* ── Document Body Sections ──────────────────────────────────────── */}
        <article className="space-y-12 text-[14px] leading-[1.75] text-[#a1a1aa]">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-[#7c6af0]">1.</span> Information We Collect
            </h2>
            <p>
              We adhere strictly to the principle of data minimization: we only collect information necessary to operate, synchronize, and protect your workspace.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#999]">
              <li>
                <strong className="text-white">Account Information:</strong> When you register or sign in (via email/password or Google OAuth), we store your email address, user identifier, and public display name.
              </li>
              <li>
                <strong className="text-white">Workspace & Productivity Data:</strong> Tasks, habits, goals, reading logs, and productivity analytics that you explicitly create and save.
              </li>
              <li>
                <strong className="text-white">Client Session Tokens:</strong> Secure HTTP-only authentication cookies and encrypted browser session storage tokens required to maintain your login session.
              </li>
            </ul>
            <div
              className="p-4 rounded-lg border border-[#222] text-xs text-[#888] bg-[#0f0f0f]"
            >
              <strong className="text-white block mb-1">What we DO NOT collect:</strong>
              We do not monitor your device clipboard, collect GPS location data, record biometric templates, or scrape your private communications.
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-[#7c6af0]">2.</span> Zero-Knowledge Personal Notes Vault
            </h2>
            <p>
              Leben features an optional, client-side encrypted Personal Notes Vault engineered under a **Zero-Knowledge Architecture**:
            </p>
            <div
              className="p-5 rounded-xl border border-[#7c6af0]/30 space-y-3"
              style={{ backgroundColor: "rgba(124, 106, 240, 0.04)" }}
            >
              <div className="flex items-center gap-2 text-[#a594fd] font-semibold text-xs uppercase tracking-wider">
                <LockIcon width="14" height="14" />
                Cryptographic Implementation Details
              </div>
              <ul className="list-disc pl-5 space-y-2 text-xs text-[#bbb]">
                <li>
                  <strong className="text-white">Client-Side Key Derivation:</strong> Your Master Password and Emergency Recovery Key are converted to encryption keys directly in your browser using <strong>PBKDF2 with SHA-256 (100,000 iterations)</strong> and a cryptographically secure random salt.
                </li>
                <li>
                  <strong className="text-white">AES-GCM-256 Encryption:</strong> Your personal notes are encrypted locally in memory before being sent to our database.
                </li>
                <li>
                  <strong className="text-white">Zero Server Access:</strong> Your master password and recovery key are <strong>never</strong> transmitted to our servers. Only the encrypted ciphertext package is stored.
                </li>
                <li>
                  <strong className="text-white">Unrecoverable Without Keys:</strong> Because our servers do not hold your decryption keys, Leben engineers cannot reset your vault password or recover locked notes if both credentials are lost.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-[#7c6af0]">3.</span> How We Use Your Information
            </h2>
            <p>Your information is used exclusively to deliver the Leben operating experience:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#999]">
              <li>Synchronizing your tasks, habits, and notes seamlessly across devices (laptops, tablets, and phones).</li>
              <li>Calculating streak histories, habit consistency scores, and completion trends.</li>
              <li>Providing offline cache replay so you can continue working without an internet connection.</li>
              <li>Authenticating requests and defending against brute-force intrusion attacks.</li>
            </ul>
            <p className="text-xs text-[#777]">
              We will never use your personal notes or habit data to train public machine learning models or sell marketing leads.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-[#7c6af0]">4.</span> Data Storage, Retention & Security
            </h2>
            <p>
              We implement comprehensive defense-in-depth measures to protect your workspace:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#999]">
              <li>
                <strong className="text-white">Transport Layer Security (TLS 1.3):</strong> All network communications between your browser and our cloud services are strictly encrypted in transit.
              </li>
              <li>
                <strong className="text-white">Row Level Security (RLS):</strong> Our database employs strict PostgreSQL Row Level Security policies guaranteeing that user accounts can only query and modify rows linked to their authenticated user identifier (<code className="text-[#a594fd] bg-[#1a1a2e] px-1 py-0.5 rounded text-[12px]">auth.uid() = user_id</code>).
              </li>
              <li>
                <strong className="text-white">Retention:</strong> Your data is retained for as long as your account remains open. You can purge records or request full account termination at any time.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-[#7c6af0]">5.</span> Third-Party Service Providers
            </h2>
            <p>
              We partner with trusted, SOC-2 compliant infrastructure providers to host and maintain the service:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#999]">
              <li>
                <strong className="text-white">Supabase Inc.:</strong> Provides enterprise-grade PostgreSQL database hosting, edge infrastructure, and authentication services.
              </li>
              <li>
                <strong className="text-white">Google OAuth (Optional):</strong> Allows sign-in without creating a separate password. Google provides only your verified email and name in accordance with their privacy practices.
              </li>
            </ul>
            <p className="text-xs text-[#777]">
              We do not embed third-party advertising tracking pixels, analytics beacons, or data brokers.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-[#7c6af0]">6.</span> Your Rights & Data Ownership
            </h2>
            <p>
              You maintain complete sovereignty over your data under global privacy regulations (including GDPR and CCPA):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-lg border border-[#1e1e1e] bg-[#111]">
                <h4 className="text-xs font-bold text-white mb-1">Right to Access & Export</h4>
                <p className="text-xs text-[#777]">View and extract your notes, tasks, and habit histories at any time.</p>
              </div>
              <div className="p-3.5 rounded-lg border border-[#1e1e1e] bg-[#111]">
                <h4 className="text-xs font-bold text-white mb-1">Right to Purge Data</h4>
                <p className="text-xs text-[#777]">Execute a permanent, irreversible purge of all personal database records via Settings.</p>
              </div>
              <div className="p-3.5 rounded-lg border border-[#1e1e1e] bg-[#111]">
                <h4 className="text-xs font-bold text-white mb-1">Right to Rectify</h4>
                <p className="text-xs text-[#777]">Update, correct, or rename your account profile and credentials whenever you choose.</p>
              </div>
              <div className="p-3.5 rounded-lg border border-[#1e1e1e] bg-[#111]">
                <h4 className="text-xs font-bold text-white mb-1">Right to Erasure</h4>
                <p className="text-xs text-[#777]">Request complete deletion of your user account and all metadata from our databases.</p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-[#7c6af0]">7.</span> Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, wish to exercise your data rights, or have security disclosures, please reach out to our team:
            </p>
            <div
              className="p-5 rounded-xl border border-[#222] bg-[#111] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <p className="text-white font-semibold text-sm">Leben Privacy & Security</p>
                <p className="text-xs text-[#777]">Inquiries are answered within 48 business hours.</p>
              </div>
              <a
                href="mailto:privacy@leben.app"
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#7c6af0" }}
              >
                privacy@leben.app
              </a>
            </div>
          </section>
        </article>

        {/* ── Bottom Return Card ─────────────────────────────────────────── */}
        <div className="mt-16 pt-8 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#7c6af0] hover:underline"
          >
            ← Return to Leben Dashboard
          </Link>
          <span className="text-xs text-[#555]">
            © {new Date().getFullYear()} Leben OS. All rights reserved.
          </span>
        </div>
      </main>
    </div>
  );
}
