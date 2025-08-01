import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fighter } from '../../domain/game/entities/fighter';
import { useInputHandler } from '../../hooks/useInputHandler';
import { useGameLoop } from '../../hooks/useGameLoop';
import { runGameFrame } from '../../app/game/gameEngine';
import { checkAndUpdateAchievementsUseCase } from '../../domain/achievements/usecases';
import { gameStatsApi } from '../../data/gameStats/gameStatsApi';
import playerImg from '../../assets/player.png';
import enemyImg from '../../assets/enemy.png';
import '../../styles/VsAi.css';

export default function VsAiGameScreen() {
  const canvasRef = useRef(null);
  const playerRef = useRef();
  const enemyRef = useRef();
  const keys = useInputHandler();
  const playerHealth = useRef(200); 
  const enemyHealth = useRef(200); 
  const navigate = useNavigate();
  const [gameTimer, setGameTimer] = useState(210);
  const [isPaused, setIsPaused] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);
  
  // Game stats for achievements
  const gameStats = useRef({
    wins: 0,
    aiWins: 0,
    perfectWins: 0,
    totalMatches: 0,
    fastestWin: null,
    comebackWins: 0,
    criticalHits: 0,
    damageDealt: 0,
    damageTaken: 0,
    matchStartTime: Date.now()
  });
  
  // Critical hit display
  const [criticalHitDisplay, setCriticalHitDisplay] = useState(null);
  const [showCriticalHit, setShowCriticalHit] = useState(false);

  // Function to handle critical hits
  const handleCriticalHit = (attacker, target, isPlayerAttacking) => {
    const criticalChance = 0.15; // 15% chance for critical hit
    const isCritical = Math.random() < criticalChance;
    
    if (isCritical) {
      const criticalDamage = Math.floor(target.health * 0.4); // 40% of current HP
      target.takeHit(criticalDamage);
      
      // Update game stats
      gameStats.current.criticalHits++;
      if (isPlayerAttacking) {
        gameStats.current.damageDealt += criticalDamage;
      } else {
        gameStats.current.damageTaken += criticalDamage;
      }
      
      // Show critical hit display
      setCriticalHitDisplay({
        x: target.position.x + (target.width * target.scale) / 2,
        y: target.position.y - 50,
        damage: criticalDamage,
        isPlayer: isPlayerAttacking
      });
      setShowCriticalHit(true);
      
      // Hide critical hit display after 2 seconds
      setTimeout(() => {
        setShowCriticalHit(false);
        setCriticalHitDisplay(null);
      }, 2000);
      
      return criticalDamage;
    } else {
      // Normal damage
      const normalDamage = 15 + Math.floor(Math.random() * 10); // 15-25 damage
      target.takeHit(normalDamage);
      
      // Update game stats
      if (isPlayerAttacking) {
        gameStats.current.damageDealt += normalDamage;
      } else {
        gameStats.current.damageTaken += normalDamage;
      }
      
      return normalDamage;
    }
  };

  useEffect(() => {
    const initGame = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setTimeout(initGame, 50);
        return;
      }
      
      // Set canvas to full window size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Calculate proper character dimensions
      const baseWidth = 50;
      const baseHeight = 150;
      const scale = 0.3; 
      const charWidth = baseWidth * scale;
      const charHeight = baseHeight * scale;
      
      // Calculate ground level - leave more margin from bottom for smaller characters
      const groundLevel = canvas.height - charHeight - 80; 
      
      // Calculate character positions with proper spacing
      const gap = 120; 
      const initialPlayerX = canvas.width / 2 - charWidth - gap;
      const initialEnemyX = canvas.width / 2 + gap;
      
      // Ensure characters are within screen bounds
      const margin = 60; 
      const finalPlayerX = Math.max(margin, Math.min(initialPlayerX, canvas.width - charWidth - margin));
      const finalEnemyX = Math.max(margin, Math.min(initialEnemyX, canvas.width - charWidth - margin));
      
      const player = new Fighter({
        position: { x: finalPlayerX, y: groundLevel },
        velocity: { x: 0, y: 0 },
        imageSrc: playerImg,
        scale: scale,
        framesMax: 1,
        attackBox: { offset: { x: 14, y: 0 }, width: 28, height: 14 }
      });
      
      const enemy = new Fighter({
        position: { x: finalEnemyX, y: groundLevel },
        velocity: { x: 0, y: 0 },
        imageSrc: enemyImg,
        scale: scale,
        framesMax: 1,
        attackBox: { offset: { x: -28, y: 0 }, width: 28, height: 14 }
      });
      
      playerRef.current = player;
      enemyRef.current = enemy;
      setIsInitialized(true);
    };
    setTimeout(initGame, 100);
    setTimeout(() => {
      if (!isInitialized) {
        setIsInitialized(true);
      }
    }, 3000);
  }, [isInitialized]);

  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !playerRef.current || !enemyRef.current) return;
      
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Recalculate ground level with proper margin
      const charHeight = 150 * 0.3; // Use the same scale as initialization
      const groundLevel = canvas.height - charHeight - 80; // 80px margin from bottom
      
      // Update character Y positions
      playerRef.current.position.y = groundLevel;
      enemyRef.current.position.y = groundLevel;
      
      // Ensure characters stay within screen bounds
      const charWidth = playerRef.current.width * playerRef.current.scale;
      const margin = 60; // Increased margin from screen edges
      
      // Constrain player position
      if (playerRef.current.position.x < margin) {
        playerRef.current.position.x = margin;
      }
      if (playerRef.current.position.x > canvas.width - charWidth - margin) {
        playerRef.current.position.x = canvas.width - charWidth - margin;
      }
      
      // Constrain enemy position
      if (enemyRef.current.position.x < margin) {
        enemyRef.current.position.x = margin;
      }
      if (enemyRef.current.position.x > canvas.width - charWidth - margin) {
        enemyRef.current.position.x = canvas.width - charWidth - margin;
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isInitialized || isPaused || gameTimer <= 0) return;
    const timer = setInterval(() => {
      setGameTimer(prev => {
        if (prev <= 1) {
          if (playerHealth.current > enemyHealth.current) {
            alert('Time\'s up! Player wins!');
          } else if (enemyHealth.current > playerHealth.current) {
            alert('Time\'s up! Enemy wins!');
          } else {
            alert('Time\'s up! It\'s a draw!');
          }
          navigate('/ingame');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isInitialized, isPaused, gameTimer, navigate]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        setIsPaused(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

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

  useGameLoop(async () => {
    if (isPaused || !isInitialized) return;
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    const player = playerRef.current;
    const enemy = enemyRef.current;
    if (!player || !enemy) {
      return;
    }
    
    const minutes = Math.floor(gameTimer / 60);
    const seconds = gameTimer % 60;
    const timerString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Enhanced game frame with critical hit system
    runGameFrame({
      ctx,
      canvas,
      player,
      enemy,
      keys: keys.current,
      health: {
        player: playerHealth.current,
        enemy: enemyHealth.current
      },
      timer: timerString,
      handleCriticalHit: handleCriticalHit
    });
    
    playerHealth.current = player.health;
    enemyHealth.current = enemy.health;
    
    // Check for game end and update achievements
    if (!isPaused) {
      if (enemy.health <= 0) {
        setIsPaused(true);
        
        // Update game stats for achievements
        gameStats.current.wins++;
        gameStats.current.totalMatches++;
        
        // Check for perfect win (no damage taken)
        if (playerHealth.current >= 180) { // 90% HP remaining
          gameStats.current.perfectWins++;
        }
        
        // Check for fastest win
        const matchDuration = (Date.now() - gameStats.current.matchStartTime) / 1000;
        if (!gameStats.current.fastestWin || matchDuration < gameStats.current.fastestWin) {
          gameStats.current.fastestWin = matchDuration;
        }
        
        // Check for comeback win (was below 50% HP)
        if (playerHealth.current < 100) {
          gameStats.current.comebackWins++;
        }
        
        // Update achievements and game stats
        try {
          // Update backend game stats
          await gameStatsApi.updateGameStats(gameStats.current);
          
          // Check for new achievements
          const newAchievements = await checkAndUpdateAchievementsUseCase(gameStats.current);
          if (newAchievements.length > 0) {
            console.log('New achievements unlocked:', newAchievements);
          }
        } catch (error) {
          console.error('Error updating game stats:', error);
        }
        
        setTimeout(() => {
          alert('You Win!');
          navigate('/ingame');
        }, 1500);
      } else if (player.health <= 0) {
        setIsPaused(true);
        
        // Update game stats for achievements
        gameStats.current.aiWins++;
        gameStats.current.totalMatches++;
        
        // Update achievements and game stats
        try {
          // Update backend game stats
          await gameStatsApi.updateGameStats(gameStats.current);
          
          // Check for new achievements
          const newAchievements = await checkAndUpdateAchievementsUseCase(gameStats.current);
          if (newAchievements.length > 0) {
            console.log('New achievements unlocked:', newAchievements);
          }
        } catch (error) {
          console.error('Error updating game stats:', error);
        }
        
        setTimeout(() => {
          alert('You Lose!');
          navigate('/ingame');
        }, 1500);
      }
    }
  });

  if (!isInitialized) {
    return (
      <div 
        className="vsai-wrapper"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          width: '100vw',
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ textAlign: 'center', color: 'white', fontFamily: 'monospace', fontSize: 24 }}>
          <div>Loading Game...</div>
          <div style={{ fontSize: '14px', marginTop: '10px' }}>
            Initializing characters and game engine...
          </div>
          <div style={{ fontSize: '12px', marginTop: '20px', opacity: '0.7' }}>
            Canvas: {canvasRef.current ? 'Ready' : 'Not Ready'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="vsai-wrapper"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div 
        className="controls-overlay"
        style={{
          position: 'absolute',
          top: '60px',
          left: '20px',
          zIndex: 1000,
          padding: '10px 15px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          color: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '6px',
          fontFamily: 'monospace',
          fontSize: '10px',
          lineHeight: '1.3',
          backdropFilter: 'blur(3px)',
          transition: 'opacity 0.3s ease',
          maxWidth: '150px'
        }}
        onMouseEnter={(e) => {
          e.target.style.opacity = '1';
          e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = '0.8';
          e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '11px' }}>CONTROLS</div>
        <div style={{ marginBottom: '3px' }}>← → Move</div>
        <div style={{ marginBottom: '3px' }}>A/D Move</div>
        <div style={{ marginBottom: '3px' }}>SPACE Attack</div>
        <div style={{ marginTop: '6px', fontSize: '9px', opacity: 0.7 }}>
          ESC Pause
        </div>
      </div>
             {/* Background gradient for better visibility */}
       <div 
         style={{
           position: 'absolute',
           top: 0,
           left: 0,
           width: '100%',
           height: '100%',
           background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
           pointerEvents: 'none',
           zIndex: 1
         }}
       />
       {/* Arena background for better character visibility */}
       <div 
         style={{
           position: 'absolute',
           top: 0,
           left: 0,
           width: '100%',
           height: '100%',
           background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, transparent 50%, rgba(0, 0, 0, 0.2) 100%)',
           pointerEvents: 'none',
           zIndex: 1
         }}
       />
      {/* Ground platform visualization */}
      <div 
        style={{
          position: 'absolute',
          bottom: 80,
          left: 0,
          width: '100%',
          height: '4px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 20%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0.3) 80%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 2,
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.4)'
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '20%',
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 2
        }}
      />
      <canvas 
        ref={canvasRef} 
        className="vsai-canvas" 
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ 
          zIndex: 3,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh'
        }} 
      />
      <div 
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          padding: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          fontFamily: 'monospace',
          fontSize: '12px',
          borderRadius: '5px'
        }}
      >
        <div>Game Status: {isInitialized ? 'Running' : 'Loading'}</div>
        <div>Timer: {Math.floor(gameTimer / 60)}:{(gameTimer % 60).toString().padStart(2, '0')}</div>
        <div>Player HP: {playerHealth.current}</div>
        <div>Enemy HP: {enemyHealth.current}</div>
        <div>Player Pos: ({Math.round(playerRef.current?.position.x || 0)}, {Math.round(playerRef.current?.position.y || 0)})</div>
        <div>Enemy Pos: ({Math.round(enemyRef.current?.position.x || 0)}, {Math.round(enemyRef.current?.position.y || 0)})</div>
        <div>Canvas: {canvasRef.current?.width || 0} x {canvasRef.current?.height || 0}</div>
                 <div>AI Strategy: {enemyRef.current?.aiState?.currentStrategy || 'Unknown'}</div>
         <div>AI Aggression: {enemyRef.current?.aiState?.aggressionLevel ? Math.round(enemyRef.current.aiState.aggressionLevel * 100) + '%' : 'Unknown'}</div>
         <div>Critical Hits: {gameStats.current.criticalHits}</div>
         <div>Damage Dealt: {gameStats.current.damageDealt}</div>
         <div>Damage Taken: {gameStats.current.damageTaken}</div>
       </div>
       
       {/* Critical Hit Display */}
       {showCriticalHit && criticalHitDisplay && (
         <div 
           style={{
             position: 'absolute',
             left: criticalHitDisplay.x - 100,
             top: criticalHitDisplay.y,
             zIndex: 1001,
             color: '#ff4444',
             fontFamily: 'monospace',
             fontSize: '24px',
             fontWeight: 'bold',
             textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
             animation: 'criticalHitAnimation 2s ease-out forwards',
             pointerEvents: 'none'
           }}
         >
           <div style={{ textAlign: 'center' }}>
             <div style={{ color: '#ff0000', fontSize: '20px', marginBottom: '5px' }}>
               CRITICAL HIT!
             </div>
             <div style={{ color: '#ffaa00', fontSize: '18px' }}>
               -{criticalHitDisplay.damage}
             </div>
           </div>
         </div>
       )}
      {isPaused && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            color: 'white',
            fontFamily: 'monospace',
            fontSize: '48px',
            fontWeight: 'bold'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>PAUSED</div>
            <div style={{ fontSize: '24px', opacity: 0.8 }}>Press ESC to resume</div>
          </div>
        </div>
      )}
      {isPaused && (playerHealth.current <= 0 || enemyHealth.current <= 0) && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3000,
            color: 'white',
            fontFamily: 'monospace',
            fontSize: '48px',
            fontWeight: 'bold'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
              {playerHealth.current <= 0 ? 'You Lose!' : 'You Win!'}
            </div>
            <div style={{ fontSize: '24px', opacity: 0.8 }}>Returning to menu...</div>
          </div>
        </div>
      )}
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
    </div>
  );
}
