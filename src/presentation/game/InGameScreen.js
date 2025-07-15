import React from "react";
import "../../styles/InGame.css";
import { useNavigate } from "react-router-dom";

export default function InGameScreen() {
  const navigate = useNavigate();

  const handleSelectMode = (mode) => {
    if (mode === "Vs AI") {
      navigate("/vsai");
    } else {
      alert(`Selected Mode: ${mode}`);
    }
  };

  return (
    <div className="ingame-container">
      <div className="ingame-header">
        <h1 className="ingame-title">⚔️ Choose Your Game Mode</h1>
      </div>

      <div className="ingame-arena">
        <button className="ingame-btn" onClick={() => handleSelectMode("Vs AI")}>Vs AI</button>
      </div>

      <div className="ad-box">
        <h3>🔥 Welcome to Shadow Clash!</h3>
        <div className="ad-slide" style={{ animationDelay: "0s" }}>
          <p>⚔️ Choose your warrior and enter the arena.</p>
        </div>
        <div className="ad-slide" style={{ animationDelay: "4s" }}>
          <p>🎮 Compete in intense PvP combat.</p>
        </div>
        <div className="ad-slide" style={{ animationDelay: "8s" }}>
          <p>🏆 Unlock achievements and earn rewards.</p>
        </div>
        <div className="ad-slide" style={{ animationDelay: "12s" }}>
          <p>👾 More maps, heroes & powers coming soon!</p>
        </div>
      </div>
    </div>
  );
}
