"use client";

import { useState } from "react";
import { SparkleIcon } from "@/constants/Icons";

interface ReminderPickerProps {
  initialValue?: string; // ISO string
  onSave: (isoDate: string | undefined) => void;
  onClose: () => void;
}

export default function ReminderPicker({
  initialValue,
  onSave,
  onClose,
}: ReminderPickerProps) {
  const [date, setDate] = useState(
    initialValue
      ? initialValue.split("T")[0]
      : new Date().toISOString().split("T")[0],
  );
  const [time, setTime] = useState(
    initialValue ? initialValue.split("T")[1].slice(0, 5) : "09:00",
  );

  const handleSave = () => {
    if (!date || !time) {
      onSave(undefined);
      return;
    }
    const isoString = new Date(`${date}T${time}`).toISOString();
    onSave(isoString);
  };

  const handleClear = () => {
    onSave(undefined);
  };

  return (
    <div
      className="p-4 rounded-xl z-100"
      style={{ backgroundColor: "#111", border: "1px solid #222" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <SparkleIcon />
        <span className="text-white font-bold" style={{ fontSize: "14px" }}>
          Set Reminder
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-4">
        <div className="flex flex-col gap-1.5">
          <label
            style={{
              fontSize: "10px",
              color: "#666",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white outline-none focus:border-[#7c6af0] transition-colors"
            style={{ fontSize: "13px" }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            style={{
              fontSize: "10px",
              color: "#666",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white outline-none focus:border-[#7c6af0] transition-colors"
            style={{ fontSize: "13px" }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mt-5">
        <button
          onClick={handleClear}
          className="px-4 py-2 rounded-lg text-[#555] hover:text-white transition-colors"
          style={{ fontSize: "12px" }}
        >
          Remove
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[#555] hover:text-white transition-colors"
            style={{ fontSize: "12px" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg font-bold transition-all active:scale-95"
            style={{
              backgroundColor: "#7c6af0",
              color: "#fff",
              fontSize: "12px",
              boxShadow: "0 4px 12px rgba(124,106,240,0.3)",
            }}
          >
            Save Reminder
          </button>
        </div>
      </div>
    </div>
  );
}
