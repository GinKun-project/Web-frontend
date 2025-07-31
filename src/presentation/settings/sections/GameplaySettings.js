import React from "react";

export default function GameplaySettings({ settings, onSettingChange }) {
  const handleChange = (key, value) => {
    onSettingChange(key, value);
  };

  return (
    <div className="section-content">
      <div className="setting-item">
        <label>Difficulty</label>
        <select 
          value={settings.difficulty || "Normal"} 
          onChange={(e) => handleChange("difficulty", e.target.value)}
        >
          <option value="Easy">Easy</option>
          <option value="Normal">Normal</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div className="setting-item">
        <label>Player Control</label>
        <select 
          value={settings.controlScheme || "WASD"} 
          onChange={(e) => handleChange("controlScheme", e.target.value)}
        >
          <option value="WASD">WASD</option>
          <option value="Arrow Keys">Arrow Keys</option>
          <option value="Custom">Custom</option>
        </select>
      </div>

      <div className="setting-item">
        <label>Rounds Per Match</label>
        <select 
          value={settings.rounds || "Best of 3"} 
          onChange={(e) => handleChange("rounds", e.target.value)}
        >
          <option value="Best of 1">Best of 1</option>
          <option value="Best of 3">Best of 3</option>
          <option value="Best of 5">Best of 5</option>
        </select>
      </div>
    </div>
  );
}
