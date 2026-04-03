"use client";

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const BellIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path d="M8.5 2a4.5 4.5 0 00-4.5 4.5v2.8L2.5 11h12l-1.5-1.7V6.5A4.5 4.5 0 008.5 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M6.5 13a2 2 0 004 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path d="M8.5 2l1.5 4.5L14.5 8l-4.5 1.5L8.5 14l-1.5-4.5L2.5 8l4.5-1.5L8.5 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

export default function TasksHeader() {
  return (
    <header
      className="flex items-center justify-between px-6 flex-shrink-0"
      style={{
        height: "56px",
        backgroundColor: "#0a0a0a",
        borderBottom: "1px solid #161616",
      }}
    >
      {/* Search bar — centred in design */}
      <div className="flex-1 flex justify-center">
        <div
          className="flex items-center gap-2.5 px-4 py-2 rounded-lg"
          style={{
            backgroundColor: "#131313",
            border: "1px solid #1e1e1e",
            width: "340px",
          }}
        >
          <span style={{ color: "#3a3a3a" }}>
            <SearchIcon />
          </span>
          <span style={{ fontSize: "12px", color: "#3a3a3a" }}>
            Search tasks, habits, or files...
          </span>
        </div>
      </div>

      {/* Right icons + wordmark */}
      <div className="flex items-center gap-3">
        <button
          className="flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
          style={{ width: "32px", height: "32px", color: "#555" }}
        >
          <BellIcon />
        </button>
        <button
          className="flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
          style={{ width: "32px", height: "32px", color: "#555" }}
        >
          <SparkleIcon />
        </button>
        <span
          className="font-bold tracking-widest"
          style={{ fontSize: "11px", color: "#333", letterSpacing: "0.18em", marginLeft: "4px" }}
        >
          LEBEN
        </span>
      </div>
    </header>
  );
}
