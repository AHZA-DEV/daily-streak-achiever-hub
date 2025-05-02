
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
    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
      <div 
        className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full"
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

  // Convert category key to display name in Indonesian
  const getCategoryName = (key: string): string => {
    const categoryNames: Record<string, string> = {
      "fitness": "Kebugaran",
      "learning": "Pembelajaran",
      "wellness": "Kesehatan",
      "social": "Sosial",
      "productivity": "Produktivitas",
      "creativity": "Kreativitas",
      "programming": "Pemrograman",
      "spiritual": "Spiritual",
      "other": "Lainnya"
    };
    
    return categoryNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <div className="min-h-screen bg-tech-grid bg-tech-dark pb-20 md:pb-0 md:pt-20">
      <NavBar />
      
      <div className="container max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text mb-8">Wawasan</h1>
        
        <div className="grid gap-6">
          {/* Overall insights card */}
          <InsightsCard habits={habits} />
          
          {/* Habits by category */}
          {Object.keys(habitsByCategory).length > 0 ? (
            <Card className="p-6 tech-card">
              <h3 className="text-lg font-medium mb-4 text-white">Kebiasaan berdasarkan Kategori</h3>
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
                          <span className="text-sm font-medium text-gray-200">{getCategoryName(category)} ({categoryHabits.length})</span>
                        </div>
                        <span className="text-sm text-gray-400">{avgCompletionRate}%</span>
                      </div>
                      {renderProgressBar(avgCompletionRate)}
                    </div>
                  );
                })}
              </div>
            </Card>
          ) : (
            <Card className="p-6 tech-card text-center">
              <p className="text-gray-400">Belum ada data kebiasaan untuk dianalisis</p>
            </Card>
          )}
          
          {/* Streaks Leaderboard */}
          {habits.length > 0 && (
            <Card className="p-6 tech-card">
              <h3 className="text-lg font-medium mb-4 text-white">Rentetan Kebiasaan</h3>
              <div className="space-y-2">
                {[...habits]
                  .sort((a, b) => b.streak - a.streak)
                  .slice(0, 5)
                  .map((habit) => (
                    <div key={habit.id} className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-300">{habit.name}</span>
                      <span 
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          habit.streak > 0 
                            ? "bg-gradient-to-r from-purple-900/50 to-indigo-900/50 text-purple-300 border border-purple-500/20" 
                            : "bg-gray-800 text-gray-500"
                        }`}
                      >
                        {habit.streak} hari{habit.streak !== 1 ? '' : ''}
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
