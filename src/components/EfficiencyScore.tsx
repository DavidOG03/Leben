"use client";

export default function EfficiencyScore() {
  return (
    <div
      className="rounded-2xl p-7 flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(145deg, #121212 0%, #0e0e0e 100%)",
        border: "1px solid #1e1e1e",
        minHeight: "260px",
      }}
    >
      <p
        className="uppercase tracking-widest mb-6"
        style={{ fontSize: "10px", color: "#444", letterSpacing: "0.14em" }}
      >
        Efficiency Score
      </p>

      {/* Empty ring */}
      <div className="relative flex items-center justify-center mb-5">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="54" fill="none" stroke="#1a1a1a" strokeWidth="8" />
          <circle
            cx="70" cy="70" r="54" fill="none"
            stroke="#252525" strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="12 8"
            transform="rotate(-90 70 70)"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span style={{ fontSize: "28px", color: "#2e2e2e", letterSpacing: "-0.03em", lineHeight: 1, fontWeight: 700 }}>
            —
          </span>
          <span className="uppercase tracking-widest mt-1" style={{ fontSize: "9px", color: "#2e2e2e", letterSpacing: "0.12em" }}>
            No data
          </span>
        </div>
      </div>

      <p style={{ fontSize: "11px", color: "#333", textAlign: "center", lineHeight: 1.6 }}>
        Score appears after<br />your first active week
      </p>
    </div>
  );
}
