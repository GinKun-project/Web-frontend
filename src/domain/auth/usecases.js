import { authApi } from "../../data/auth/authApi";
import { saveSetting, getSetting } from "../../infrastructure/storage/settingsStorage";

// Auth Use Cases
export async function signupUserUseCase(form) {
  return await authApi.signup(form);
}

export async function loginUserUseCase(username, password) {
  return await authApi.login({ username, password });
}

// === Settings Use Cases ===

// Save a setting (e.g., audio volume, difficulty, theme)
export function updateSettingUseCase(key, value) {
  saveSetting(key, value);
}

// Get a setting with fallback default value
export function getSettingUseCase(key, defaultValue = null) {
  return getSetting(key, defaultValue);
}
