"use client";

import { SparkleIcon } from "@/constants/Icons";

interface LimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LimitModal({ isOpen, onClose }: LimitModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(8px)" }}
    >
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-3xl p-8"
        style={{
          background: "linear-gradient(145deg, #1a1a2e 0%, #11111d 100%)",
          border: "1px solid #2d2d45",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}
      >
        {/* Background Glow */}
        <div 
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-20"
          style={{ background: "#7c6af0", filter: "blur(60px)" }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div 
            className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ 
              background: "rgba(124, 106, 240, 0.1)", 
              border: "1px solid rgba(124, 106, 240, 0.3)" 
            }}
          >
            <div style={{ transform: "scale(2)" }}>
              <SparkleIcon color="#7c6af0" />
            </div>
          </div>

          <h2 className="mb-2 text-2xl font-bold text-white">Quota Reached</h2>
          <p className="mb-8 text-sm leading-relaxed text-gray-400">
            You&apos;ve reached your daily AI token limit for **Leben**. 
            To keep the platform sustainable, we limit usage to 25,000 tokens per day per user. 
            Don&apos;t worry—your quota resets at midnight!
          </p>

          <button
            onClick={onClose}
            className="w-full rounded-xl py-3.5 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #7c6af0, #5a4fd4)",
              color: "white",
              boxShadow: "0 10px 20px -10px rgba(124, 106, 240, 0.4)"
            }}
          >
            Got it, see you tomorrow
          </button>
          
          <button 
            onClick={onClose}
            className="mt-4 text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors"
          >
            NOT NOW
          </button>
        </div>
      </div>
    </div>
  );
}
