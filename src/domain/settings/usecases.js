import { settingsApi } from "../../data/settings/settingsApi";
import { defaultSettings } from "./entities";

export const updateSettingUseCase = async (key, value) => {
  try {
    const response = await settingsApi.updateSpecificSetting(key, value);
    return response.data;
  } catch (error) {
    console.error("Error updating setting:", error);
    throw error;
  }
};

export const getSettingUseCase = async (key) => {
  try {
    const response = await settingsApi.getSettings();
    return response.data[key] || defaultSettings[key];
  } catch (error) {
    console.error("Error getting setting:", error);
    if (error.message?.includes("authentication")) {
      throw new Error("Authentication required. Please log in again.");
    }
    return defaultSettings[key];
  }
};

export const loadAllSettingsUseCase = async () => {
  try {
    const response = await settingsApi.getSettings();
    return response.data;
  } catch (error) {
    console.error("Error loading settings:", error);
    if (error.message?.includes("authentication")) {
      throw new Error("Authentication required. Please log in again.");
    }
    return defaultSettings;
  }
};

export const updateAllSettingsUseCase = async (settings) => {
  try {
    const response = await settingsApi.updateSettings(settings);
    return response.data;
  } catch (error) {
    console.error("Error updating all settings:", error);
    throw error;
  }
};

export const resetSettingsUseCase = async () => {
  try {
    const response = await settingsApi.resetSettings();
    return response.data;
  } catch (error) {
    console.error("Error resetting settings:", error);
    throw error;
  }
};

export const deleteSettingsUseCase = async () => {
  try {
    const response = await settingsApi.deleteSettings();
    return response.data;
  } catch (error) {
    console.error("Error deleting settings:", error);
    throw error;
  }
};
