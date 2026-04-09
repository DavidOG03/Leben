import AppSidebar from "@/components/shared/AppSidebar";
import SettingsHeader from "@/components/settings/SettingsHeader";
import SettingsContent from "@/components/settings/SettingsContent";

export default function SettingsPage() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SettingsHeader />
        <SettingsContent />
      </div>
    </div>
  );
}
