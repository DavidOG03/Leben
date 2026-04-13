"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface UsageData {
  used: number;
  limit: number;
  remaining: number;
  percentage: number;
}

export default function AITokenUsage() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsage() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/ai/usage");
        if (res.status === 401) return; // Silently handle
        if (res.ok) {
          const data = await res.json();
          setUsage(data);
        }
      } catch (err) {
        console.error("Failed to fetch AI usage:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsage();
    // Refresh usage every 5 minutes or when the component mounts
    const interval = setInterval(fetchUsage, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;
  if (!usage) return null;

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        <span 
          style={{ 
            fontSize: "10px", 
            color: usage.percentage > 90 ? "#f87171" : "#888",
            fontWeight: 500
          }}
        >
          {usage.remaining.toLocaleString()} TOKENS LEFT
        </span>
        <div 
          style={{ 
            width: "48px", 
            height: "4px", 
            background: "rgba(255,255,255,0.05)", 
            borderRadius: "2px",
            overflow: "hidden"
          }}
        >
          <div 
            style={{ 
              width: `${100 - usage.percentage}%`, 
              height: "100%", 
              background: usage.percentage > 90 
                ? "linear-gradient(90deg, #ef4444, #f87171)" 
                : "linear-gradient(90deg, #7c6af0, #a78bfa)",
              transition: "width 0.5s ease"
            }} 
          />
        </div>
      </div>
    </div>
  );
}
