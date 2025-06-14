// domain/settings/usecases.js

import { saveSetting, getSetting } from "../../../src/infrastructure/storage/settingsStorage";
import { defaultSettings } from "./entities";

// Save a specific setting
export const updateSettingUseCase = (key, value) => {
  saveSetting(key, value);
};

// Get a specific setting, fallback to default
export const getSettingUseCase = (key) => {
  return getSetting(key, defaultSettings[key]);
};

// Load all settings
export const loadAllSettingsUseCase = () => {
  const settings = {};
  for (const key in defaultSettings) {
    settings[key] = getSetting(key, defaultSettings[key]);
  }
  return settings;
};
