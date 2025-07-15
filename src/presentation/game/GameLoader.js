import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/GameLoader.css";

export default function GameLoader() {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate("/ingame"), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
  }, [navigate]);

  return (
    <div className="loader-container">
      <h1 className="loader-title">Shadow Clash</h1>
      <div className="loader-bar">
        <div className="loader-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="loader-text">Loading... {progress}%</p>
    </div>
  );
}
