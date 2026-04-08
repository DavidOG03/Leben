"use client";

import { BellIcon, GearIcon, SearchIcon } from "../constants/Icons";

interface HeaderProps {
  title?: React.ReactNode;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  return (
    <header
      className="flex items-center justify-between px-8 py-5"
      style={{
        borderBottom: "1px solid #1a1a1a",
        backgroundColor: "#0a0a0a",
        height: "72px",
      }}
    >
      {/* Left: Greeting or Custom Title */}
      <div>
        {title ? (
          <div className="flex flex-col">
            <h1
              className="text-white font-semibold"
              style={{
                fontSize: "18px",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="uppercase tracking-widest mt-0.5"
                style={{
                  fontSize: "9px",
                  color: "#555555",
                  letterSpacing: "0.12em",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        ) : (
          <>
            <h1
              className="text-white font-semibold"
              style={{
                fontSize: "20px",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              {getGreeting()}, David
            </h1>
            <p
              className="uppercase tracking-widest mt-0.5"
              style={{
                fontSize: "10px",
                color: "#555555",
                letterSpacing: "0.12em",
              }}
            >
              Tuesday, Oct 24
            </p>
          </>
        )}
      </div>

      {/* Right: Search + icons */}
      <div className="flex items-center gap-4">
        {/* Search bar */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{
            backgroundColor: "#151515",
            border: "1px solid #222222",
            width: "200px",
          }}
        >
          <span style={{ color: "#444444" }}>
            <SearchIcon />
          </span>
          <span style={{ fontSize: "13px", color: "#444444" }}>
            Search tasks...
          </span>
        </div>

        {/* Icon buttons */}
        <button
          className="flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
          style={{ width: "36px", height: "36px", color: "#666666" }}
        >
          <BellIcon />
        </button>
        <button
          className="flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
          style={{ width: "36px", height: "36px", color: "#666666" }}
        >
          <GearIcon />
        </button>

        {/* Avatar */}
        <div
          className="rounded-full flex items-center justify-center overflow-hidden"
          style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg, #3a3a4a, #1e1e2e)",
            border: "1.5px solid #333",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="8" r="4" fill="#888" />
            <path d="M3 20c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#888" />
          </svg>
        </div>
      </div>
    </header>
  );
}
