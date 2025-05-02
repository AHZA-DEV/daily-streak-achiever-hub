
import { Habit } from "@/types/habit";
import HabitCard from "./HabitCard";

interface HabitListProps {
  habits: Habit[];
  onToggle: (habit: Habit) => void;
}

const HabitList = ({ habits, onToggle }: HabitListProps) => {
  if (habits.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-2">No habits yet</p>
        <p className="text-sm text-gray-400">Create your first habit to start tracking</p>
      </div>
    );
  }

  return (
    <div className="habit-grid">
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} onToggle={onToggle} />
      ))}
    </div>
  );
};

export default HabitList;
