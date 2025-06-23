import { authApi } from "../../data/auth/authApi";
import { saveSetting, getSetting } from "../../infrastructure/storage/settingsStorage";

// Auth Use Cases
export const signupUseCase = async (data) => {
  return await authApi.signup(data);
};

export const loginUseCase = async (data) => {
  return await authApi.login(data);
};

// === Settings Use Cases ===

// Save a setting (e.g., audio volume, difficulty, theme)
export function updateSettingUseCase(key, value) {
  saveSetting(key, value);
}

// Get a setting with fallback default value
export function getSettingUseCase(key, defaultValue = null) {
  return getSetting(key, defaultValue);
}
