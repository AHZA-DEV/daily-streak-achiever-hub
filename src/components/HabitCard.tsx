
import { useState } from "react";
import { Habit } from "@/types/habit";
import { Check, Calendar, Clock, Code, Book, Heart, Activity, CheckSquare, PenTool, Users, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { categoryColors } from "@/lib/habitUtils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  
  const renderIcon = () => {
    switch (habit.category) {
      case "fitness": return <Activity className="h-5 w-5" />;
      case "learning": return <Book className="h-5 w-5" />;
      case "wellness": return <Heart className="h-5 w-5" />;
      case "social": return <Users className="h-5 w-5" />;
      case "productivity": return <CheckSquare className="h-5 w-5" />;
      case "creativity": return <PenTool className="h-5 w-5" />;
      case "programming": return <Code className="h-5 w-5" />;
      case "spiritual": return <Heart className="h-5 w-5" />;
      default: return <Circle className="h-5 w-5" />;
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all border-none shadow-md",
      isAnimating && "animate-complete-habit",
      isCompleted ? "bg-gradient-to-br from-habito-purple-light to-white" : "bg-white"
    )}>
      <div className="flex h-full">
        <div className={`w-2 ${categoryColors[habit.category]}`} />
        
        <div className="p-5 flex flex-col h-full w-full">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 flex-1">
              <span className={`p-1.5 rounded-lg ${categoryColors[habit.category]} bg-opacity-20`}>
                {renderIcon()}
              </span>
              <h3 className="font-medium text-lg text-gray-800">{habit.name}</h3>
            </div>
            
            <button
              onClick={handleToggle}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                isCompleted 
                  ? "bg-habito-purple text-white shadow-lg shadow-habito-purple/30" 
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              )}
            >
              <Check size={16} />
            </button>
          </div>
          
          {habit.notes && (
            <p className="text-sm text-gray-500 mb-3">{habit.notes}</p>
          )}
          
          <div className="flex items-center mt-auto pt-3 text-sm justify-between">
            <div className="flex items-center text-gray-500">
              <Calendar size={14} className="mr-1" />
              <span>{habit.streak} day{habit.streak !== 1 ? 's' : ''}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {habit.frequency === "weekly" && habit.target && (
                <Badge variant="outline" className="text-xs font-normal">
                  Target: {habit.target}/week
                </Badge>
              )}
              
              {habit.streak > 0 && (
                <Badge className="bg-habito-purple text-white text-xs">
                  {habit.streak === habit.highestStreak ? '🔥 Best streak!' : `Best: ${habit.highestStreak}`}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HabitCard;
