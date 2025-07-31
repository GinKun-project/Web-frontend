import { authApi } from "../../data/auth/authApi";
import { saveSetting, getSetting } from "../../infrastructure/storage/settingsStorage";


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

export const logoutUseCase = async () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    await authApi.logout(token);
  }
};

// === Settings Use Cases ===

export function updateSettingUseCase(key, value) {
  saveSetting(key, value);
}

export function getSettingUseCase(key, defaultValue = null) {
  return getSetting(key, defaultValue);
}
