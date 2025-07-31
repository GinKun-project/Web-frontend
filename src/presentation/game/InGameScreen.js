import React, { useEffect, useRef, useState } from "react";
import "../../styles/InGame.css";
import { useNavigate } from "react-router-dom";

export default function InGameScreen() {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = muted;
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [muted]);

  const handleSelectMode = (mode) => {
    if (mode === "Vs AI") {
      navigate("/vsai");
    } else {
      alert(`Selected Mode: ${mode}`);
    }
  };

  return (
    <div className="ingame-container" style={{ position: 'relative' }}>
      <audio
        ref={audioRef}
        src="/sound/bg-music.wav"
        autoPlay
        loop
        style={{ display: 'none' }}
      />
      <button
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          zIndex: 2000,
          fontSize: 18,
          padding: '8px 16px',
          borderRadius: 6,
          border: 'none',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          cursor: 'pointer'
        }}
        onClick={() => setMuted(m => !m)}
      >
        {muted ? 'Unmute Music' : 'Mute Music'}
      </button>
      
      <button
        style={{
          position: 'absolute',
          bottom: 20,
          right: 200,
          zIndex: 2000,
          fontSize: 18,
          padding: '8px 16px',
          borderRadius: 6,
          border: 'none',
          background: 'rgba(59, 130, 246, 0.8)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onClick={() => navigate("/achievements")}
      >
        🏆 Achievements
      </button>
      <div className="ingame-header">
        <h1 className="ingame-title">⚔️ Choose Your Game Mode</h1>
      </div>
      <div className="ingame-main">
        <div className="ingame-arena">
          <button className="ingame-btn" onClick={() => handleSelectMode("Vs AI")}>Vs AI</button>
        </div>
      </div>
      <div className="ad-box">
        <h3>🔥 Welcome to Shadow Clash!</h3>
        <div className="ad-slide" style={{ animationDelay: "0s" }}>
          <p>⚔️ Enter the arena.</p>
        </div>
        <div className="ad-slide" style={{ animationDelay: "4s" }}>
          <p>🎮 Compete in intense PvP combat.</p>
        </div>
        <div className="ad-slide" style={{ animationDelay: "8s" }}>
          <p>🏆 Unlock achievements and earn rewards.</p>
        </div>
        <div className="ad-slide" style={{ animationDelay: "12s" }}>
          <p>👾 More maps, heroes & powers coming soon!</p>
        </div>
      </div>
    </div>
  );
}
