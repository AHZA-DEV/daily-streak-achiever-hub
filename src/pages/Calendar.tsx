
import { useState, useEffect } from "react";
import { Habit } from "@/types/habit";
import NavBar from "@/components/NavBar";
import CalendarView from "@/components/CalendarView";
import { format, isSameDay } from "date-fns";
import { id } from "date-fns/locale";

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
    <div className="min-h-screen bg-tech-grid bg-tech-dark pb-20 md:pb-0 md:pt-20">
      <NavBar />
      
      <div className="container max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text mb-8">Kalender</h1>
        
        <div className="bg-gray-900/70 backdrop-blur-md border border-purple-500/20 rounded-lg shadow-lg overflow-hidden mb-8">
          <CalendarView habits={habits} onSelectDate={setSelectedDate} />
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-medium mb-4 text-white">
            {format(selectedDate, "EEEE, d MMMM yyyy", { locale: id })}
          </h2>
          
          {habitsForSelectedDate.length === 0 ? (
            <div className="bg-gray-900/70 backdrop-blur-md border border-purple-500/20 p-6 rounded-lg shadow-lg text-center">
              <p className="text-gray-400">Belum ada kebiasaan yang dilacak</p>
            </div>
          ) : (
            <div className="bg-gray-900/70 backdrop-blur-md border border-purple-500/20 p-6 rounded-lg shadow-lg">
              <ul className="divide-y divide-purple-500/20">
                {habitsForSelectedDate.map(habit => (
                  <li key={habit.id} className="py-3 flex items-center justify-between">
                    <span className="text-gray-300">{habit.name}</span>
                    <span 
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        habit.completedOnSelectedDate 
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white neo-glow" 
                          : "bg-gray-800 text-gray-600"
                      }`}
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
