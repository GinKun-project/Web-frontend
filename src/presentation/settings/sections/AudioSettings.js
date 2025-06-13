import React, { useState, useEffect } from "react";
import { saveSetting, getSetting } from "../../../infrastructure/storage/settingsStorage";

export default function AudioSettings() {
  const [musicVolume, setMusicVolume] = useState(70);
  const [sfxVolume, setSfxVolume] = useState(80);
  const [mute, setMute] = useState(false);

  // Load on mount
  useEffect(() => {
    setMusicVolume(getSetting("audio_music", 70));
    setSfxVolume(getSetting("audio_sfx", 80));
    setMute(getSetting("audio_mute", false));
  }, []);

  // Save when changed
  useEffect(() => {
    saveSetting("audio_music", musicVolume);
    saveSetting("audio_sfx", sfxVolume);
    saveSetting("audio_mute", mute);
  }, [musicVolume, sfxVolume, mute]);

  return (
    <div className="section-content">
      <div className="setting-item">
        <label>Music Volume</label>
        <input
          type="range"
          min="0"
          max="100"
          value={musicVolume}
          onChange={(e) => setMusicVolume(Number(e.target.value))}
        />
      </div>

      <div className="setting-item">
        <label>SFX Volume</label>
        <input
          type="range"
          min="0"
          max="100"
          value={sfxVolume}
          onChange={(e) => setSfxVolume(Number(e.target.value))}
        />
      </div>

      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={mute}
            onChange={(e) => setMute(e.target.checked)}
          />
          Mute All
        </label>
      </div>
    </div>
  );
}
