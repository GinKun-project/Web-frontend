import { achievementsApi } from "../../data/achievements/achievementsApi";
import { achievements, getTotalCount } from "./entities";

export const loadUserAchievementsUseCase = async () => {
  try {
    const response = await achievementsApi.getUserAchievements();
    return response.data || achievements;
  } catch (error) {
    console.error("Error loading achievements:", error);
    return achievements;
  }
};

export const updateAchievementProgressUseCase = async (achievementId, progress) => {
  try {
    const response = await achievementsApi.updateAchievementProgress(achievementId, progress);
    return response.data;
  } catch (error) {
    console.error("Error updating achievement progress:", error);
    throw error;
  }
};

export const unlockAchievementUseCase = async (achievementId) => {
  try {
    const response = await achievementsApi.unlockAchievement(achievementId);
    return response.data;
  } catch (error) {
    console.error("Error unlocking achievement:", error);
    throw error;
  }
};

export const getAchievementStatsUseCase = async () => {
  try {
    const response = await achievementsApi.getAchievementStats();
    return response.data;
  } catch (error) {
    console.error("Error fetching achievement stats:", error);
    return {
      totalPoints: 0,
      unlockedCount: 0,
      totalCount: getTotalCount(),
      completionPercentage: 0
    };
  }
};

export const resetAchievementsUseCase = async () => {
  try {
    const response = await achievementsApi.resetAchievements();
    return response.data;
  } catch (error) {
    console.error("Error resetting achievements:", error);
    throw error;
  }
};

export const checkAndUpdateAchievementsUseCase = async (gameStats) => {
  const updatedAchievements = [];
  
  try {
    const userAchievements = await loadUserAchievementsUseCase();
    
    // Check First Blood achievement
    if (gameStats.wins > 0 && !userAchievements.FIRST_BLOOD.unlocked) {
      await unlockAchievementUseCase("first_blood");
      updatedAchievements.push("First Blood");
    }
    
    // Check AI Slayer achievement
    if (gameStats.aiWins > 0) {
      const currentProgress = userAchievements.AI_SLAYER.progress || 0;
      const newProgress = Math.min(currentProgress + gameStats.aiWins, 10);
      await updateAchievementProgressUseCase("ai_slayer", newProgress);
      
      if (newProgress >= 10 && !userAchievements.AI_SLAYER.unlocked) {
        await unlockAchievementUseCase("ai_slayer");
        updatedAchievements.push("AI Slayer");
      }
    }
    
    // Check Perfect Victory achievement
    if (gameStats.perfectWins > 0 && !userAchievements.PERFECT_VICTORY.unlocked) {
      await unlockAchievementUseCase("perfect_victory");
      updatedAchievements.push("Perfect Victory");
    }
    
    // Check Veteran achievement
    if (gameStats.totalMatches > 0) {
      const currentProgress = userAchievements.VETERAN.progress || 0;
      const newProgress = Math.min(currentProgress + gameStats.totalMatches, 50);
      await updateAchievementProgressUseCase("veteran", newProgress);
      
      if (newProgress >= 50 && !userAchievements.VETERAN.unlocked) {
        await unlockAchievementUseCase("veteran");
        updatedAchievements.push("Veteran Fighter");
      }
    }
    
    // Check Speed Demon achievement
    if (gameStats.fastestWin && gameStats.fastestWin < 30 && !userAchievements.SPEED_DEMON.unlocked) {
      await unlockAchievementUseCase("speed_demon");
      updatedAchievements.push("Speed Demon");
    }
    
    // Check Comeback King achievement
    if (gameStats.comebackWins > 0 && !userAchievements.COMEBACK_KING.unlocked) {
      await unlockAchievementUseCase("comeback_king");
      updatedAchievements.push("Comeback King");
    }
    
    return updatedAchievements;
    
  } catch (error) {
    console.error("Error checking achievements:", error);
    return [];
  }
};

export const getAchievementProgressUseCase = (achievementId, userAchievements) => {
  const achievement = userAchievements[achievementId];
  if (!achievement) return 0;
  
  return achievement.progress || 0;
};

export const isAchievementUnlockedUseCase = (achievementId, userAchievements) => {
  const achievement = userAchievements[achievementId];
  if (!achievement) return false;
  
  return achievement.unlocked || false;
}; 