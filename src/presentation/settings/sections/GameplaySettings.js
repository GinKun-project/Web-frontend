import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveSetting, getSetting } from "../../../infrastructure/storage/settingsStorage";

export default function GameplaySettings() {
  const [open, setOpen] = useState(true);

  const [difficulty, setDifficulty] = useState("Normal");
  const [controlScheme, setControlScheme] = useState("WASD");
  const [rounds, setRounds] = useState("Best of 3");

  // Load settings on mount
  useEffect(() => {
    setDifficulty(getSetting("gameplay_difficulty", "Normal"));
    setControlScheme(getSetting("gameplay_control", "WASD"));
    setRounds(getSetting("gameplay_rounds", "Best of 3"));
  }, []);

  // Save settings on change
  useEffect(() => {
    saveSetting("gameplay_difficulty", difficulty);
    saveSetting("gameplay_control", controlScheme);
    saveSetting("gameplay_rounds", rounds);
  }, [difficulty, controlScheme, rounds]);

  return (
    <div className="settings-section">
      <div className="section-header" onClick={() => setOpen(!open)}>
        <h3>🧠 Gameplay Settings</h3>
        <span>{open ? "▲" : "▼"}</span>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="section-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="setting-item">
              <label>Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option>Easy</option>
                <option>Normal</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="setting-item">
              <label>Player Control</label>
              <select value={controlScheme} onChange={(e) => setControlScheme(e.target.value)}>
                <option>WASD</option>
                <option>Arrow Keys</option>
                <option>Custom</option>
              </select>
            </div>

            <div className="setting-item">
              <label>Rounds Per Match</label>
              <select value={rounds} onChange={(e) => setRounds(e.target.value)}>
                <option>Best of 1</option>
                <option>Best of 3</option>
                <option>Best of 5</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
