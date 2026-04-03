import AppSidebar from "@/components/shared/AppSidebar";
import AILeftPanel from "@/components/ai/AILeftPanel";
import AIChatPanel from "@/components/ai/AIChatPanel";
import AIRightPanel from "@/components/ai/AIRightPanel";
import AITopBar from "@/components/ai/AITopBar";

export default function AIPage() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
      <AppSidebar newEntryLabel="New Entry" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AITopBar />
        <div className="flex flex-1 overflow-hidden">
          <AILeftPanel />
          <AIChatPanel />
          <AIRightPanel />
        </div>
      </div>
    </div>
  );
}
