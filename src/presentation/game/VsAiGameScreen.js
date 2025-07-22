import React, { useRef, useEffect } from 'react';
import { Fighter } from '../../../domain/game/entities/fighter';
import { useInputHandler } from '../../../hooks/useInputHandler';
import { useGameLoop } from '../../../hooks/useGameLoop';
import { runGameFrame } from '../../../app/game/gameEngine';
import playerImg from '../../../assets/player.png';
import enemyImg from '../../../assets/enemy.png';
import '../../../styles/VsAi.css';

export default function VsAiGameScreen() {
  const canvasRef = useRef(null);
  const playerRef = useRef();
  const enemyRef = useRef();
  const keys = useInputHandler();
  const playerHealth = useRef(100);
  const enemyHealth = useRef(100);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const player = new Fighter({
      position: { x: 100, y: 300 },
      velocity: { x: 0, y: 0 },
      imageSrc: playerImg,
      scale: 1,
      framesMax: 1,
      attackBox: { offset: { x: 50, y: 0 }, width: 100, height: 50 }
    });

    const enemy = new Fighter({
      position: { x: 700, y: 300 },
      velocity: { x: 0, y: 0 },
      imageSrc: enemyImg,
      scale: 1,
      framesMax: 1,
      attackBox: { offset: { x: -100, y: 0 }, width: 100, height: 50 }
    });

    playerRef.current = player;
    enemyRef.current = enemy;
  }, []);

  useGameLoop(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const player = playerRef.current;
    const enemy = enemyRef.current;

    if (!player || !enemy) return;

    runGameFrame({
      ctx,
      canvas,
      player,
      enemy,
      keys: keys.current,
      health: {
        player: playerHealth.current,
        enemy: enemyHealth.current
      }
    });
  });

  return (
    <div className="vsai-wrapper">
      <canvas ref={canvasRef} className="vsai-canvas" />
    </div>
  );
}
