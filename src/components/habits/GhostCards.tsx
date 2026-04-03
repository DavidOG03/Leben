"use client";

/* ── Ghost Skeleton Cards ──────────────────────────── */
export function GhostCard({ opacity }: { opacity: number }) {
  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: "#111", border: "1px solid #1a1a1a", opacity }}>
      <div className="flex items-start justify-between mb-4">
        <div className="rounded-xl" style={{ width: "42px", height: "42px", backgroundColor: "#1a1a1a" }} />
        <div className="rounded-lg" style={{ width: "42px", height: "24px", backgroundColor: "#1a1a1a" }} />
      </div>
      <div className="rounded mb-2" style={{ width: "70%", height: "12px", backgroundColor: "#1a1a1a" }} />
      <div className="rounded mb-4" style={{ width: "50%", height: "9px", backgroundColor: "#161616" }} />
      <div className="flex items-center justify-between">
        <div className="rounded" style={{ width: "55px", height: "9px", backgroundColor: "#161616" }} />
        <div className="rounded-full" style={{ width: "30px", height: "30px", backgroundColor: "#1a1a1a" }} />
      </div>
    </div>
  );
}

export function GhostBookCard({ opacity }: { opacity: number }) {
  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: "#111", border: "1px solid #1a1a1a", opacity }}>
      <div className="flex items-start justify-between mb-4">
        <div className="rounded-xl" style={{ width: "44px", height: "44px", backgroundColor: "#1a1a1a" }} />
        <div className="rounded" style={{ width: "16px", height: "16px", backgroundColor: "#1a1a1a" }} />
      </div>
      <div className="rounded mb-1.5" style={{ width: "75%", height: "12px", backgroundColor: "#1a1a1a" }} />
      <div className="rounded mb-4" style={{ width: "45%", height: "9px", backgroundColor: "#161616" }} />
      <div className="rounded-full mb-2" style={{ width: "100%", height: "4px", backgroundColor: "#1a1a1a" }} />
      <div className="flex justify-between mb-4">
        <div className="rounded" style={{ width: "60px", height: "9px", backgroundColor: "#161616" }} />
        <div className="rounded" style={{ width: "28px", height: "9px", backgroundColor: "#161616" }} />
      </div>
      <div className="rounded-lg" style={{ width: "100%", height: "32px", backgroundColor: "#1a1a1a" }} />
    </div>
  );
}
