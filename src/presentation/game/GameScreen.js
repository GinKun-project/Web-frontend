import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import { FaPlay, FaCog, FaTrophy, FaUser } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import UserProfile from "./UserProfile";
import SettingsPanel from "../settings/SettingsPanel";

export default function GameScreen({ user, onLogout }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate("/loader"); 
  };

  const handleToggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  const handleSettingsClick = () => {
    setShowSettings((prev) => !prev);
  };

  return (
    <div
      className="dashboard-container"
      style={{
        backgroundImage: `url("/images/bg-retro.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="dashboard-header">
        <h1 className="dashboard-title">SHADOW CLASH</h1>
        <div className="user-icon" onClick={handleToggleProfile}>
          <FaUser />
          <span>{user?.displayName || user?.username}</span>
        </div>
      </div>

      <AnimatePresence>
        {showProfile && (
          <UserProfile
            user={user}
            onLogout={onLogout}
            onClose={() => setShowProfile(false)}
          />
        )}
      </AnimatePresence>

      <div className="dashboard-body">
        {showSettings ? (
          <div style={{ flex: 1 }}>
            <SettingsPanel />
          </div>
        ) : (
          <div className="dashboard-buttons">
            <button className="dashboard-btn" onClick={handleStartGame}>
              <FaPlay /> START GAME
            </button>
            <button className="dashboard-btn" onClick={handleSettingsClick}>
              <FaCog /> SETTINGS
            </button>
            <button className="dashboard-btn">
              <FaTrophy /> ACHIEVEMENTS
            </button>
          </div>
        )}

        <div className="dashboard-sidebar">
          <p>
            WELCOME TO SHADOW CLASH,<br />
            A RETRO-STYLE BATTLE GAME.<br />
            PREPARE TO FIGHT!<br />
            Shadow Clash is a fast-paced 2D retro-style fighting game that blends classic arcade aesthetics with modern web technology. Designed with a neon-pixel art theme and game-inspired UI, it immerses players in a nostalgic yet responsive combat experience. The game is built using React for the frontend and Node.js + MongoDB for backend management, ensuring smooth performance and scalable architecture.
            Players can sign up, customize their avatar and profile, and dive into local battles.
          </p>
        </div>
      </div>
    </div>
  );
}
