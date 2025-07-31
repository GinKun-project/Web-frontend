import React from "react";

export default function VisualSettings({ settings, onSettingChange }) {
  const handleChange = (key, value) => {
    onSettingChange(key, value);
  };

  return (
    <div className="section-content">
      <div className="setting-item">
        <label>Retro Filter:</label>
        <input
          type="checkbox"
          checked={settings.retroFilter || false}
          onChange={(e) => handleChange("retroFilter", e.target.checked)}
        />
      </div>

      <div className="setting-item">
        <label>Theme:</label>
        <select 
          value={settings.theme || "Neon"} 
          onChange={(e) => handleChange("theme", e.target.value)}
        >
          <option value="Neon">Neon</option>
          <option value="Dark Pixel">Dark Pixel</option>
          <option value="High Contrast">High Contrast</option>
        </select>
      </div>

      <div className="setting-item">
        <label>Resolution:</label>
        <select
          value={settings.resolution || "Fit to Screen"}
          onChange={(e) => handleChange("resolution", e.target.value)}
        >
          <option value="Fit to Screen">Fit to Screen</option>
          <option value="Fixed Pixel Mode">Fixed Pixel Mode</option>
        </select>
      </div>

      <div className="setting-item">
        <label>Cursor Style:</label>
        <select
          value={settings.cursorStyle || "Crosshair"}
          onChange={(e) => handleChange("cursorStyle", e.target.value)}
        >
          <option value="Crosshair">Crosshair</option>
          <option value="Fist">Fist</option>
          <option value="Classic">Classic</option>
          <option value="Neon Dot">Neon Dot</option>
        </select>
      </div>
    </div>
  );
}
