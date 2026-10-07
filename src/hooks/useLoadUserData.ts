// hooks/useLoadUserData.ts
"use client";

import { useEffect } from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { useLebenStore } from "@/store/useStore";
import { createClient } from "@/lib/supabase/client";

export function useLoadUserData() {
  useEffect(() => {
    const supabase = createClient();

    const loadUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      // If no user and no error (or it's an explicit auth error like invalid token), clear.
      // But if it's a network error (Failed to fetch), preserve the offline store!
      if (!user) {
        if (error?.message !== "Failed to fetch") {
          useLebenStore.getState().clearStore();
        }
        return;
      }

      // Set user in store
      const fullName = user.user_metadata?.full_name || null;
      const email = user.email || null;
      useLebenStore.getState().setUser(user.id, email, fullName);

      try {
        useLebenStore.getState().setIsSyncing(true);

        // Use the store's load methods — they guard against double-fetching
        // and merge local (persisted) state with cloud data
        const store = useLebenStore.getState();
        await Promise.all([
          store.loadTasks(),
          store.loadHabits(),
          store.loadGoals(),
          store.loadBooks(),
          store.loadHistory(),
        ]);

        // Replay any queued offline mutations now that we're connected
        await useLebenStore.getState().processOfflineQueue();
      } catch (err) {
        console.error("Failed to load user data:", err);
      } finally {
        useLebenStore.getState().setIsSyncing(false);
      }
    };

    // Listen for auth state changes — this is our primary mechanism
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        const currentStoreUserId = useLebenStore.getState().userId;

        if (session?.user) {
          // If the user has changed, clear the store first to prevent data leakage
          const isUserChanged = session.user.id !== currentStoreUserId;
          if (isUserChanged) {
            useLebenStore.getState().clearStore();
            useLebenStore.getState().setUser(session.user.id, null);
            if (typeof window !== "undefined") {
              localStorage.removeItem("leben-storage");
            }
          }

          const shouldLoad =
            isUserChanged ||
            event === "SIGNED_IN" ||
            event === "INITIAL_SESSION" ||
            (event === "TOKEN_REFRESHED" &&
              useLebenStore.getState().tasks.length > 0);

          if (shouldLoad) {
            if (isUserChanged) {
              // Small delay on user switch to let UI settle before loading new data
              setTimeout(async () => {
                await loadUserData();
              }, 100);
            } else {
              await loadUserData();
            }
          }
        } else {
          // User is signed out or is a guest
          if (currentStoreUserId !== null) {
            useLebenStore.getState().clearStore();
            if (typeof window !== "undefined") {
              localStorage.removeItem("leben-storage");
            }
          }
        }
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []); // empty deps — supabase client is stable, store accessed via getState()
}
