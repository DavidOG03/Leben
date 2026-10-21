import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Signed Out | Leben",
};

export default function SignedOutPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <div className="flex flex-col items-center gap-6 w-full max-w-[440px] relative z-10">
        <div className="mb-1" aria-hidden="true">
          <Image
            src="/leben-icon-white.png"
            alt="Logo"
            width={48}
            height={48}
          />
        </div>

        <div
          className="w-full rounded-2xl p-8 sm:p-9 flex flex-col items-center text-center shadow-2xl"
          style={{
            backgroundColor: "#111111",
            border: "1px solid #222222",
          }}
        >
          <h1
            className="font-bold mb-2 tracking-tight"
            style={{ fontSize: "22px", color: "#f0f0f0" }}
          >
            See you soon
          </h1>

          <p
            className="mb-1"
            style={{ fontSize: "14px", color: "#888888" }}
          >
            You&apos;ve been signed out safely.
          </p>
          <p
            className="mb-6"
            style={{ fontSize: "12px", color: "#555555" }}
          >
            Your progress is saved — come back whenever you&apos;re ready.
          </p>

          <div className="w-full flex flex-col gap-3">
            <Link
              href="/auth/signin"
              className="block w-full text-center rounded-xl py-3.5 font-semibold transition-all hover:opacity-90 active:scale-[0.99]"
              style={{
                fontSize: "14px",
                backgroundColor: "#7c6af0",
                color: "#ffffff",
                boxShadow: "0 4px 14px rgba(124,106,240,0.25)",
              }}
            >
              Sign back in
            </Link>
            <Link
              href="/"
              className="block w-full text-center rounded-xl py-3 font-medium transition-colors hover:text-[#f0f0f0]"
              style={{
                fontSize: "14px",
                backgroundColor: "#161616",
                border: "1px solid #222222",
                color: "#888888",
              }}
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
