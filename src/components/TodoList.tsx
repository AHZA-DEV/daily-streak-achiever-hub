
import { useState } from "react";
import { Todo } from "@/types/habit";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Clock, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { generateId } from "@/lib/habitUtils";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface TodoListProps {
  todos: Todo[];
  onAddTodo: (todo: Todo) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

const TodoList = ({ todos, onAddTodo, onToggleTodo, onDeleteTodo }: TodoListProps) => {
  const [newTodoText, setNewTodoText] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    const newTodo: Todo = {
      id: generateId(),
      text: newTodoText.trim(),
      completed: false,
      createdAt: new Date(),
      priority,
    };

    onAddTodo(newTodo);
    setNewTodoText("");
    setPriority("medium");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <form onSubmit={handleAddTodo} className="flex gap-2">
          <div className="flex-1">
            <Input
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new task..."
              className="border-none bg-gray-50 focus-visible:ring-1 focus-visible:ring-habito-purple"
            />
          </div>
          
          <div className="flex gap-1">
            <Button 
              type="button"
              variant="outline"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full",
                priority === "low" && "bg-green-100 text-green-800"
              )}
              onClick={() => setPriority("low")}
            >
              L
            </Button>
            <Button 
              type="button"
              variant="outline"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full",
                priority === "medium" && "bg-yellow-100 text-yellow-800"
              )}
              onClick={() => setPriority("medium")}
            >
              M
            </Button>
            <Button 
              type="button"
              variant="outline"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full",
                priority === "high" && "bg-red-100 text-red-800"
              )}
              onClick={() => setPriority("high")}
            >
              H
            </Button>
          </div>
          
          <Button type="submit" className="bg-habito-purple hover:bg-habito-purple-dark">
            Add
          </Button>
        </form>
      </Card>
      
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Active Tasks ({activeTodos.length})</h3>
        <AnimatePresence>
          {activeTodos.map(todo => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="group"
            >
              <Card className="p-3 mb-2 hover:shadow-md transition-all border-l-4"
                style={{ borderLeftColor: todo.priority === "high" ? "#ef4444" : todo.priority === "medium" ? "#eab308" : "#22c55e" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      onClick={() => onToggleTodo(todo.id)}
                      className={`rounded-full flex items-center justify-center hover:text-habito-purple transition-colors`}
                    >
                      {todo.completed ? (
                        <CheckCircle className="h-5 w-5 text-habito-purple" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                    <span className={cn("flex-1", todo.completed && "line-through text-gray-400")}>
                      {todo.text}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(todo.priority)}>
                      {todo.priority}
                    </Badge>
                    <button
                      onClick={() => onDeleteTodo(todo.id)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {completedTodos.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Completed ({completedTodos.length})</h3>
          <AnimatePresence>
            {completedTodos.map(todo => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="group"
              >
                <Card className="p-3 mb-2 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <button
                        onClick={() => onToggleTodo(todo.id)}
                        className={`rounded-full flex items-center justify-center`}
                      >
                        <CheckCircle className="h-5 w-5 text-habito-purple" />
                      </button>
                      <span className="line-through text-gray-400 flex-1">
                        {todo.text}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDeleteTodo(todo.id)}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TodoList;
