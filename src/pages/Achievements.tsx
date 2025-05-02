
import { useState, useEffect } from "react";
import { Achievement } from "@/types/habit";
import NavBar from "@/components/NavBar";
import AchievementBadge from "@/components/AchievementBadge";
import { defaultAchievements } from "@/lib/habitUtils";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string>("semua");

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

  // Get unique categories from achievements
  const categories = ["semua", ...new Set(achievements.map(achievement => achievement.category || "umum"))];
  
  // Filter achievements based on active category
  const filteredAchievements = activeFilter === "semua" 
    ? achievements 
    : achievements.filter(achievement => (achievement.category || "umum") === activeFilter);

  // Animation variants
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
    <div className="min-h-screen bg-tech-grid bg-tech-dark pb-20 md:pb-0 md:pt-20">
      <NavBar />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-4xl px-4 py-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text flex items-center gap-2">
              <Award className="text-purple-400" size={28} /> Lencana Prestasi
            </h1>
            <p className="text-gray-400 mt-1">Kumpulkan lencana dengan menyelesaikan tantangan</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-sm border border-purple-500/20 text-purple-300 rounded-full px-4 py-2 text-sm font-medium">
              <span className="text-xl font-bold mr-1">{unlockedCount}</span> / {achievements.length}
            </span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900/70 to-purple-900/40 backdrop-blur-md border border-purple-500/20 rounded-lg shadow-xl p-6 mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-1.5 text-sm rounded-full transition-all ${
                  activeFilter === category 
                    ? "bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-lg" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          
          <motion.div 
            className="badge-grid"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredAchievements.map((achievement) => (
              <motion.div key={achievement.id} variants={item}>
                <AchievementBadge achievement={achievement} />
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
          <h3 className="text-lg font-medium text-purple-300 mb-4">Cara Mendapatkan Lencana</h3>
          <div className="space-y-3 text-gray-300">
            <p className="flex items-start gap-2">
              <span className="inline-block w-5 h-5 rounded-full bg-purple-600 flex-shrink-0 mt-1"></span>
              <span>Selesaikan kebiasaan secara konsisten untuk mendapatkan lencana keberhasilan</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="inline-block w-5 h-5 rounded-full bg-indigo-600 flex-shrink-0 mt-1"></span>
              <span>Capai streak mingguan dan bulanan untuk membuka lencana yang lebih langka</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="inline-block w-5 h-5 rounded-full bg-blue-600 flex-shrink-0 mt-1"></span>
              <span>Selesaikan tantangan khusus seperti menyelesaikan proyek atau tutorial</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Achievements;
