"use client";

import { BellIcon, SearchIcon, SparkleIcon } from "@/constants/Icons";
import { useRouter } from "next/navigation";

export default function TasksHeader() {
  const router = useRouter();
  return (
    <header
      className="flex items-center justify-end px-6 flex-shrink-0"
      style={{
        height: "56px",
        backgroundColor: "#0a0a0a",
        borderBottom: "1px solid #161616",
      }}
    >
      {/* Search bar — centred in design */}
      {/* <div className="flex-1 flex justify-center">
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
      </div> */}

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
          onClick={() => router.push("/planner")}
        >
          <SparkleIcon />
        </button>
        <span
          className="font-bold tracking-widest"
          style={{
            fontSize: "11px",
            color: "#333",
            letterSpacing: "0.18em",
            marginLeft: "4px",
          }}
        >
          LEBEN
        </span>
      </div>
    </header>
  );
}
