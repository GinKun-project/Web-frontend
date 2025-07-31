import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AchievementPanel from "./AchievementPanel";
import "../../styles/Achievements.css";

export default function AchievementScreen() {
  const navigate = useNavigate();
  const [showAchievements, setShowAchievements] = useState(true);

  const handleClose = () => {
    setShowAchievements(false);
    // Navigate back to the previous screen
    navigate(-1);
  };

  return (
    <div className="achievement-screen">
      {showAchievements && (
        <AchievementPanel onClose={handleClose} />
      )}
    </div>
  );
} 