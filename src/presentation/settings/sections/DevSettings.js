import React, { useState } from "react";
import "../../../styles/Settings.css";

export default function DevSettings() {
  const [debugLogs, setDebugLogs] = useState(false);

  const handleForceWin = () => {
    console.log("🚀 Simulated Win");
    // You can dispatch game state here later
  };

  const handleForceLoss = () => {
    console.log("💀 Simulated Loss");
  };

  return (
    <div className="dev-settings-body">
      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={debugLogs}
            onChange={() => setDebugLogs(!debugLogs)}
          />
          Enable Debug Logs
        </label>
      </div>

      <div className="setting-item">
        <button className="user-btn edit-btn" onClick={handleForceWin}>
          Force Win
        </button>
      </div>

      <div className="setting-item">
        <button className="user-btn logout-btn" onClick={handleForceLoss}>
          Force Loss
        </button>
      </div>
    </div>
  );
}
