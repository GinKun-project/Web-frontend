import React, { useEffect, useState } from "react";
import {
  getSettingUseCase,
  updateSettingUseCase,
} from "../../../domain/settings/usecases";

export default function AudioSettings() {
  const [musicVolume, setMusicVolume] = useState(70);
  const [sfxVolume, setSfxVolume] = useState(80);
  const [mute, setMute] = useState(false);

  useEffect(() => {
    setMusicVolume(getSettingUseCase("musicVolume"));
    setSfxVolume(getSettingUseCase("sfxVolume"));
    setMute(getSettingUseCase("muteAll"));
  }, []);

  useEffect(() => {
    updateSettingUseCase("musicVolume", musicVolume);
    updateSettingUseCase("sfxVolume", sfxVolume);
    updateSettingUseCase("muteAll", mute);
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
