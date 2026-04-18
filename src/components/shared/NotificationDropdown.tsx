"use client";

import { TrashIcon } from "@/constants/Icons";
import { useLebenStore } from "@/store/useStore";
import { useEffect, useRef, useState } from "react";

/** Shows a one-time banner asking the user to enable push. Must be inside a user gesture. */
function PushPermissionBanner() {
  const [permission, setPermission] = useState<NotificationPermission | null>(null);

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }
  }, []);

  if (!permission || permission === "granted" || permission === "denied") return null;

  return (
    <div
      style={{
        margin: "8px 12px",
        padding: "10px 14px",
        borderRadius: "10px",
        background: "rgba(124,106,240,0.08)",
        border: "1px solid rgba(124,106,240,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
      }}
    >
      <p style={{ fontSize: "12px", color: "#aaa", margin: 0, lineHeight: 1.4 }}>
        Enable push notifications to receive reminders in real time.
      </p>
      <button
        onClick={async () => {
          const result = await Notification.requestPermission();
          setPermission(result);
        }}
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#7c6af0",
          background: "rgba(124,106,240,0.15)",
          border: "1px solid rgba(124,106,240,0.3)",
          borderRadius: "6px",
          padding: "5px 10px",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Enable
      </button>
    </div>
  );
}

export default function NotificationDropdown() {
  const notifications = useLebenStore((s) => s.notifications);
  const markAllRead = useLebenStore((s) => s.markAllNotificationsRead);
  const markRead = useLebenStore((s) => s.markNotificationRead);
  const isOpen = useLebenStore((s) => s.isNotificationOpen);
  const setOpen = useLebenStore((s) => s.setNotificationOpen);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl z-[100] border border-[#1e1e1e] overflow-hidden animate-in fade-in slide-in-from-top-2"
      style={{
        backgroundColor: "rgba(10, 10, 10, 0.95)",
        backdropFilter: "blur(12px)",
        top: "100%",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#181818] flex items-center justify-between bg-white/[0.02]">
        <h3 className="text-white font-semibold" style={{ fontSize: "14px" }}>
          Notifications
        </h3>
        <div>
          {notifications.some((n) => !n.read) && (
            <button
              onClick={() => markAllRead()}
              className="text-[#7c6af0] hover:text-[#9081f5] transition-colors"
              style={{ fontSize: "11px", fontWeight: 600 }}
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* ✅ Browser push permission prompt — only shown when not yet granted */}
      <PushPermissionBanner />
      {/* List */}
      <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p style={{ color: "#444", fontSize: "12px" }}>
              No notifications yet
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`px-5 py-4 border-b border-[#131313] last:border-0 cursor-pointer transition-colors hover:bg-white/[0.03] ${
                !n.read ? "bg-[#7c6af0]/[0.02]" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p
                    className="mb-0.5"
                    style={{
                      fontSize: "10px",
                      color: "#7c6af0",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {n.title}
                  </p>
                  <p
                    className={!n.read ? "text-[#e0e0e0]" : "text-[#888]"}
                    style={{ fontSize: "13px", lineHeight: 1.4 }}
                  >
                    {n.body}
                  </p>
                  <p
                    className="mt-1.5"
                    style={{ fontSize: "10px", color: "#333" }}
                  >
                    {new Date(n.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-[#7c6af0] mt-1" />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    useLebenStore.getState().deleteNotification(n.id);
                  }}
                  className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] border border-transparent bg-transparent text-[#444] shrink-0 transition-all duration-150 hover:bg-white/5 hover:text-red-400"
                  aria-label="Delete notification"
                >
                  <TrashIcon className="text-[#fff]" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-5 py-3 bg-white/[0.01] text-center border-t border-[#181818]">
          <p style={{ fontSize: "10px", color: "#333" }}>
            Showing last {notifications.length} notifications
          </p>
        </div>
      )}

      {/* ✅ Standard style tag — styled-jsx doesn't work in Next.js App Router */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #252525; }
      `}</style>
    </div>
  );
}
