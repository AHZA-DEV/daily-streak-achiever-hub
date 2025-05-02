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
import { Award, Star, CalendarCheck } from "lucide-react";

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

  // Calculate completion rates for the progress indicators
  const habitCompletionRate = habits.length > 0 
    ? Math.round((habits.filter(h => h.completedDates.some(d => 
        d.toDateString() === new Date().toDateString()
      )).length / habits.length) * 100)
    : 0;
  
  const todoCompletionRate = todos.length > 0
    ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100)
    : 0;
  
  // Get recently unlocked achievements (last 7 days)
  const recentAchievements = achievements
    .filter(a => a.unlockedAt && new Date().getTime() - new Date(a.unlockedAt).getTime() < 7 * 24 * 60 * 60 * 1000)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-habito-purple-light pb-20 md:pb-0 md:pt-20">
      <NavBar />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-4xl px-4 py-8"
      >
        {/* Tech-themed Header section with gradient background */}
        <div className="mb-8 bg-gradient-to-r from-tech-dark to-purple-900 rounded-xl shadow-xl overflow-hidden">
          <div className="backdrop-blur-sm p-6 relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-purple-500/20 blur-xl"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-indigo-500/20 blur-xl"></div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              <h1 className="text-3xl font-bold text-white mb-1">Selamat Datang, Developer</h1>
              <p className="text-purple-200">{format(new Date(), "EEEE, MMMM d")}</p>
              
              {/* Progress summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 border border-purple-500/20 neo-glow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-200 text-sm">Kebiasaan Hari Ini</span>
                    <CalendarCheck size={18} className="text-purple-300" />
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-white">{habitCompletionRate}%</span>
                    <div className="w-24 bg-gray-700/50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-400 h-2 rounded-full" style={{ width: `${habitCompletionRate}%` }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 border border-purple-500/20 neo-glow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-200 text-sm">Tugas Selesai</span>
                    <Star size={18} className="text-purple-300" />
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-white">{todoCompletionRate}%</span>
                    <div className="w-24 bg-gray-700/50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-400 h-2 rounded-full" style={{ width: `${todoCompletionRate}%` }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 border border-purple-500/20 neo-glow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-200 text-sm">Lencana Terbaru</span>
                    <Award size={18} className="text-purple-300" />
                  </div>
                  <div>
                    {recentAchievements.length > 0 ? (
                      <div className="flex -space-x-2">
                        {recentAchievements.map(achievement => (
                          <div key={achievement.id} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-700 to-indigo-600 flex items-center justify-center border-2 border-black/50">
                            <span className="text-xs text-white">{achievement.name.charAt(0)}</span>
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center border-2 border-purple-500/30 text-xs text-purple-300">+{achievements.filter(a => a.unlockedAt).length - recentAchievements.length}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-purple-300">Belum ada lencana</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
          
        <div className="flex justify-between items-center mt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-black/50 backdrop-blur-sm border border-purple-500/20">
              <TabsTrigger value="habits" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Kebiasaan</TabsTrigger>
              <TabsTrigger value="todos" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Tugas</TabsTrigger>
            </TabsList>
          </Tabs>
          <NewHabitDialog onAddHabit={handleAddHabit} />
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
