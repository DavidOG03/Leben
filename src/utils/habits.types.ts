import { Book, BookFormData } from "@/store/bookSlice";

export interface HabitCard {
  id: string;
  label: string;
  sub: string;
  streak: number;
  longestStreak: number;
  color: string;
  icon: string;
  checked: boolean;
  history: string[];
}

export type { Book } from "@/store/bookSlice";

export interface DailyRitualProps {
  setShowAddHabit: (show: boolean) => void;
  habits: HabitCard[];
  onSelectedHabitId: (id: string | null) => void;
  activeHabit: HabitCard | null;
  toggleHabit: (id: string) => void;
}

export interface WeeklyProgressProps {
  habits: HabitCard[];
}

export interface ReadingTrackerProps {
  onShowAddBook: (show: boolean) => void;
  books: Book[];
}

export interface ConsistencyScoreProps {
  habits: HabitCard[];
  consistencyScore: number;
  checkedCount: number;
  books: BookFormData;
}
