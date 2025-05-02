
import { Card } from "@/components/ui/card";
import { Habit } from "@/types/habit";
import { getCompletionRate } from "@/lib/habitUtils";
import { Progress } from "@/components/ui/progress";

interface InsightsCardProps {
  habits: Habit[];
}

const InsightsCard = ({ habits }: InsightsCardProps) => {
  if (habits.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-2">No habits to analyze</h3>
        <p className="text-sm text-gray-500">Create and track habits to see insights</p>
      </Card>
    );
  }

  // Calculate total habits completed today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completedToday = habits.filter(habit => 
    habit.completedDates.some(date => {
      const completedDate = new Date(date);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    })
  ).length;
  
  // Calculate completion percentage
  const completionPercentage = habits.length > 0 
    ? Math.round((completedToday / habits.length) * 100) 
    : 0;
  
  // Find longest current streak
  const longestCurrentStreak = Math.max(...habits.map(habit => habit.streak));
  
  // Find highest ever streak
  const highestEverStreak = Math.max(...habits.map(habit => habit.highestStreak));
  
  // Calculate average completion rate over last 30 days
  const avgCompletionRate = habits.length > 0
    ? Math.round(habits.reduce((sum, habit) => sum + getCompletionRate(habit), 0) / habits.length)
    : 0;
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Today's Progress</h3>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">{completedToday} of {habits.length} completed</span>
          <span className="font-medium">{completionPercentage}%</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-habito-purple-light rounded-lg p-4">
          <p className="text-sm text-habito-purple-dark mb-1">Current Streak</p>
          <p className="text-2xl font-bold text-habito-purple-dark">{longestCurrentStreak} days</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Best Streak</p>
          <p className="text-2xl font-bold text-gray-700">{highestEverStreak} days</p>
        </div>
        <div className="col-span-2 bg-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">30-Day Completion Rate</p>
          <p className="text-2xl font-bold text-gray-700">{avgCompletionRate}%</p>
        </div>
      </div>
    </Card>
  );
};

export default InsightsCard;
