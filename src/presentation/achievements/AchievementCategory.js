import React from "react";
import AchievementItem from "./AchievementItem";

export default function AchievementCategory({ 
  category, 
  achievements, 
  userAchievements, 
  onAchievementUnlocked 
}) {
  const getCategoryTitle = (category) => {
    const titles = {
      combat: "Combat Achievements",
      progression: "Progression Achievements", 
      collection: "Collection Achievements",
      social: "Social Achievements",
      special: "Special Achievements"
    };
    return titles[category] || "Achievements";
  };

  const getCategoryDescription = (category) => {
    const descriptions = {
      combat: "Master the art of combat and defeat your opponents",
      progression: "Level up and progress through your fighting journey",
      collection: "Collect characters, items, and unlockables",
      social: "Connect with other fighters and build your community",
      special: "Discover hidden achievements and rare accomplishments"
    };
    return descriptions[category] || "Complete challenges to earn achievements";
  };

  const unlockedCount = achievements.filter(
    achievement => userAchievements[achievement.id]?.unlocked
  ).length;

  const totalPoints = achievements
    .filter(achievement => userAchievements[achievement.id]?.unlocked)
    .reduce((total, achievement) => total + achievement.points, 0);

  return (
    <div className="achievement-category">
      <div className="category-header">
        <h3 className="category-title">{getCategoryTitle(category)}</h3>
        <p className="category-description">{getCategoryDescription(category)}</p>
        <div className="category-summary">
          <span className="summary-item">
            <span className="summary-label">Unlocked:</span>
            <span className="summary-value">{unlockedCount}/{achievements.length}</span>
          </span>
          <span className="summary-item">
            <span className="summary-label">Points:</span>
            <span className="summary-value">{totalPoints}</span>
          </span>
        </div>
      </div>

      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <AchievementItem
            key={achievement.id}
            achievement={achievement}
            userAchievement={userAchievements[achievement.id]}
            onUnlocked={onAchievementUnlocked}
          />
        ))}
      </div>

      {achievements.length === 0 && (
        <div className="no-achievements">
          <div className="no-achievements-icon">🎯</div>
          <div className="no-achievements-text">No achievements in this category yet</div>
        </div>
      )}
    </div>
  );
} 