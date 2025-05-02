
import { Achievement } from "@/types/habit";
import { Award, Badge, Star, Activity, CheckCircle, Calendar, ListCheck, Code, Monitor, Cpu } from "lucide-react";
import { format } from "date-fns";

interface AchievementBadgeProps {
  achievement: Achievement;
}

const AchievementBadge = ({ achievement }: AchievementBadgeProps) => {
  const isUnlocked = !!achievement.unlockedAt;
  
  const renderIcon = () => {
    switch (achievement.icon) {
      case "award":
        return <Award size={24} />;
      case "badge":
        return <Badge size={24} />;
      case "star":
        return <Star size={24} />;
      case "activity":
        return <Activity size={24} />;
      case "calendar":
        return <Calendar size={24} />;
      case "list-check":
        return <ListCheck size={24} />;
      case "code":
        return <Code size={24} />;
      case "monitor":
        return <Monitor size={24} />;
      case "cpu":
        return <Cpu size={24} />;
      default:
        return <CheckCircle size={24} />;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
          isUnlocked 
            ? "bg-gradient-to-br from-purple-700 to-indigo-600 text-white " + (isUnlocked ? "animate-badge-shine neo-glow" : "")
            : "bg-gray-800/50 text-gray-400 opacity-60"
        }`}
      >
        {renderIcon()}
      </div>
      <h4 className={`text-sm font-medium mb-1 ${isUnlocked ? "text-white" : "text-gray-400"}`}>
        {achievement.name}
      </h4>
      <p className={`text-xs mb-1 text-center ${isUnlocked ? "text-gray-300" : "text-gray-500"}`}>
        {achievement.description}
      </p>
      {isUnlocked && (
        <span className="text-xs text-purple-400 mt-1">
          Terbuka {format(new Date(achievement.unlockedAt), "d MMM")}
        </span>
      )}
    </div>
  );
};

export default AchievementBadge;
