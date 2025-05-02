
import { Achievement } from "@/types/habit";
import { Award, Badge, Star, Activity, CheckCircle, Calendar, ListCheck, Code, Monitor, Cpu } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

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

  // Determine rarity-based styles
  const getRarityStyles = () => {
    switch (achievement.rarity) {
      case "common":
        return {
          gradient: "from-blue-700 to-cyan-600",
          glow: "rgba(59, 130, 246, 0.6)",
          textColor: "text-blue-300"
        };
      case "rare":
        return {
          gradient: "from-purple-700 to-indigo-600", 
          glow: "rgba(155, 135, 245, 0.6)",
          textColor: "text-purple-300"
        };
      case "epic":
        return {
          gradient: "from-amber-500 to-orange-600",
          glow: "rgba(245, 158, 11, 0.6)",
          textColor: "text-amber-300"
        };
      case "legendary":
        return {
          gradient: "from-rose-500 to-pink-600",
          glow: "rgba(244, 63, 94, 0.6)",
          textColor: "text-rose-300"
        };
      default:
        return {
          gradient: "from-emerald-700 to-teal-600",
          glow: "rgba(16, 185, 129, 0.6)",
          textColor: "text-emerald-300"
        };
    }
  };
  
  const rarityStyles = getRarityStyles();

  return (
    <div className="flex flex-col items-center group">
      <div 
        className={`relative w-20 h-20 rounded-full flex items-center justify-center mb-3 transform transition-all duration-300 ${
          isUnlocked 
            ? `bg-gradient-to-br ${rarityStyles.gradient} text-white neo-glow hover:scale-110`
            : "bg-gray-800/50 text-gray-500 opacity-60 hover:bg-gray-800/70"
        }`}
        style={isUnlocked ? { boxShadow: `0 0 15px ${rarityStyles.glow}` } : {}}
      >
        {isUnlocked && (
          <motion.div 
            className="absolute inset-0 rounded-full opacity-30"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              ease: "easeInOut"
            }}
            style={{ 
              background: `radial-gradient(circle, ${rarityStyles.glow} 0%, transparent 70%)` 
            }}
          />
        )}
        
        <div className="relative z-10">
          {renderIcon()}
        </div>
      </div>
      
      <h4 className={`text-sm font-medium mb-1 ${isUnlocked ? "text-white" : "text-gray-400"}`}>
        {achievement.name}
      </h4>
      
      <p className={`text-xs mb-1 text-center ${isUnlocked ? "text-gray-300" : "text-gray-500"} max-w-[120px] mx-auto`}>
        {achievement.description}
      </p>
      
      {isUnlocked ? (
        <span className={`text-xs ${rarityStyles.textColor} mt-1 flex items-center`}>
          <Calendar className="w-3 h-3 mr-1" /> {format(new Date(achievement.unlockedAt), "d MMM")}
        </span>
      ) : (
        <span className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Terkunci
        </span>
      )}
    </div>
  );
};

export default AchievementBadge;
