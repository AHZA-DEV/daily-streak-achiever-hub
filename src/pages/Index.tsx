
import { useState, useEffect } from "react";
import { Habit, Achievement, Todo } from "@/types/habit";
import HabitList from "@/components/HabitList";
import TodoList from "@/components/TodoList";
import NavBar from "@/components/NavBar";
import NewHabitDialog from "@/components/NewHabitDialog";
import { toggleHabitCompletion, defaultHabits, defaultAchievements, defaultTodos, checkForAchievements } from "@/lib/habitUtils";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeTab, setActiveTab] = useState("habits");
  const { toast } = useToast();

  // Initialize with default data
  useEffect(() => {
    // Check for existing data in localStorage
    const savedHabits = localStorage.getItem("habits");
    const savedTodos = localStorage.getItem("todos");
    const savedAchievements = localStorage.getItem("achievements");
    
    if (savedHabits) {
      const parsedHabits = JSON.parse(savedHabits);
      // Convert date strings back to Date objects
      const hydratedHabits = parsedHabits.map((habit: any) => ({
        ...habit,
        createdAt: new Date(habit.createdAt),
        completedDates: habit.completedDates.map((date: string) => new Date(date))
      }));
      setHabits(hydratedHabits);
    } else {
      setHabits(defaultHabits);
    }
    
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos);
      // Convert date strings back to Date objects
      const hydratedTodos = parsedTodos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
      }));
      setTodos(hydratedTodos);
    } else {
      setTodos(defaultTodos);
    }
    
    if (savedAchievements) {
      const parsedAchievements = JSON.parse(savedAchievements);
      // Convert date strings back to Date objects
      const hydratedAchievements = parsedAchievements.map((achievement: any) => ({
        ...achievement,
        unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined
      }));
      setAchievements(hydratedAchievements);
    } else {
      setAchievements(defaultAchievements);
    }
  }, []);
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem("habits", JSON.stringify(habits));
    }
  }, [habits]);
  
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);
  
  useEffect(() => {
    if (achievements.length > 0) {
      localStorage.setItem("achievements", JSON.stringify(achievements));
    }
  }, [achievements]);

  // Check for newly unlocked achievements whenever habits change
  useEffect(() => {
    if (habits.length > 0 && achievements.length > 0) {
      const updatedAchievements = checkForAchievements(habits, achievements);
      
      // Find newly unlocked achievements
      const newlyUnlocked = updatedAchievements.filter(
        (achievement, index) => 
          achievement.unlockedAt && 
          (!achievements[index].unlockedAt || 
           achievement.unlockedAt > achievements[index].unlockedAt!)
      );
      
      // Show toast for each newly unlocked achievement
      newlyUnlocked.forEach(achievement => {
        toast({
          title: "Achievement Unlocked! 🎉",
          description: achievement.name + ": " + achievement.description,
        });
      });
      
      if (newlyUnlocked.length > 0) {
        setAchievements(updatedAchievements);
      }
    }
  }, [habits, achievements, toast]);

  const handleToggleHabit = (habit: Habit) => {
    setHabits(prevHabits => 
      prevHabits.map(h => h.id === habit.id ? toggleHabitCompletion(h) : h)
    );
  };
  
  const handleAddHabit = (habit: Habit) => {
    setHabits(prevHabits => [...prevHabits, habit]);
    toast({
      title: "Habit created",
      description: `${habit.name} has been added to your habits.`,
    });
  };
  
  // Todo management functions
  const handleAddTodo = (todo: Todo) => {
    setTodos(prevTodos => [...prevTodos, todo]);
    toast({
      title: "Task added",
      description: `${todo.text} has been added to your tasks.`
    });
  };
  
  const handleToggleTodo = (id: string) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  const handleDeleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    toast({
      title: "Task deleted",
      description: "The task has been removed."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-habito-purple-light pb-20 md:pb-0 md:pt-20">
      <NavBar />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-4xl px-4 py-8"
      >
        <div className="mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Welcome, Developer</h1>
            <p className="text-gray-600">{format(new Date(), "EEEE, MMMM d")}</p>
          </motion.div>
          
          <div className="flex justify-between items-center mt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-white/50 backdrop-blur-sm">
                <TabsTrigger value="habits">Habits</TabsTrigger>
                <TabsTrigger value="todos">Tasks</TabsTrigger>
              </TabsList>
            </Tabs>
            <NewHabitDialog onAddHabit={handleAddHabit} />
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="habits">
            <HabitList habits={habits} onToggle={handleToggleHabit} />
          </TabsContent>
          
          <TabsContent value="todos">
            <TodoList 
              todos={todos} 
              onAddTodo={handleAddTodo} 
              onToggleTodo={handleToggleTodo} 
              onDeleteTodo={handleDeleteTodo}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Index;
