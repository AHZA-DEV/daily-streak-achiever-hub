
import { useState, useEffect } from "react";
import { Habit, Achievement } from "@/types/habit";
import HabitList from "@/components/HabitList";
import NavBar from "@/components/NavBar";
import NewHabitDialog from "@/components/NewHabitDialog";
import { toggleHabitCompletion, defaultHabits, defaultAchievements, checkForAchievements } from "@/lib/habitUtils";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const { toast } = useToast();

  // Initialize with default data
  useEffect(() => {
    // Check for existing data in localStorage
    const savedHabits = localStorage.getItem("habits");
    const savedAchievements = localStorage.getItem("achievements");
    
    if (savedHabits) {
      const parsedHabits = JSON.parse(savedHabits);
      // Convert date strings back to Date objects
      const hydratedHabits = parsedHabits.map((habit: any) => ({
        ...habit,
        createdAt: new Date(habit.createdAt),
        completedDates: habit.completedDates.map((date: string) => new Date(date))
      }));
      setHabits(hydratedHabits);
    } else {
      setHabits(defaultHabits);
    }
    
    if (savedAchievements) {
      const parsedAchievements = JSON.parse(savedAchievements);
      // Convert date strings back to Date objects
      const hydratedAchievements = parsedAchievements.map((achievement: any) => ({
        ...achievement,
        unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined
      }));
      setAchievements(hydratedAchievements);
    } else {
      setAchievements(defaultAchievements);
    }
  }, []);
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem("habits", JSON.stringify(habits));
    }
  }, [habits]);
  
  useEffect(() => {
    if (achievements.length > 0) {
      localStorage.setItem("achievements", JSON.stringify(achievements));
    }
  }, [achievements]);

  // Check for newly unlocked achievements whenever habits change
  useEffect(() => {
    if (habits.length > 0 && achievements.length > 0) {
      const updatedAchievements = checkForAchievements(habits, achievements);
      
      // Find newly unlocked achievements
      const newlyUnlocked = updatedAchievements.filter(
        (achievement, index) => 
          achievement.unlockedAt && 
          (!achievements[index].unlockedAt || 
           achievement.unlockedAt > achievements[index].unlockedAt!)
      );
      
      // Show toast for each newly unlocked achievement
      newlyUnlocked.forEach(achievement => {
        toast({
          title: "Achievement Unlocked! 🎉",
          description: achievement.name + ": " + achievement.description,
        });
      });
      
      if (newlyUnlocked.length > 0) {
        setAchievements(updatedAchievements);
      }
    }
  }, [habits, achievements, toast]);

  const handleToggleHabit = (habit: Habit) => {
    setHabits(prevHabits => 
      prevHabits.map(h => h.id === habit.id ? toggleHabitCompletion(h) : h)
    );
  };
  
  const handleAddHabit = (habit: Habit) => {
    setHabits(prevHabits => [...prevHabits, habit]);
    toast({
      title: "Habit created",
      description: `${habit.name} has been added to your habits.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:pt-20">
      <NavBar />
      
      <div className="container max-w-4xl px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Today</h1>
            <p className="text-gray-500">{format(new Date(), "EEEE, MMMM d")}</p>
          </div>
          <NewHabitDialog onAddHabit={handleAddHabit} />
        </div>
        
        <HabitList habits={habits} onToggle={handleToggleHabit} />
      </div>
    </div>
  );
};

export default Index;
