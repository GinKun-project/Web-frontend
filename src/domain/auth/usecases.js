import { authApi } from "../../data/auth/authApi";
import { saveSetting, getSetting } from "../../infrastructure/storage/settingsStorage";

// ✅ Updated Auth Use Cases to ensure correct JSON format
export const signupUseCase = async ({ username, email, password }) => {
  return await authApi.signup({
    username,
    email,
    password
  });
};

export const loginUseCase = async ({ email, password }) => {
  return await authApi.login({
    email,
    password
  });
};

// === Settings Use Cases ===

export function updateSettingUseCase(key, value) {
  saveSetting(key, value);
}

export function getSettingUseCase(key, defaultValue = null) {
  return getSetting(key, defaultValue);
}
