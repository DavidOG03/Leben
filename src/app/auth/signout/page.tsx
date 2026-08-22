import Link from "next/link";

export const metadata = {
  title: "Signed Out | Leben",
};

export default function SignedOutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0b] flex items-center justify-center relative">
      <div className="flex flex-col items-center gap-5 w-full max-w-[480px] px-6 py-10 relative z-10">
        <div className="text-[#888888] mb-1" aria-hidden="true">
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

        <div className="w-full bg-[#161618] border border-white/5 rounded-[20px] p-9 sm:p-10 flex flex-col items-center gap-3 text-center">
          <h1 className="text-[22px] font-bold text-[#f0f0f0] m-0 tracking-tight">
            See you soon
          </h1>

          <p className="text-sm text-[#888888] m-0">You&apos;ve been signed out safely.</p>
          <p className="text-[13px] text-white/20 mt-2 mb-1">
            Your progress is saved — come back whenever you&apos;re ready.
          </p>

          <div className="w-full flex flex-col gap-2.5 mt-2">
            <Link 
              href="/auth/signin" 
              className="block w-full bg-gradient-to-br from-[#3a4adf] to-[#6b7fff] text-white text-center rounded-[10px] py-3.5 text-[15px] font-semibold transition-opacity hover:opacity-85"
            >
              Sign back in
            </Link>
            <Link 
              href="/" 
              className="block w-full bg-white/[0.04] text-[#888888] text-center rounded-[10px] py-3.5 text-[15px] font-medium transition-colors hover:bg-white/[0.07]"
            >
              Go to dashboard
            </Link>
          </div>
        </div>

        <p className="text-sm font-medium text-white/20 tracking-wide">Leben</p>
      </div>
    </main>
  );
}
