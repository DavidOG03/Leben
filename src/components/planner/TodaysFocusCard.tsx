"use client";

interface FocusItem {
  title: string;
  reason: string;
}

interface TodaysFocusCardProps {
  focusItems: FocusItem[];
}

export function TodaysFocusCard({ focusItems }: TodaysFocusCardProps) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{
        background: "linear-gradient(145deg, #111111 0%, #0d0d0d 100%)",
        border: "1px solid #1e1e1e",
      }}
    >
      <h3 className="text-white font-semibold" style={{ fontSize: "14px" }}>
        Today&apos;s Focus
      </h3>

      <div className="space-y-4">
        {focusItems.length === 0 ? (
          <p className="text-[#444]" style={{ fontSize: "12px" }}>No high-priority focus set.</p>
        ) : (
          focusItems.map((item, i) => (
            <div key={i} className="flex gap-4 group">
              <div
                className="flex-shrink-0 flex items-center justify-center font-bold"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  backgroundColor: "#161616",
                  border: "1px solid #222",
                  color: "#444",
                  fontSize: "12px",
                }}
              >
                0{i + 1}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white font-medium" style={{ fontSize: "13px" }}>
                  {item.title}
                </span>
                <span className="uppercase" style={{ fontSize: "9px", color: "#444", letterSpacing: "0.08em" }}>
                  {item.reason}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
