
import { useState, useEffect } from "react";
import { Habit } from "@/types/habit";
import NavBar from "@/components/NavBar";
import CalendarView from "@/components/CalendarView";
import { format, isSameDay } from "date-fns";

const Calendar = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

  // Filter habits for selected date
  const habitsForSelectedDate = habits.map(habit => ({
    ...habit,
    completedOnSelectedDate: habit.completedDates.some(date => 
      isSameDay(new Date(date), selectedDate)
    )
  }));

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:pt-20">
      <NavBar />
      
      <div className="container max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Calendar</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <CalendarView habits={habits} onSelectDate={setSelectedDate} />
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-medium mb-4">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h2>
          
          {habitsForSelectedDate.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-500">No habits tracked yet</p>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow">
              <ul className="divide-y divide-gray-100">
                {habitsForSelectedDate.map(habit => (
                  <li key={habit.id} className="py-3 flex items-center justify-between">
                    <span className="text-gray-800">{habit.name}</span>
                    <span 
                      className={`w-6 h-6 rounded-full flex items-center justify-center 
                        ${habit.completedOnSelectedDate 
                          ? "bg-habito-purple text-white" 
                          : "bg-gray-100 text-gray-400"}`}
                    >
                      {habit.completedOnSelectedDate ? "✓" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
