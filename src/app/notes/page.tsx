"use client";

import AppSidebar from "@/components/shared/AppSidebar";
import NotesLayout from "@/components/notes/NotesLayout";

export default function NotesPage() {
  return (
    <div className="flex h-dvh overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
      <AppSidebar />
      <NotesLayout />
    </div>
  );
}
