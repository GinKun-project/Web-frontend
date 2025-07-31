import React from "react";
import { motion } from "framer-motion";

export default function AchievementItem({ 
  achievement, 
  userAchievement, 
  onUnlocked 
}) {
  const isUnlocked = userAchievement?.unlocked || false;
  const progress = userAchievement?.progress || 0;
  const maxProgress = achievement.maxProgress || 1;
  const progressPercentage = Math.min((progress / maxProgress) * 100, 100);

  const getRarityColor = (rarity) => {
    const colors = {
      common: "#6b7280",
      rare: "#3b82f6", 
      epic: "#8b5cf6",
      legendary: "#f59e0b"
    };
    return colors[rarity] || colors.common;
  };

  const getRarityBorder = (rarity) => {
    const borders = {
      common: "2px solid #6b7280",
      rare: "2px solid #3b82f6",
      epic: "2px solid #8b5cf6", 
      legendary: "2px solid #f59e0b"
    };
    return borders[rarity] || borders.common;
  };

  const handleClick = () => {
    if (isUnlocked) {
      // Show achievement details or play unlock animation
      onUnlocked(achievement);
    }
  };

  return (
    <motion.div
      className={`achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`}
      style={{ 
        border: isUnlocked ? getRarityBorder(achievement.rarity) : '2px solid #374151',
        backgroundColor: isUnlocked ? 'rgba(59, 130, 246, 0.1)' : 'rgba(55, 65, 81, 0.1)'
      }}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="achievement-header">
        <div className="achievement-icon">
          {isUnlocked ? achievement.icon : '🔒'}
        </div>
        <div className="achievement-info">
          <h4 className="achievement-title">{achievement.title}</h4>
          <p className="achievement-description">{achievement.description}</p>
        </div>
        <div className="achievement-points">
          <span className="points-value">{achievement.points}</span>
          <span className="points-label">pts</span>
        </div>
      </div>

      <div className="achievement-progress">
        <div className="progress-info">
          <span className="progress-text">
            {isUnlocked ? 'Completed' : `${progress}/${maxProgress}`}
          </span>
          {!isUnlocked && (
            <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
          )}
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill"
            style={{ 
              width: `${progressPercentage}%`,
              backgroundColor: isUnlocked ? getRarityColor(achievement.rarity) : '#6b7280'
            }}
          ></div>
        </div>
      </div>

      <div className="achievement-footer">
        <div className="rarity-badge" style={{ color: getRarityColor(achievement.rarity) }}>
          {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
        </div>
        {isUnlocked && (
          <div className="unlock-date">
            {userAchievement?.unlockedAt && new Date(userAchievement.unlockedAt).toLocaleDateString()}
          </div>
        )}
      </div>

      {isUnlocked && (
        <motion.div
          className="unlock-indicator"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          ✓
        </motion.div>
      )}
    </motion.div>
  );
} 