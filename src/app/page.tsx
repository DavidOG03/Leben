import Sidebar from "@/components/Sidebar";
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
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Sidebar */}
      <AppSidebar/>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content area */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ padding: "28px 32px" }}
        >
          {/* Top row: AI Brief (2/3) + Efficiency Score (1/3) */}
          <div
            className="grid gap-5 mb-5"
            style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
          >
            {/* AI Brief spans 2 columns */}
            <div style={{ gridColumn: "1 / 3" }}>
              <AIMorningBrief />
            </div>

            {/* Efficiency Score */}
            <div style={{ gridColumn: "3 / 4" }}>
              <EfficiencyScore />
            </div>
          </div>

          {/* Bottom row: Focus + Habits + Goals (equal thirds) */}
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
          >
            <TodaysFocus />
            <HabitStreaks />
            <GoalProgress />
          </div>
        </main>
      </div>
    </div>
  );
}
