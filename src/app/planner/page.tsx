"use client";
import { useState, useEffect } from "react";

import AppSidebar from "@/components/shared/AppSidebar";
import Header from "@/components/Header";
import { PlannerRoot } from "@/components/planner/PlannerRoot";

export default function PlannerPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="flex h-dvh overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header
          title="WORKSPACE - Daily Planner"
          subtitle={mounted ? new Date()
            .toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })
            .toUpperCase() : ""}
        />

        {/* Content area */}
        <main
          className="flex-1 overflow-y-auto px-4 py-6 pb-24 md:px-12 md:py-10"
        >
          <div className="max-w-[1400px] mx-auto">
            <PlannerRoot />
          </div>
        </main>
      </div>
    </div>
  );
}
