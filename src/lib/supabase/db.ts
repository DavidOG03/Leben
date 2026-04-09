// lib/supabase/db.ts
// All database read/write operations live here.
// Store actions call these functions - they never call Supabase directly.

import { createClient } from "@/lib/supabase/client";
import type { Task, Habit } from "@/store/useStore";

// We use the browser client because these run in client components
const supabase = createClient();

// ─── Tasks ────────────────────────────────────────────────────────────────────

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchTasks:", error.message);
    return [];
  }
  return data ?? [];
}

export async function insertTask(task: Task): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("tasks").insert({
    ...task,
    user_id: user.id, // attach the logged-in user's ID to every row
  });

  if (error) console.error("insertTask:", error.message);
}

export async function updateTask(
  id: string,
  updates: Partial<Task>,
): Promise<void> {
  const { error } = await supabase.from("tasks").update(updates).eq("id", id);

  if (error) console.error("updateTask:", error.message);
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) console.error("deleteTask:", error.message);
}

// ─── Habits ───────────────────────────────────────────────────────────────────

export async function fetchHabits(): Promise<Habit[]> {
  const { data, error } = await supabase.from("habits").select("*");

  if (error) {
    console.error("fetchHabits:", error.message);
    return [];
  }
  return data ?? [];
}

export async function insertHabit(habit: Habit): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("habits").insert({
    ...habit,
    user_id: user.id,
  });

  if (error) console.error("insertHabit:", error.message);
}

export async function updateHabit(
  id: string,
  updates: Partial<Habit>,
): Promise<void> {
  const { error } = await supabase.from("habits").update(updates).eq("id", id);

  if (error) console.error("updateHabit:", error.message);
}

export async function removeHabit(id: string): Promise<void> {
  const { error } = await supabase.from("habits").delete().eq("id", id);

  if (error) console.error("removeHabit:", error.message);
}

// ─── Goals ────────────────────────────────────────────────────────────────────

// Your Goal type comes from goalSlice - import it from there
export async function fetchGoals(): Promise<object[]> {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchGoals:", error.message);
    return [];
  }
  return data ?? [];
}

export async function insertGoal(goal: object & { id: string }): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("goals").insert({
    ...goal,
    user_id: user.id,
  });

  if (error) console.error("insertGoal:", error.message);
}

export async function updateGoal(id: string, updates: object): Promise<void> {
  const { error } = await supabase.from("goals").update(updates).eq("id", id);

  if (error) console.error("updateGoal:", error.message);
}

export async function deleteGoal(id: string): Promise<void> {
  const { error } = await supabase.from("goals").delete().eq("id", id);

  if (error) console.error("deleteGoal:", error.message);
}

// ─── System / Dangerous Actions ───────────────────────────────────────────────

export async function purgeAllData(): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const tables = ["tasks", "habits", "goals", "books"];
  for (const table of tables) {
    const { error } = await supabase.from(table).delete().eq("user_id", user.id);
    if (error) {
       console.error(`Failed to purge ${table}:`, error.message);
    }
  }
}
