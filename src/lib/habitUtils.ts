
import { format, isToday, isSameDay, addDays, parseISO, startOfWeek, subDays } from "date-fns";
import { Achievement, Habit, HabitCategory } from "@/types/habit";

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Check if a habit was completed on a specific date
export function isHabitCompletedOnDate(habit: Habit, date: Date): boolean {
  return habit.completedDates.some(completedDate => 
    isSameDay(completedDate, date)
  );
}

// Check if habit is completed today
export function isHabitCompletedToday(habit: Habit): boolean {
  return isHabitCompletedOnDate(habit, new Date());
}

// Calculate streak for a habit
export function calculateStreak(completedDates: Date[]): number {
  if (completedDates.length === 0) return 0;
  
  // Sort dates in descending order
  const sortedDates = [...completedDates].sort((a, b) => b.getTime() - a.getTime());
  
  // Check if today is completed
  const today = new Date();
  const hasCompletedToday = sortedDates.some(date => isSameDay(date, today));
  
  // If not completed today, check if completed yesterday to maintain streak
  if (!hasCompletedToday) {
    const yesterday = subDays(today, 1);
    const hasCompletedYesterday = sortedDates.some(date => isSameDay(date, yesterday));
    if (!hasCompletedYesterday) {
      return 0; // Streak broken
    }
  }
  
  // Count consecutive days
  let streak = hasCompletedToday ? 1 : 0;
  let currentDate = hasCompletedToday ? subDays(today, 1) : subDays(today, 2);
  
  while (true) {
    const hasCompleted = sortedDates.some(date => isSameDay(date, currentDate));
    if (!hasCompleted) break;
    streak++;
    currentDate = subDays(currentDate, 1);
  }
  
  return streak;
}

// Toggle habit completion for today
export function toggleHabitCompletion(habit: Habit): Habit {
  const today = new Date();
  const isCompleted = isHabitCompletedToday(habit);
  
  let updatedCompletedDates: Date[];
  let updatedStreak: number;
  
  if (isCompleted) {
    // Remove today from completed dates
    updatedCompletedDates = habit.completedDates.filter(date => !isSameDay(date, today));
    updatedStreak = calculateStreak(updatedCompletedDates);
  } else {
    // Add today to completed dates
    updatedCompletedDates = [...habit.completedDates, today];
    updatedStreak = calculateStreak(updatedCompletedDates);
  }
  
  // Update highest streak if current streak is higher
  const highestStreak = Math.max(updatedStreak, habit.highestStreak);
  
  return {
    ...habit,
    completedDates: updatedCompletedDates,
    streak: updatedStreak,
    highestStreak
  };
}

// Get completion rate (percentage) for a habit over the last 30 days
export function getCompletionRate(habit: Habit): number {
  const today = new Date();
  let daysCompleted = 0;
  
  for (let i = 0; i < 30; i++) {
    const checkDate = subDays(today, i);
    if (isHabitCompletedOnDate(habit, checkDate)) {
      daysCompleted++;
    }
  }
  
  return Math.round((daysCompleted / 30) * 100);
}

// Check for unlocked achievements
export function checkForAchievements(
  habits: Habit[], 
  currentAchievements: Achievement[]
): Achievement[] {
  const updatedAchievements = [...currentAchievements];
  
  // Check each achievement
  updatedAchievements.forEach(achievement => {
    if (achievement.unlockedAt) return; // Already unlocked
    
    const { streakCount, habitCategory, habitCount } = achievement.requirements;
    let isUnlocked = true;
    
    // Check streak requirement
    if (streakCount) {
      const hasStreakAchievement = habits.some(habit => habit.streak >= streakCount);
      if (!hasStreakAchievement) isUnlocked = false;
    }
    
    // Check habit category requirement
    if (habitCategory && isUnlocked) {
      const categoryHabits = habits.filter(habit => habit.category === habitCategory);
      if (categoryHabits.length === 0) isUnlocked = false;
    }
    
    // Check habit count requirement
    if (habitCount && isUnlocked) {
      if (habits.length < habitCount) isUnlocked = false;
    }
    
    // Unlock the achievement if requirements are met
    if (isUnlocked) {
      achievement.unlockedAt = new Date();
    }
  });
  
  return updatedAchievements;
}

// Default sample habits
export const defaultHabits: Habit[] = [
  {
    id: generateId(),
    name: "Drink water",
    category: "wellness",
    createdAt: new Date(),
    completedDates: [],
    streak: 0,
    highestStreak: 0
  },
  {
    id: generateId(),
    name: "Read for 30 minutes",
    category: "learning",
    createdAt: new Date(),
    completedDates: [],
    streak: 0,
    highestStreak: 0
  },
  {
    id: generateId(),
    name: "Exercise",
    category: "fitness",
    createdAt: new Date(),
    completedDates: [],
    streak: 0,
    highestStreak: 0
  }
];

// Default achievements
export const defaultAchievements: Achievement[] = [
  {
    id: "streak-3",
    name: "Getting Started",
    description: "Maintain a 3-day streak",
    icon: "award",
    requirements: {
      streakCount: 3
    }
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "award",
    requirements: {
      streakCount: 7
    }
  },
  {
    id: "streak-30",
    name: "Monthly Master",
    description: "Maintain a 30-day streak",
    icon: "badge",
    requirements: {
      streakCount: 30
    }
  },
  {
    id: "fitness-habit",
    name: "Fitness Fanatic",
    description: "Create a fitness habit",
    icon: "activity",
    requirements: {
      habitCategory: "fitness"
    }
  },
  {
    id: "habits-5",
    name: "Habit Collector",
    description: "Create 5 habits",
    icon: "list-check",
    requirements: {
      habitCount: 5
    }
  }
];

export const categoryColors: Record<HabitCategory, string> = {
  fitness: "category-fitness",
  learning: "category-learning",
  wellness: "category-wellness",
  social: "category-social",
  productivity: "category-productivity",
  creativity: "category-creativity",
  other: "category-other"
};

export const categoryIcons: Record<HabitCategory, string> = {
  fitness: "activity",
  learning: "book",
  wellness: "heart",
  social: "users",
  productivity: "check-square",
  creativity: "pen-tool",
  other: "circle"
};
