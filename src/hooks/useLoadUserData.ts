// hooks/useLoadUserData.ts
"use client";

import { useEffect } from "react";
import { useLebenStore } from "@/store/useStore";
import { fetchTasks, fetchHabits, fetchGoals, fetchBooks } from "@/lib/supabase/db";
import { createClient } from "@/lib/supabase/client";

export function useLoadUserData() {
  const setTasks = useLebenStore((s) => s.setTasks);
  const setHabits = useLebenStore((s) => s.setHabits);
  const setGoals = useLebenStore((s) => s.setGoals);

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [tasks, habits, goals, books] = await Promise.all([
        fetchTasks(),
        fetchHabits(),
        fetchGoals(),
        fetchBooks(),
      ]);

      setTasks(tasks);
      setHabits(habits);
      setGoals(goals);
      useLebenStore.setState({ books });
    };

    load();
  }, [setTasks, setHabits, setGoals]);
}
