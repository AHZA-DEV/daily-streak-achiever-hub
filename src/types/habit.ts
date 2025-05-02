
export type HabitCategory = 
  | "fitness"
  | "learning"
  | "wellness"
  | "social"
  | "productivity"
  | "creativity"
  | "other";

export type Habit = {
  id: string;
  name: string;
  category: HabitCategory;
  icon?: string;
  createdAt: Date;
  completedDates: Date[];
  streak: number;
  highestStreak: number;
  notes?: string;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  requirements: {
    streakCount?: number;
    habitCategory?: HabitCategory;
    habitCount?: number;
  };
};
