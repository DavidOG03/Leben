"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function EfficiencyScore() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <div
      className="rounded-2xl p-7 flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(145deg, #121212 0%, #0e0e0e 100%)",
        border: "1px solid #1e1e1e",
        minHeight: "260px",
      }}
    >
      <p
        className="uppercase tracking-widest mb-6"
        style={{ fontSize: "10px", color: "#444", letterSpacing: "0.14em" }}
      >
        Efficiency Score
      </p>

      {!user ? (
        <div className="flex flex-col items-center justify-center py-4 gap-4 w-full">
           <div className="relative flex items-center justify-center">
            <svg width="100" height="100" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="54" fill="none" stroke="#1a1a1a" strokeWidth="6" />
              <circle
                cx="70" cy="70" r="54" fill="none"
                stroke="#252525" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="8 6"
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div className="absolute">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "#555", textAlign: "center", lineHeight: 1.6 }}>
            Sign in to analyze<br/>your daily performance.
          </p>
          <Link
            href="/auth/signin"
            className="px-4 py-2 rounded-lg transition-colors hover:bg-[#7c6af0]/10"
            style={{
              fontSize: "12px",
              color: "#7c6af0",
              border: "1px solid #7c6af040",
              textDecoration: "none",
              fontWeight: 600
            }}
          >
            Sign In
          </Link>
        </div>
      ) : (
        <>
          {/* Empty ring */}
          <div className="relative flex items-center justify-center mb-5">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="54" fill="none" stroke="#1a1a1a" strokeWidth="8" />
              <circle
                cx="70" cy="70" r="54" fill="none"
                stroke="#252525" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="12 8"
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span style={{ fontSize: "28px", color: "#2e2e2e", letterSpacing: "-0.03em", lineHeight: 1, fontWeight: 700 }}>
                —
              </span>
              <span className="uppercase tracking-widest mt-1" style={{ fontSize: "9px", color: "#2e2e2e", letterSpacing: "0.12em" }}>
                No data
              </span>
            </div>
          </div>

          <p style={{ fontSize: "11px", color: "#333", textAlign: "center", lineHeight: 1.6 }}>
            Score appears after<br />your first active week
          </p>
        </>
      )}
    </div>
  );
}
