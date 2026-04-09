import AppSidebar from "@/components/shared/AppSidebar";
import GoalsHeader from "@/components/goals/GoalsHeader";
import GoalsContent from "@/components/goals/GoalsContent";

export default function GoalsPage() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <GoalsHeader />
        <GoalsContent />
      </div>
    </div>
  );
}
