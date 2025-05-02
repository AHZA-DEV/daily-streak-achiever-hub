
import { Habit } from "@/types/habit";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarViewProps {
  habits: Habit[];
  onSelectDate?: (date: Date) => void;
}

const CalendarView = ({ habits, onSelectDate }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  
  const getDayCompletionStatus = (date: Date) => {
    if (!isSameMonth(date, monthStart)) return "outside";
    
    const completedHabits = habits.filter(habit => 
      habit.completedDates.some(completedDate => isSameDay(new Date(completedDate), date))
    );
    
    if (completedHabits.length === 0) return "empty";
    if (completedHabits.length < habits.length) return "partial";
    return "complete";
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-sm font-medium py-2">
            {day}
          </div>
        ))}
        
        {Array.from({ length: monthStart.getDay() }).map((_, index) => (
          <div key={`empty-start-${index}`} className="p-2"></div>
        ))}
        
        {days.map((day) => {
          const status = getDayCompletionStatus(day);
          return (
            <button
              key={day.toString()}
              className={`aspect-square p-2 rounded-full flex items-center justify-center text-sm transition-colors
                ${isToday(day) ? "border-2 border-habito-purple" : ""}
                ${status === "complete" ? "bg-habito-purple text-white" : ""}
                ${status === "partial" ? "bg-habito-purple-light text-habito-purple-dark" : ""}
                ${status === "empty" && !isToday(day) ? "hover:bg-gray-100" : ""}
                ${status === "outside" ? "text-gray-300" : ""}`}
              onClick={() => onSelectDate && onSelectDate(day)}
              disabled={status === "outside"}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
