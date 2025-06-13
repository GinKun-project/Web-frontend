
/**
 * Save a setting to localStorage with a namespaced key.
 * @param {string} key - The setting key (e.g., "musicVolume").
 * @param {*} value - The setting value (can be any JSON-safe type).
 */
export const saveSetting = (key, value) => {
  try {
    localStorage.setItem(`sc_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save setting "${key}":`, err);
  }
};

/**
 * Get a setting from localStorage.
 * If not found, return the provided defaultValue.
 * @param {string} key - The setting key.
 * @param {*} defaultValue - A fallback value if setting is missing.
 * @returns {*} - The saved setting or the defaultValue.
 */
export const getSetting = (key, defaultValue = null) => {
  try {
    const stored = localStorage.getItem(`sc_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (err) {
    console.error(`Failed to retrieve setting "${key}":`, err);
    return defaultValue;
  }
};
