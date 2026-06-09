// hooks/useLoadUserData.ts
"use client";

import { useEffect } from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { useLebenStore } from "@/store/useStore";
import {
  fetchTasks,
  fetchHabits,
  fetchGoals,
  fetchBooks,
  fetchProductivityHistory,
} from "@/lib/supabase/db";
import { createClient } from "@/lib/supabase/client";

export function useLoadUserData() {
  const setTasks = useLebenStore((s) => s.setTasks);
  const setHabits = useLebenStore((s) => s.setHabits);
  const setGoals = useLebenStore((s) => s.setGoals);
  const setBooks = useLebenStore((s) => s.setBooks);
  const setProductivityHistory = useLebenStore((s) => s.setProductivityHistory);
  const setIsSyncing = useLebenStore((s) => s.setIsSyncing);

  useEffect(() => {
    const supabase = createClient();

    const loadUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      // If no user and no error (or it's an explicit auth error like invalid token), we might clear.
      // But if it's a network error (Failed to fetch), we should preserve the offline store!
      if (!user) {
        // Only clear if it's not a network error
        if (error?.message !== "Failed to fetch") {
          useLebenStore.getState().clearStore();
        }
        return;
      }

      // Track the user ID associated with this store's data
      useLebenStore.getState().setUserId(user.id);
      
      const fullName = user.user_metadata?.full_name || null;
      const email = user.email || null;
      useLebenStore.getState().setUserDetails(fullName, email);

      try {
        setIsSyncing(true);
        const [tasks, habits, goals, books, history] = await Promise.all([
          fetchTasks(),
          fetchHabits(),
          fetchGoals(),
          fetchBooks(),
          fetchProductivityHistory(),
        ]);

        setTasks(tasks);
        setHabits(habits);
        setGoals(goals);
        setBooks(books);
        setProductivityHistory(history);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsSyncing(false);
      }
    };

    // Listen for auth state changes - this is our primary mechanism
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log(
          `🔄 Auth state changed: ${event}`,
          session?.user?.id || "no user",
        );

        const currentStoreUserId = useLebenStore.getState().userId;

        if (session?.user) {
          // If the user has changed, clear the store first to prevent leakage
          const isUserChanged = session.user.id !== currentStoreUserId;
          if (isUserChanged) {
            useLebenStore.getState().clearStore();
            useLebenStore.getState().setUserId(session.user.id);
            if (typeof window !== "undefined") {
              localStorage.removeItem("leben-storage");
            }
          }

          // Small delay on transition to ensure UI updates before loading new data
          const shouldLoad =
            isUserChanged ||
            event === "SIGNED_IN" ||
            event === "INITIAL_SESSION" ||
            (event === "TOKEN_REFRESHED" && useLebenStore.getState().tasks.length > 0);

          if (shouldLoad) {
            if (isUserChanged) {
              setTimeout(async () => {
                await loadUserData();
              }, 100);
            } else {
              await loadUserData();
            }
          }
        } else {
          // User is signed out or is a guest
          // If the store is populated with a signed-in user's data, clear it!
          if (currentStoreUserId !== null) {
            useLebenStore.getState().clearStore();
            if (typeof window !== "undefined") {
              localStorage.removeItem("leben-storage");
            }
          }
        }
      },
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [setTasks, setHabits, setGoals, setBooks, setIsSyncing]);
}
