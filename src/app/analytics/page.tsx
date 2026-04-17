"use client";

import { useState, useEffect } from "react";
import AppSidebar from "@/components/shared/AppSidebar";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import AnalyticsContent from "@/components/analytics/AnalyticsContent";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { AnalyticsIcon, ArrowRightIcon } from "@/constants/Icons";

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex h-dvh overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AnalyticsHeader />
        
        <main className="flex-1 overflow-y-auto px-4 py-8">
          <div className="max-w-6xl mx-auto h-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 rounded-full border-2 border-[#7c6af0]/20 border-t-[#7c6af0] animate-spin" />
              </div>
            ) : user ? (
              <AnalyticsContent />
            ) : (
              /* Analytics Lock Screen */
              <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center gap-7 animate-in fade-in zoom-in duration-700">
                <div
                  className="flex items-center justify-center rounded-2xl"
                  style={{
                    width: "70px",
                    height: "70px",
                    background: "rgba(124,106,240,0.05)",
                    border: "1px solid rgba(124,106,240,0.1)",
                  }}
                >
                  <AnalyticsIcon style={{ width: "28px", height: "28px", color: "#7c6af0" }} />
                </div>

                <div className="space-y-3">
                  <h2
                    className="text-white font-bold"
                    style={{ fontSize: "28px", letterSpacing: "-0.02em" }}
                  >
                    Deep Performance <span style={{ color: "#7c6af0" }}>Metrics.</span>
                  </h2>
                  <p
                    style={{
                      fontSize: "15px",
                      color: "#555",
                      lineHeight: 1.6,
                    }}
                  >
                    Sign in to unlock long-term trends, efficiency correlations, 
                    and predictive analytics based on your historical behavior.
                  </p>
                </div>

                <Link
                  href="/auth/signin"
                  className="flex items-center gap-3 px-7 py-3.5 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #7c6af0, #5a4fd4)",
                    color: "#fff",
                    fontSize: "14px",
                    textDecoration: "none",
                  }}
                >
                  Sign In to View Analytics
                  <ArrowRightIcon />
                </Link>
                
                <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-left">
                    <p className="text-[10px] text-[#444] font-bold uppercase tracking-wider mb-1">Trends</p>
                    <p className="text-[11px] text-[#666]">Visualize your growth over weeks and months.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-left">
                    <p className="text-[10px] text-[#444] font-bold uppercase tracking-wider mb-1">Correlations</p>
                    <p className="text-[11px] text-[#666]">Find links between habits and task density.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
