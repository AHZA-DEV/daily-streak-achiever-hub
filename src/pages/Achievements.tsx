
import { useState, useEffect } from "react";
import { Achievement } from "@/types/habit";
import NavBar from "@/components/NavBar";
import AchievementBadge from "@/components/AchievementBadge";
import { defaultAchievements } from "@/lib/habitUtils";

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedCount, setUnlockedCount] = useState(0);

  // Load achievements from localStorage
  useEffect(() => {
    const savedAchievements = localStorage.getItem("achievements");
    
    if (savedAchievements) {
      const parsedAchievements = JSON.parse(savedAchievements);
      // Convert date strings back to Date objects
      const hydratedAchievements = parsedAchievements.map((achievement: any) => ({
        ...achievement,
        unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined
      }));
      setAchievements(hydratedAchievements);
      setUnlockedCount(hydratedAchievements.filter((a: Achievement) => a.unlockedAt).length);
    } else {
      setAchievements(defaultAchievements);
      setUnlockedCount(0);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:pt-20">
      <NavBar />
      
      <div className="container max-w-4xl px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Achievements</h1>
          <span className="bg-habito-purple-light text-habito-purple-dark rounded-full px-3 py-1 text-sm">
            {unlockedCount} / {achievements.length}
          </span>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="badge-grid">
            {achievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
