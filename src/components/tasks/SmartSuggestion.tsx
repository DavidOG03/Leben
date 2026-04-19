"use client";

import { SparkleIcon } from "@/constants/Icons";
import { useLebenStore } from "@/store/useStore";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Suggestion {
  task: string;
  reason: string;
  action: string;
  priorityScore: number;
}

export default function SmartSuggestion() {
  const tasks = useLebenStore((s) => s.tasks);
  const router = useRouter();

  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [waitCountdown, setWaitCountdown] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [dots, setDots] = useState(".");
  const dotsRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pendingTasks = tasks.filter((t) => !t.completed);
  const hasTasks = pendingTasks.length > 0;

  // Detect auth state
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // Countdown ticker (not used for errors now, but kept for UI consistency if needed)
  useEffect(() => {
    if (waitCountdown !== null && waitCountdown > 0) {
      const timer = setTimeout(() => setWaitCountdown(waitCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (waitCountdown === 0) {
      setWaitCountdown(null);
    }
  }, [waitCountdown]);

  const fetchSuggestion = async () => {
    // Guest guard — redirect to sign in instead of calling AI
    if (!user) {
      router.push("/auth/signin");
      return;
    }
    if (!hasTasks || loading) return;

    setLoading(true);
    setSuggestion(null);
    setWaitCountdown(null);

    dotsRef.current = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 400);

    try {
      const taskList = pendingTasks
        .map((t, i) => `${i + 1}. [Tag: ${t.tag}] ${t.title}`)
        .join("\n");

      const currentTime = new Date().toLocaleTimeString();

      const prompt = `
        You are an elite productivity strategist.
        Current Time: ${currentTime}
        Total Pending Tasks: ${pendingTasks.length}

        Analyze these tasks and pick the ONE that is the most critical/high-priority right now.

        Tasks:
        ${taskList}

        Respond ONLY in JSON, no markdown, no backticks, no extra text.
        "reason" should be a sharp, psychological insight into why this task matters most (max 15 words).
        "action" should be a punchy 2-word verb phrase.

        Schema: {"task":"<exact title>","reason":"<coaching insight>","action":"<CTA>","priorityScore":1-100}
      `;

      const response = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const rawResult: string = data.result;
      const clean = rawResult.replace(/```json|```/g, "").trim();
      const result: Suggestion = JSON.parse(clean);
      setSuggestion(result);
    } catch (err) {
      console.error("AI Error:", err);
      setSuggestion(null);
    } finally {
      if (dotsRef.current) clearInterval(dotsRef.current);
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col justify-between rounded-xl p-4 flex-shrink-0"
      style={{
        width: "100%",
        minHeight: "220px",
        background: "linear-gradient(145deg, #2a2460, #1e1a50)",
        border: "1px solid rgba(124,106,240,0.3)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div>
        <div
          className="flex items-center justify-center rounded-lg mb-3"
          style={{
            width: "30px",
            height: "30px",
            backgroundColor: "rgba(124, 106, 240, 0.2)",
          }}
        >
          <SparkleIcon />
        </div>

        <p
          className="font-medium mb-3 underline decoration-purple-500/30 underline-offset-4"
          style={{
            fontSize: "10px",
            color: "rgba(200,190,255,0.8)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {loading && waitCountdown === null
            ? `Prioritizing${dots}`
            : "Priority Insight"}
        </p>

        {/* Loading skeleton */}
        {loading && waitCountdown === null && (
          <div className="space-y-2 animate-pulse">
            <div
              style={{
                height: "12px",
                borderRadius: "4px",
                backgroundColor: "rgba(255,255,255,0.07)",
                width: "100%",
              }}
            />
            <div
              style={{
                height: "12px",
                borderRadius: "4px",
                backgroundColor: "rgba(255,255,255,0.05)",
                width: "80%",
              }}
            />
            <div
              style={{
                height: "12px",
                borderRadius: "4px",
                backgroundColor: "rgba(255,255,255,0.03)",
                width: "60%",
              }}
            />
          </div>
        )}

        {/* Suggestion result */}
        {!loading && suggestion && (
          <div className="space-y-3">
            <p
              className="font-bold text-white leading-tight"
              style={{ fontSize: "14px" }}
            >
              {suggestion.task}
            </p>
            <div
              className="p-2 rounded-lg"
              style={{
                backgroundColor: "rgba(0,0,0,0.2)",
                borderLeft: "2px solid #7c6af0",
              }}
            >
              <p
                style={{
                  fontWeight: 400,
                  color: "#c4b8ff",
                  fontSize: "11px",
                  lineHeight: "1.4",
                }}
              >
                <span className="opacity-50 italic">Reason: </span>
                {suggestion.reason}
              </p>
            </div>
          </div>
        )}

        {/* Rate-limit countdown */}
        {waitCountdown !== null && waitCountdown > 0 && (
          <div
            className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 animate-pulse mt-2"
            style={{ fontSize: "10px", fontWeight: 600 }}
          >
            Retrying in {waitCountdown}s...
          </div>
        )}

        {/* Idle / guest copy */}
        {!loading && !suggestion && waitCountdown === null && (
          <p
            style={{
              fontSize: "12px",
              color: "rgba(200,190,255,0.4)",
              lineHeight: 1.5,
            }}
          >
            {hasTasks
              ? "Analysis required to find your high-impact task."
              : "No pending tasks found. Add some to get a strategy."}
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="mt-4">
        {suggestion && !loading && user ? (
          <button
            onClick={fetchSuggestion}
            className="w-full flex items-center justify-between group"
            style={{ fontSize: "11px", color: "#a89cf0" }}
          >
            <span className="font-bold group-hover:underline">
              {suggestion.action}
            </span>
            <span className="opacity-40 text-[9px]">Re-analyze</span>
          </button>
        ) : (
          <button
            onClick={fetchSuggestion}
            disabled={(!hasTasks || loading) && !!user}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg py-2.5 font-bold transition-all active:scale-95"
            style={{
              fontSize: "11px",
              letterSpacing: "0.02em",
              backgroundColor:
                hasTasks && !loading && waitCountdown === null
                  ? "#7c6af0"
                  : "rgba(255,255,255,0.04)",
              color:
                hasTasks && !loading && waitCountdown === null
                  ? "#ffffff"
                  : "rgba(200,190,255,0.25)",
              cursor:
                hasTasks && !loading && waitCountdown === null
                  ? "pointer"
                  : "not-allowed",
              boxShadow:
                hasTasks && !loading && waitCountdown === null
                  ? "0 4px 12px rgba(124,106,240,0.3)"
                  : "none",
              border:
                !user && hasTasks ? "1px solid rgba(124,106,240,0.25)" : "none",
            }}
          >
            {waitCountdown !== null
              ? "Waiting bounds..."
              : loading
                ? "Calculating..."
                : "Identify Priority"}
          </button>
        )}
      </div>
    </div>
  );
}
