export const achievementCategories = {
  COMBAT: "combat",
  PROGRESSION: "progression", 
  COLLECTION: "collection",
  SOCIAL: "social",
  SPECIAL: "special"
};

export const achievementRarities = {
  COMMON: "common",
  RARE: "rare",
  EPIC: "epic",
  LEGENDARY: "legendary"
};

export const achievements = {
  // Combat Achievements
  FIRST_BLOOD: {
    id: "first_blood",
    title: "First Blood",
    description: "Win your first match",
    category: achievementCategories.COMBAT,
    rarity: achievementRarities.COMMON,
    icon: "🩸",
    points: 10,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  
  PERFECT_VICTORY: {
    id: "perfect_victory", 
    title: "Perfect Victory",
    description: "Win a match without taking damage",
    category: achievementCategories.COMBAT,
    rarity: achievementRarities.RARE,
    icon: "⭐",
    points: 25,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  
  COMBO_MASTER: {
    id: "combo_master",
    title: "Combo Master", 
    description: "Land a 10-hit combo",
    category: achievementCategories.COMBAT,
    rarity: achievementRarities.EPIC,
    icon: "⚡",
    points: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  
  AI_SLAYER: {
    id: "ai_slayer",
    title: "AI Slayer",
    description: "Defeat the AI 10 times",
    category: achievementCategories.COMBAT,
    rarity: achievementRarities.COMMON,
    icon: "🤖",
    points: 30,
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  
  // Progression Achievements
  LEVEL_UP: {
    id: "level_up",
    title: "Level Up",
    description: "Reach level 5",
    category: achievementCategories.PROGRESSION,
    rarity: achievementRarities.COMMON,
    icon: "📈",
    points: 15,
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  
  VETERAN: {
    id: "veteran",
    title: "Veteran Fighter",
    description: "Play 50 matches",
    category: achievementCategories.PROGRESSION,
    rarity: achievementRarities.RARE,
    icon: "🎖️",
    points: 40,
    unlocked: false,
    progress: 0,
    maxProgress: 50
  },
  
  // Collection Achievements
  CHARACTER_COLLECTOR: {
    id: "character_collector",
    title: "Character Collector",
    description: "Unlock 3 different characters",
    category: achievementCategories.COLLECTION,
    rarity: achievementRarities.RARE,
    icon: "👥",
    points: 35,
    unlocked: false,
    progress: 0,
    maxProgress: 3
  },
  
  // Social Achievements
  FRIENDLY_FIGHTER: {
    id: "friendly_fighter",
    title: "Friendly Fighter",
    description: "Play 5 matches with friends",
    category: achievementCategories.SOCIAL,
    rarity: achievementRarities.COMMON,
    icon: "🤝",
    points: 20,
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  
  // Special Achievements
  NIGHT_OWL: {
    id: "night_owl",
    title: "Night Owl",
    description: "Play a match after midnight",
    category: achievementCategories.SPECIAL,
    rarity: achievementRarities.RARE,
    icon: "🦉",
    points: 30,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  
  SPEED_DEMON: {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Win a match in under 30 seconds",
    category: achievementCategories.SPECIAL,
    rarity: achievementRarities.EPIC,
    icon: "🏃",
    points: 60,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  
  COMEBACK_KING: {
    id: "comeback_king",
    title: "Comeback King",
    description: "Win a match with less than 10% HP remaining",
    category: achievementCategories.SPECIAL,
    rarity: achievementRarities.LEGENDARY,
    icon: "👑",
    points: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  }
};

export const getAchievementsByCategory = () => {
  const categorized = {};
  Object.values(achievementCategories).forEach(category => {
    categorized[category] = Object.values(achievements).filter(
      achievement => achievement.category === category
    );
  });
  return categorized;
};

export const getTotalPoints = (userAchievements) => {
  return Object.values(userAchievements)
    .filter(achievement => achievement.unlocked)
    .reduce((total, achievement) => total + achievement.points, 0);
};

export const getUnlockedCount = (userAchievements) => {
  return Object.values(userAchievements)
    .filter(achievement => achievement.unlocked).length;
};

export const getTotalCount = () => {
  return Object.keys(achievements).length;
}; 