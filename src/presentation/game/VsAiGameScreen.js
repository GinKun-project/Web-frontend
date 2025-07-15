import React, { useEffect, useRef, useState } from "react";
import "../../styles/VsAi.css";

export default function VsAiScreen() {
  const canvasRef = useRef(null);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);

  const player = useRef({ x: 100, y: 300, width: 64, height: 64, speed: 5 });
  const enemy = useRef({ x: 700, y: 300, width: 64, height: 64 });

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    const keys = {};

    const handleKeyDown = (e) => {
      keys[e.key] = true;
      if (e.key === " ") {
        // Attack key
        if (Math.abs(player.current.x - enemy.current.x) < 100) {
          setEnemyHealth((prev) => Math.max(0, prev - 10));
        }
      }
    };

    const handleKeyUp = (e) => {
      keys[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    function drawHealthBars() {
      ctx.fillStyle = "red";
      ctx.fillRect(50, 50, playerHealth * 2, 20);
      ctx.fillStyle = "green";
      ctx.fillRect(canvas.width - 250, 50, enemyHealth * 2, 20);
    }

    function drawCharacters() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Set a visible background color
      ctx.fillStyle = "#222";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw player (placeholder red box)
      ctx.fillStyle = "red";
      ctx.fillRect(player.current.x, player.current.y, player.current.width, player.current.height);

      // Draw enemy (placeholder blue box)
      ctx.fillStyle = "blue";
      ctx.fillRect(enemy.current.x, enemy.current.y, enemy.current.width, enemy.current.height);
    }

    function update() {
      if (keys["ArrowLeft"] || keys["a"]) {
        player.current.x -= player.current.speed;
      }
      if (keys["ArrowRight"] || keys["d"]) {
        player.current.x += player.current.speed;
      }
    }

    function gameLoop() {
      update();
      drawCharacters();
      drawHealthBars();
      requestAnimationFrame(gameLoop);
    }

    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [playerHealth, enemyHealth]);

  return (
    <div className="vsai-wrapper">
      <canvas ref={canvasRef} className="vsai-canvas" style={{ border: '2px solid lime', background: '#222' }} />
    </div>
  );
}
