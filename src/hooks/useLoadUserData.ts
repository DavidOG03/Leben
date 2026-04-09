// hooks/useLoadUserData.ts
"use client";

import { useEffect } from "react";
import { useLebenStore } from "@/store/useStore";
import { fetchTasks, fetchHabits, fetchGoals } from "@/lib/supabase/db";
import { createClient } from "@/lib/supabase/client";

export function useLoadUserData() {
  const setTasks = useLebenStore((s) => s.setTasks); // add these setters to your store
  const setHabits = useLebenStore((s) => s.setHabits);
  const setGoals = useLebenStore((s) => s.setGoals);

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch all three in parallel - faster than sequential awaits
      const [tasks, habits, goals] = await Promise.all([
        fetchTasks(),
        fetchHabits(),
        fetchGoals(),
      ]);

      setTasks(tasks);
      setHabits(habits as any);
      setGoals(goals as any);
    };

    load();
  }, []);
}
