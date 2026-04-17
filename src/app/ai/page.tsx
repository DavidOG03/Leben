"use client";

import { useState, useEffect } from "react";
import AppSidebar from "@/components/shared/AppSidebar";
import AILeftPanel from "@/components/ai/AILeftPanel";
import AIChatPanel from "@/components/ai/AIChatPanel";
// import AIRightPanel from "@/components/ai/AIRightPanel";
import AITopBar from "@/components/ai/AITopBar";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { AIIcon, ArrowRightIcon } from "@/constants/Icons";

export default function AIPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Sidebar */}
      <AppSidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AITopBar />

        <div className="flex flex-1 overflow-hidden">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-[#7c6af0]/20 border-t-[#7c6af0] animate-spin" />
            </div>
          ) : user ? (
            <>
              <AILeftPanel />
              <AIChatPanel />
              {/* <AIRightPanel /> */}
            </>
          ) : (
            /* AI Lock Screen */
            <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto text-center gap-8 animate-in fade-in zoom-in duration-700">
              <div
                className="flex items-center justify-center rounded-3xl"
                style={{
                  width: "80px",
                  height: "80px",
                  background:
                    "linear-gradient(135deg, #141420 0%, #0f0f18 100%)",
                  border: "1px solid #252535",
                  boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
                }}
              >
                <AIIcon className="w-[32px] h-[32px] text-[#7c6af0]" />
              </div>

              <div className="space-y-4">
                <h2
                  className="text-white font-bold"
                  style={{ fontSize: "32px", letterSpacing: "-0.03em" }}
                >
                  Unlock the{" "}
                  <span style={{ color: "#7c6af0" }}>Neural Assistant.</span>
                </h2>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#666",
                    lineHeight: 1.6,
                  }}
                >
                  Access a strictly-bounded AI assistant specifically informed
                  by your personal goals, habits, and tasks.
                </p>
              </div>

              <Link
                href="/auth/signin"
                className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #7c6af0, #5a4fd4)",
                  boxShadow: "0 15px 30px -10px rgba(124, 106, 240, 0.4)",
                  color: "#fff",
                  fontSize: "15px",
                  textDecoration: "none",
                }}
              >
                Sign In to Start Chatting
                <ArrowRightIcon />
              </Link>

              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#7c6af0]" />
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#444",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    Personal Context
                  </span>
                </div>
                <div className="w-px h-3 bg-white/5" />
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#7c6af0]" />
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#444",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    Strict Bounding
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
