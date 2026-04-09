import TasksHeader from "@/components/activeTasks/TasksHeader";
import TasksViewPanel from "@/components/tasks/TasksViewPanel";
import TasksMainPanel from "@/components/tasks/TasksMainPanel";
import AppSidebar from "@/components/shared/AppSidebar";

export default function TasksPage() {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Left nav sidebar (shared style) */}
      <AppSidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header bar */}
        <TasksHeader />

        {/* Body: views panel + main content */}
        <div className="flex flex-1 overflow-hidden">
          <TasksViewPanel />
          <TasksMainPanel />
        </div>
      </div>
    </div>
  );
}
