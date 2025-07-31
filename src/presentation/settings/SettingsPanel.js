import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameplaySettings from "./sections/GameplaySettings";
import VisualSettings from "./sections/VisualSettings";
import AudioSettings from "./sections/AudioSettings";
import UserSettings from "./sections/UserSettings";
import DevSettings from "./sections/DevSettings";
import {
  loadAllSettingsUseCase,
  updateAllSettingsUseCase,
  resetSettingsUseCase,
} from "../../domain/settings/usecases";
import "../../styles/Settings.css";

export default function SettingsPanel({ user, onLogout }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const sections = [
    { title: "🧠 Gameplay", Component: GameplaySettings },
    { title: "🎨 Visual", Component: VisualSettings },
    { title: "🔊 Audio", Component: AudioSettings },
    { title: "👤 User", Component: () => <UserSettings user={user} onLogout={onLogout} /> },
    { title: "🧪 Developer", Component: DevSettings },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const loadedSettings = await loadAllSettingsUseCase();
      setSettings(loadedSettings);
    } catch (error) {
      console.error("Error loading settings:", error);
      if (error.message?.includes("Authentication required")) {
        setMessage("Authentication required. Please log in again.");
        setTimeout(() => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          window.location.href = "/";
        }, 2000);
      } else {
        setMessage("Failed to load settings");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      await updateAllSettingsUseCase(settings);
      setMessage("Settings saved successfully! ✅");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage("Failed to save settings ❌");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setSaving(true);
      setMessage("");
      const resetSettings = await resetSettingsUseCase();
      setSettings(resetSettings);
      setMessage("Settings reset to defaults! 🔄");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error resetting settings:", error);
      setMessage("Failed to reset settings ❌");
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="settings-panel">
        <h2 className="settings-title">⚙️ Settings</h2>
        <div className="loading-message">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="settings-panel">
      <h2 className="settings-title">⚙️ Settings</h2>

      {message && (
        <div className={`settings-message ${message.includes('✅') ? 'success' : message.includes('❌') ? 'error' : 'info'}`}>
          {message}
        </div>
      )}

      {sections.map(({ title, Component }, index) => (
        <div key={title} className="settings-section">
          <div
            className={`settings-section-header ${openIndex === index ? "open" : ""}`}
            onClick={() => toggleSection(index)}
          >
            {title}
          </div>

          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                className="settings-section-body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Component 
                  settings={settings}
                  onSettingChange={handleSettingChange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <div className="settings-actions">
        <button 
          className="settings-btn reset-btn" 
          onClick={handleReset}
          disabled={saving}
        >
          {saving ? "Resetting..." : "🔄 Reset to Defaults"}
        </button>
        <button 
          className="settings-btn save-btn" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "💾 Save Settings"}
        </button>
      </div>
    </div>
  );
}
