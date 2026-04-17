"use client";

// const focusItems = [
//   { label: "Deep Work: Q3 Vision", time: "10:00 AM – 1:00 PM", accent: true },
//   { label: "Marketing Sync", time: "2:30 PM – 3:15 PM", accent: false },
// ];

export default function AIRightPanel() {
  return (
    <aside
      className="flex flex-col flex-shrink-0 overflow-y-auto"
      style={{
        width: "240px",
        backgroundColor: "#0c0c0c",
        padding: "24px 16px",
      }}
    >
      {/* Today's Focus */}
      <div className="mb-6">
        <p
          className="uppercase tracking-widest mb-4"
          style={{ fontSize: "9px", color: "#3a3a3a", letterSpacing: "0.14em" }}
        >
          Today&apos;s Focus
        </p>
        {/* <div className="space-y-3">
          {focusItems.map((item) => (
            <div
              key={item.label}
              className="px-3 py-3 rounded-xl"
              style={{
                backgroundColor: "#111",
                border: "1px solid #1a1a1a",
                borderLeft: item.accent
                  ? "3px solid #7c6af0"
                  : "3px solid #2a2a2a",
              }}
            >
              <p
                className="font-semibold text-white"
                style={{ fontSize: "13px" }}
              >
                {item.label}
              </p>
              <p style={{ fontSize: "11px", color: "#555", marginTop: "3px" }}>
                {item.time}
              </p>
            </div>
          ))}
        </div> */}
      </div>

      {/* Intelligence Insights visual */}
      {/* <div
        className="rounded-xl overflow-hidden mb-6"
        style={{ border: "1px solid #1a1a1a" }}
      >
        {/* Abstract visual placeholder 
        <div
          className="flex items-center justify-center relative overflow-hidden"
          style={{
            height: "100px",
            background: "linear-gradient(135deg,#0a0a18,#12102a)",
          }}
        >
          {/* Animated Glow
          <div className="absolute inset-0 bg-purple-600/10 animate-pulse" />
        </div>
        <div className="px-4 py-3" style={{ backgroundColor: "#111" }}>
          <p className="font-semibold text-white" style={{ fontSize: "13px" }}>
            Intelligence Insights
          </p>
          <p
            style={{
              fontSize: "11px",
              color: "#666",
              marginTop: "4px",
              lineHeight: 1.5,
            }}
          >
            Your productivity is 14% higher during morning sessions this month.
          </p>
 </div> */}
      {/* Pro upgrade */}
      {/* <div 
        className="mx-4 mt-5 rounded-xl p-4 relative overflow-hidden group transition-all hover:scale-[1.02]" 
        style={{ backgroundColor: "#121220", border: "1px solid #252535" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <p className="font-semibold mb-1" style={{ fontSize: "11px", color: "#7c6af0", letterSpacing: "0.06em", textTransform: "uppercase" }}>Pro Upgrade</p>
        <p style={{ fontSize: "11px", color: "#666", lineHeight: 1.5, marginBottom: "12px" }}>Unlock advanced neural processing for faster insights.</p>
        <button className="w-full py-2 rounded-lg font-semibold transition-all hover:shadow-[0_0_20px_rgba(124,106,240,0.3)] relative z-10" style={{ background: "linear-gradient(135deg,#5a4fd4,#7c6af0)", color: "white", fontSize: "12px" }}>
          Upgrade Now
        </button>
      </div> 
      </div> */}

      {/* System Load */}
      {/* <div className="mt-auto">
        <div className="flex items-center justify-between mb-2">
          <p
            className="uppercase tracking-widest"
            style={{
              fontSize: "9px",
              color: "#3a3a3a",
              letterSpacing: "0.14em",
            }}
          >
            System Load
          </p>
          <span
            className="animate-pulse"
            style={{ fontSize: "10px", color: "#7c6af0", fontWeight: 700 }}
          >
            {Math.random() > 0.5 ? "Optimal" : "Syncing"}
          </span>
        </div>
        <div
          className="rounded-full overflow-hidden"
          style={{ height: "3px", backgroundColor: "#1a1a1a" }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000 ease-in-out"
            style={{
              width: `${30 + Math.random() * 20}%`,
              background: "linear-gradient(90deg,#5a4fd4,#7c6af0)",
            }}
          />
        </div>
      </div> */}
    </aside>
  );
}
