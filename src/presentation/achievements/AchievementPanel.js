import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  loadUserAchievementsUseCase,
  resetAchievementsUseCase,
} from "../../domain/achievements/usecases";
import {
  getAchievementsByCategory,
  achievementCategories,
  getTotalPoints,
  getUnlockedCount,
  getTotalCount,
} from "../../domain/achievements/entities";
import AchievementCategory from "./AchievementCategory";
import "../../styles/Achievements.css";

export default function AchievementPanel({ onClose }) {
  const [userAchievements, setUserAchievements] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(achievementCategories.COMBAT);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const achievements = await loadUserAchievementsUseCase();
      setUserAchievements(achievements);
    } catch (error) {
      console.error("Error loading achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset all achievements? This action cannot be undone.")) {
      try {
        await resetAchievementsUseCase();
        await loadAchievements();
      } catch (error) {
        console.error("Error resetting achievements:", error);
      }
    }
  };

  const showUnlockNotification = (achievement) => {
    setUnlockedAchievement(achievement);
    setShowUnlockAnimation(true);
    setTimeout(() => {
      setShowUnlockAnimation(false);
      setUnlockedAchievement(null);
    }, 3000);
  };

  const categories = getAchievementsByCategory();
  const totalPoints = getTotalPoints(userAchievements);
  const unlockedCount = getUnlockedCount(userAchievements);
  const totalCount = getTotalCount();
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  if (loading) {
    return (
      <div className="achievement-panel-overlay">
        <div className="achievement-panel">
          <div className="loading-message">Loading achievements...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="achievement-panel-overlay" onClick={onClose}>
        <div className="achievement-panel" onClick={(e) => e.stopPropagation()}>
          <div className="achievement-header">
            <h2 className="achievement-title">🏆 Achievements</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <div className="achievement-stats">
            <div className="stat-item">
              <span className="stat-label">Progress</span>
              <span className="stat-value">{unlockedCount}/{totalCount}</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-label">Points</span>
              <span className="stat-value">{totalPoints}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completion</span>
              <span className="stat-value">{completionPercentage}%</span>
            </div>
          </div>

          <div className="achievement-categories">
            {Object.entries(categories).map(([category, achievements]) => (
              <button
                key={category}
                className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                <span className="category-icon">
                  {category === achievementCategories.COMBAT && '⚔️'}
                  {category === achievementCategories.PROGRESSION && '📈'}
                  {category === achievementCategories.COLLECTION && '🎁'}
                  {category === achievementCategories.SOCIAL && '🤝'}
                  {category === achievementCategories.SPECIAL && '⭐'}
                </span>
                <span className="category-name">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                <span className="category-count">
                  {achievements.filter(a => userAchievements[a.id]?.unlocked).length}/{achievements.length}
                </span>
              </button>
            ))}
          </div>

          <div className="achievement-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AchievementCategory
                  category={activeCategory}
                  achievements={categories[activeCategory]}
                  userAchievements={userAchievements}
                  onAchievementUnlocked={showUnlockNotification}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="achievement-actions">
            <button className="reset-btn" onClick={handleReset}>
              🔄 Reset Achievements
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showUnlockAnimation && unlockedAchievement && (
          <motion.div
            className="achievement-unlock-notification"
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <div className="unlock-icon">🎉</div>
            <div className="unlock-title">Achievement Unlocked!</div>
            <div className="unlock-name">{unlockedAchievement.title}</div>
            <div className="unlock-description">{unlockedAchievement.description}</div>
            <div className="unlock-points">+{unlockedAchievement.points} points</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 