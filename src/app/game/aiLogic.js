export function getAIIntent(ai, player) {
  const distance = player.position.x - ai.position.x;
  const absDistance = Math.abs(distance);
  const inAttackRange = absDistance < 100;
  
  // AI state management
  if (!ai.aiState) {
    ai.aiState = {
      lastAttackTime: 0,
      lastDirectionChange: 0,
      currentStrategy: 'aggressive',
      aggressionLevel: 1.0, // always max
      attackCooldown: 300, // very short cooldown
      movementPattern: 'aggressive'
    };
  }
  
  const now = Date.now();
  const timeSinceLastAttack = now - ai.aiState.lastAttackTime;
  const timeSinceDirectionChange = now - ai.aiState.lastDirectionChange;
  
  // Always aggressive
  ai.aiState.currentStrategy = 'aggressive';
  ai.aiState.aggressionLevel = 1.0;

  // Movement logic: always try to close distance
  let moveLeft = false;
  let moveRight = false;
  let shouldAttack = false;

  if (absDistance > 60) {
    moveLeft = distance < 0;
    moveRight = distance > 0;
  } else {
    // In close range, sometimes reposition
    moveLeft = distance > 30;
    moveRight = distance < -30;
  }

  // Add some randomness to movement
  if (Math.random() < 0.15 && timeSinceDirectionChange > 500) {
    if (Math.random() < 0.5) {
      moveLeft = !moveLeft;
      moveRight = !moveRight;
    }
    ai.aiState.lastDirectionChange = now;
  }

  // Attack logic: very high chance to attack when in range
  if (inAttackRange && timeSinceLastAttack > ai.aiState.attackCooldown) {
    shouldAttack = Math.random() < 0.95; // 95% chance to attack
    if (shouldAttack) {
      ai.aiState.lastAttackTime = now;
      ai.aiState.attackCooldown = 200 + Math.random() * 200; // 200-400ms
    }
  }

  // Counter-attack when player is attacking
  if (player.isAttacking && absDistance < 120) {
    if (Math.random() < 0.7 && timeSinceLastAttack > 200) {
      shouldAttack = true;
      ai.aiState.lastAttackTime = now;
    }
  }

  // Evasive maneuvers when player is attacking
  if (player.isAttacking && absDistance < 100) {
    if (Math.random() < 0.2) {
      moveLeft = distance > 0;
      moveRight = distance < 0;
    }
  }

  return {
    moveLeft,
    moveRight,
    shouldAttack
  };
}
