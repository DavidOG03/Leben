import AppSidebar from "@/components/shared/AppSidebar";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import AnalyticsContent from "@/components/analytics/AnalyticsContent";

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AnalyticsHeader />
        <AnalyticsContent />
      </div>
    </div>
  );
}
