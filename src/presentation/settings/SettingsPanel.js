import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameplaySettings from "./sections/GameplaySettings";
import VisualSettings from "./sections/VisualSettings";
import AudioSettings from "./sections/AudioSettings";
import UserSettings from "./sections/UserSettings";
import DevSettings from "./sections/DevSettings";
import "../../styles/Settings.css";

export default function SettingsPanel({ user, onLogout }) {
  const [openIndex, setOpenIndex] = useState(null);

  const sections = [
    { title: "🧠 Gameplay", Component: GameplaySettings },
    { title: "🎨 Visual", Component: VisualSettings },
    { title: "🔊 Audio", Component: AudioSettings },
    { title: "👤 User", Component: () => <UserSettings user={user} onLogout={onLogout} /> },
    { title: "🧪 Developer", Component: DevSettings },
  ];

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="settings-panel">
      <h2 className="settings-title">⚙️ Settings</h2>

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
                <Component />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
