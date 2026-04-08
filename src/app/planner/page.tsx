"use client";

import AppSidebar from "@/components/shared/AppSidebar";
import Header from "@/components/Header";
import { PlannerRoot } from "@/components/planner/PlannerRoot";

export default function PlannerPage() {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header 
          title="WORKSPACE - Daily Planner" 
          subtitle="TUESDAY, OCT 24"
        />

        {/* Content area */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ padding: "40px 48px" }}
        >
          <div className="max-w-[1400px] mx-auto">
            <PlannerRoot />
          </div>
        </main>
      </div>
    </div>
  );
}
