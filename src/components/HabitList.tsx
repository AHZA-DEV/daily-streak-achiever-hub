
import { useState } from "react";
import { Habit } from "@/types/habit";
import HabitCard from "./HabitCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categoryIcons } from "@/lib/habitUtils";
import { motion } from "framer-motion";

interface HabitListProps {
  habits: Habit[];
  onToggle: (habit: Habit) => void;
}

const HabitList = ({ habits, onToggle }: HabitListProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // Get unique categories from habits
  const categories = ["all", ...new Set(habits.map(habit => habit.category))];
  
  // Filter habits based on active category
  const filteredHabits = activeCategory === "all" 
    ? habits 
    : habits.filter(habit => habit.category === activeCategory);

  if (habits.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-2">No habits yet</p>
        <p className="text-sm text-gray-400">Create your first habit to start tracking</p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
        <div className="overflow-x-auto pb-2 no-scrollbar">
          <TabsList className="bg-transparent h-auto p-1 w-auto flex space-x-1">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-habito-purple data-[state=active]:text-white rounded-full px-4 py-1.5 capitalize"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <TabsContent value={activeCategory} className="mt-2 space-y-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredHabits.map((habit) => (
              <motion.div key={habit.id} variants={item}>
                <HabitCard habit={habit} onToggle={onToggle} />
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HabitList;
