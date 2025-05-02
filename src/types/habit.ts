
export type HabitCategory = 
  | "fitness"
  | "learning"
  | "wellness"
  | "social"
  | "productivity"
  | "creativity"
  | "programming"
  | "spiritual"
  | "other";

export type HabitFrequency =
  | "daily"
  | "weekly"
  | "custom";

export type Habit = {
  id: string;
  name: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  target?: number; // For weekly habits, target number to complete
  icon?: string;
  createdAt: Date;
  completedDates: Date[];
  streak: number;
  highestStreak: number;
  notes?: string;
};

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  relatedHabitId?: string;
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
