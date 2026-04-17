"use client";

import { useLebenStore } from "@/store/useStore";
import { BellIcon } from "@/constants/Icons";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {
  const notifications = useLebenStore((s) => s.notifications);
  const isOpen = useLebenStore((s) => s.isNotificationOpen);
  const setOpen = useLebenStore((s) => s.setNotificationOpen);
  
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors relative"
        style={{ width: "32px", height: "32px", color: "#555" }}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!isOpen);
        }}
      >
        <BellIcon />
        
        {/* Red Dot Sign */}
        {unreadCount > 0 && (
          <span 
            className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#e85555] rounded-full border border-[#0a0a0a]"
            style={{ 
              boxShadow: "0 0 10px rgba(232, 85, 85, 0.4)" 
            }}
          />
        )}
      </button>

      {/* Absolutely positioned dropdown */}
      <NotificationDropdown />
    </div>
  );
}
