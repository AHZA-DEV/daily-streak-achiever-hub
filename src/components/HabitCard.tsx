
import { useState } from "react";
import { Habit } from "@/types/habit";
import { Check, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { categoryColors } from "@/lib/habitUtils";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
  onToggle: (habit: Habit) => void;
}

const HabitCard = ({ habit, onToggle }: HabitCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const isCompleted = habit.completedDates.some(date => 
    new Date(date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
  );
  
  const handleToggle = () => {
    setIsAnimating(true);
    onToggle(habit);
    setTimeout(() => setIsAnimating(false), 400);
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all", 
      isAnimating && "animate-complete-habit"
    )}>
      <div className="flex flex-col h-full">
        <div className={`h-2 ${categoryColors[habit.category]}`} />
        
        <div className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-medium text-lg text-gray-800 flex-1">{habit.name}</h3>
            
            <button
              onClick={handleToggle}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                isCompleted 
                  ? "bg-habito-purple text-white" 
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              )}
            >
              <Check size={16} />
            </button>
          </div>
          
          <div className="flex items-center mt-auto pt-4 text-sm">
            <div className="flex items-center text-gray-500 mr-4">
              <Calendar size={14} className="mr-1" />
              <span>{habit.streak} day{habit.streak !== 1 ? 's' : ''}</span>
            </div>
            
            {habit.streak > 0 && (
              <div className="bg-habito-purple-light text-habito-purple-dark px-2 py-0.5 rounded text-xs">
                {habit.streak === habit.highestStreak ? 'Best streak!' : `Best: ${habit.highestStreak}`}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HabitCard;
