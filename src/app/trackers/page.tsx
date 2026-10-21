"use client";

import AppSidebar from "@/components/shared/AppSidebar";
import TrackersHeader from "@/components/trackers/TrackersHeader";
import TrackersContent from "@/components/trackers/TrackersContent";

export default function TrackersPage() {
  return (
    <div className="flex h-dvh overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TrackersHeader />
        <TrackersContent />
      </div>
    </div>
  );
}
