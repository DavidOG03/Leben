// hooks/useLoadUserData.ts
"use client";

import { useEffect } from "react";
import { useLebenStore } from "@/store/useStore";
import {
  fetchTasks,
  fetchHabits,
  fetchGoals,
  fetchBooks,
} from "@/lib/supabase/db";
import { createClient } from "@/lib/supabase/client";

export function useLoadUserData() {
  const setTasks = useLebenStore((s) => s.setTasks);
  const setHabits = useLebenStore((s) => s.setHabits);
  const setGoals = useLebenStore((s) => s.setGoals);
  const setBooks = useLebenStore((s) => s.setBooks);
  const setIsSyncing = useLebenStore((s) => s.setIsSyncing);

  useEffect(() => {
    const supabase = createClient();

    const loadUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        useLebenStore.getState().clearStore();
        return;
      }

      try {
        setIsSyncing(true);
        const [tasks, habits, goals, books] = await Promise.all([
          fetchTasks(),
          fetchHabits(),
          fetchGoals(),
          fetchBooks(),
        ]);

        setTasks(tasks);
        setHabits(habits);
        setGoals(goals);
        setBooks(books);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsSyncing(false);
      }
    };

    // Listen for auth state changes - this is our primary mechanism
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        `🔄 Auth state changed: ${event}`,
        session?.user?.id || "no user",
      );

      if (
        (event === "SIGNED_IN" || event === "INITIAL_SESSION") &&
        session?.user
      ) {
        // User is signed in - immediately clear any cached data and show loading state
        useLebenStore.getState().clearStore();

        // Force clear localStorage for this store to prevent stale data
        if (typeof window !== "undefined") {
          localStorage.removeItem("leben-storage");
        }

        // Small delay to ensure UI updates before loading new data
        setTimeout(async () => {
          await loadUserData();
        }, 100);
      } else if (event === "SIGNED_OUT") {
        // User signed out - clear everything
        useLebenStore.getState().clearStore();

        // Also clear localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("leben-storage");
        }
      } else if (event === "TOKEN_REFRESHED") {
        // Token was refreshed, might need to reload data
        const currentUser = useLebenStore.getState().tasks.length > 0; // Simple check if we have data
        if (currentUser) {
          await loadUserData();
        }
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [setTasks, setHabits, setGoals, setBooks, setIsSyncing]);
}
