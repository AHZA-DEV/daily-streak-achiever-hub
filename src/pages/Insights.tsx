
import { useState, useEffect } from "react";
import { Habit, HabitCategory } from "@/types/habit";
import NavBar from "@/components/NavBar";
import InsightsCard from "@/components/InsightsCard";
import { Card } from "@/components/ui/card";
import { getCompletionRate, categoryColors } from "@/lib/habitUtils";

const Insights = () => {
  const [habits, setHabits] = useState<Habit[]>([]);

  // Load habits from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem("habits");
    
    if (savedHabits) {
      const parsedHabits = JSON.parse(savedHabits);
      // Convert date strings back to Date objects
      const hydratedHabits = parsedHabits.map((habit: any) => ({
        ...habit,
        createdAt: new Date(habit.createdAt),
        completedDates: habit.completedDates.map((date: string) => new Date(date))
      }));
      setHabits(hydratedHabits);
    }
  }, []);

  // Function to render a mini progress bar
  const renderProgressBar = (percentage: number) => (
    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
      <div 
        className="bg-habito-purple h-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );

  // Group habits by category
  const habitsByCategory = habits.reduce<Record<HabitCategory, Habit[]>>((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = [];
    }
    acc[habit.category].push(habit);
    return acc;
  }, {} as Record<HabitCategory, Habit[]>);

  // Convert category key to display name
  const getCategoryName = (key: string): string => {
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:pt-20">
      <NavBar />
      
      <div className="container max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Insights</h1>
        
        <div className="grid gap-6">
          {/* Overall insights card */}
          <InsightsCard habits={habits} />
          
          {/* Habits by category */}
          {Object.keys(habitsByCategory).length > 0 ? (
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Habits by Category</h3>
              <div className="space-y-4">
                {Object.entries(habitsByCategory).map(([category, categoryHabits]) => {
                  const avgCompletionRate = Math.round(
                    categoryHabits.reduce((sum, habit) => sum + getCompletionRate(habit), 0) / 
                    categoryHabits.length
                  );
                  
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`w-3 h-3 rounded-full ${categoryColors[category as HabitCategory]} mr-2`}></span>
                          <span className="text-sm font-medium">{getCategoryName(category)} ({categoryHabits.length})</span>
                        </div>
                        <span className="text-sm text-gray-500">{avgCompletionRate}%</span>
                      </div>
                      {renderProgressBar(avgCompletionRate)}
                    </div>
                  );
                })}
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-500">No habit data to analyze</p>
            </Card>
          )}
          
          {/* Streaks Leaderboard */}
          {habits.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Habit Streaks</h3>
              <div className="space-y-2">
                {[...habits]
                  .sort((a, b) => b.streak - a.streak)
                  .slice(0, 5)
                  .map((habit) => (
                    <div key={habit.id} className="flex items-center justify-between py-2">
                      <span className="text-sm">{habit.name}</span>
                      <span 
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          habit.streak > 0 ? "bg-habito-purple-light text-habito-purple-dark" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {habit.streak} day{habit.streak !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))
                }
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Insights;
