import AppSidebar from "@/components/shared/AppSidebar";
import HabitsHeader from "@/components/habits/HabitsHeader";
import HabitsContent from "@/components/habits/HabitsContent";

export default function HabitsPage() {
  return (
    <div
      className="flex h-dvh overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <HabitsHeader />
        <HabitsContent />
      </div>
    </div>
  );
}
