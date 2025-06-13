// src/presentation/settings/sections/VisualSettings.js

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VisualSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [retroFilter, setRetroFilter] = useState(false);
  const [theme, setTheme] = useState("Neon");
  const [resolution, setResolution] = useState("Fit to Screen");
  const [cursorStyle, setCursorStyle] = useState("Crosshair");

  return (
    <div className="settings-section">
      <div className="settings-header" onClick={() => setIsOpen(!isOpen)}>
        <h3>🎨 Visual Settings</h3>
        <span>{isOpen ? "▲" : "▼"}</span>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="settings-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Retro Filter */}
            <div className="setting-item">
              <label>Retro Filter:</label>
              <input
                type="checkbox"
                checked={retroFilter}
                onChange={() => setRetroFilter(!retroFilter)}
              />
            </div>

            {/* Theme */}
            <div className="setting-item">
              <label>Theme:</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option>Neon</option>
                <option>Dark Pixel</option>
                <option>High Contrast</option>
              </select>
            </div>

            {/* Resolution */}
            <div className="setting-item">
              <label>Resolution:</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
              >
                <option>Fit to Screen</option>
                <option>Fixed Pixel Mode</option>
              </select>
            </div>

            {/* Cursor Style */}
            <div className="setting-item">
              <label>Cursor Style:</label>
              <select
                value={cursorStyle}
                onChange={(e) => setCursorStyle(e.target.value)}
              >
                <option>Crosshair</option>
                <option>Fist</option>
                <option>Classic</option>
                <option>Neon Dot</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
