import Header from "@/components/Header";
import AIMorningBrief from "@/components/AIMorningBrief";
import EfficiencyScore from "@/components/EfficiencyScore";
import TodaysFocus from "@/components/TodaysFocus";
import HabitStreaks from "@/components/HabitStreaks";
import GoalProgress from "@/components/GoalProgress";
import AppSidebar from "@/components/shared/AppSidebar";

export default function Dashboard() {
  return (
    <div
      className="flex h-screen overflow-y-auto overflow-x-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 md:px-8 md:py-7">
          {/* Top row: AI Brief (2/3) + Efficiency Score (1/3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {/* AI Brief spans 2 columns */}
            <div className="md:col-span-2">
              <AIMorningBrief />
            </div>

            {/* Efficiency Score */}
            <div className="md:col-span-1">
              <EfficiencyScore />
            </div>
          </div>

          {/* Bottom row: Focus + Habits + Goals (equal thirds) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <TodaysFocus />
            <HabitStreaks />
            <GoalProgress />
          </div>
        </main>
      </div>
    </div>
  );
}
