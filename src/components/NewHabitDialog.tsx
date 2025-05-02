
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Habit, HabitCategory, HabitFrequency } from "@/types/habit";
import { generateId } from "@/lib/habitUtils";
import { Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface NewHabitDialogProps {
  onAddHabit: (habit: Habit) => void;
}

const CATEGORIES: { value: HabitCategory; label: string }[] = [
  { value: "programming", label: "Programming" },
  { value: "learning", label: "Learning" },
  { value: "wellness", label: "Wellness" },
  { value: "spiritual", label: "Spiritual" },
  { value: "fitness", label: "Fitness" },
  { value: "social", label: "Social" },
  { value: "productivity", label: "Productivity" },
  { value: "creativity", label: "Creativity" },
  { value: "other", label: "Other" },
];

const NewHabitDialog = ({ onAddHabit }: NewHabitDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<HabitCategory>("programming");
  const [frequency, setFrequency] = useState<HabitFrequency>("daily");
  const [target, setTarget] = useState<number>(1);
  const [notes, setNotes] = useState("");
  const [showTarget, setShowTarget] = useState(false);

  useEffect(() => {
    setShowTarget(frequency === "weekly");
  }, [frequency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    const newHabit: Habit = {
      id: generateId(),
      name: name.trim(),
      category,
      frequency,
      ...(showTarget && { target }),
      notes: notes.trim() || undefined,
      createdAt: new Date(),
      completedDates: [],
      streak: 0,
      highestStreak: 0,
    };
    
    onAddHabit(newHabit);
    resetForm();
    setOpen(false);
  };
  
  const resetForm = () => {
    setName("");
    setCategory("programming");
    setFrequency("daily");
    setTarget(1);
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-habito-purple hover:bg-habito-purple-dark">
          <Plus className="mr-2 h-4 w-4" /> New Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Habit name</Label>
              <Input
                id="name"
                autoFocus
                placeholder="What do you want to track?"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(val) => setCategory(val as HabitCategory)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Frequency</Label>
              <RadioGroup 
                value={frequency} 
                onValueChange={(value) => setFrequency(value as HabitFrequency)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily" className="cursor-pointer">Daily</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly" className="cursor-pointer">Weekly</Label>
                </div>
              </RadioGroup>
            </div>
            
            {showTarget && (
              <div className="grid gap-2">
                <Label htmlFor="target">Weekly Target</Label>
                <Input
                  id="target"
                  type="number"
                  min="1"
                  max="7"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                />
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add some notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-habito-purple hover:bg-habito-purple-dark">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewHabitDialog;
