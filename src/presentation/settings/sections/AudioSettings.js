import React from "react";

export default function AudioSettings({ settings, onSettingChange }) {
  const handleChange = (key, value) => {
    onSettingChange(key, value);
  };

  return (
    <div className="section-content">
      <div className="setting-item">
        <label>Music Volume: {settings.musicVolume || 70}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.musicVolume || 70}
          onChange={(e) => handleChange("musicVolume", Number(e.target.value))}
        />
      </div>

      <div className="setting-item">
        <label>SFX Volume: {settings.sfxVolume || 80}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.sfxVolume || 80}
          onChange={(e) => handleChange("sfxVolume", Number(e.target.value))}
        />
      </div>

      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={settings.muteAll || false}
            onChange={(e) => handleChange("muteAll", e.target.checked)}
          />
          Mute All
        </label>
      </div>
    </div>
  );
}
