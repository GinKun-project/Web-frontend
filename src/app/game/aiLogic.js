export function getAIIntent(ai, player) {
  const distance = player.position.x - ai.position.x;
  const absDistance = Math.abs(distance);
  const inAttackRange = absDistance < 80;
  const safeDistance = 120;
  
  // AI state management
  if (!ai.aiState) {
    ai.aiState = {
      lastAttackTime: 0,
      lastDirectionChange: 0,
      lastDodgeTime: 0,
      currentStrategy: 'balanced',
      aggressionLevel: 0.7,
      attackCooldown: 400,
      movementPattern: 'intelligent',
      healthThreshold: 0.3, // 30% HP threshold for defensive behavior
      dodgeCooldown: 800
    };
  }
  
  const now = Date.now();
  const timeSinceLastAttack = now - ai.aiState.lastAttackTime;
  const timeSinceDirectionChange = now - ai.aiState.lastDirectionChange;
  const timeSinceLastDodge = now - ai.aiState.lastDodgeTime;
  
  // Dynamic strategy based on health
  const healthPercentage = ai.health / 200; // Assuming max HP is 200
  if (healthPercentage < ai.aiState.healthThreshold) {
    ai.aiState.currentStrategy = 'defensive';
    ai.aiState.aggressionLevel = 0.3;
  } else if (healthPercentage > 0.7) {
    ai.aiState.currentStrategy = 'aggressive';
    ai.aiState.aggressionLevel = 0.9;
  } else {
    ai.aiState.currentStrategy = 'balanced';
    ai.aiState.aggressionLevel = 0.7;
  }

  let moveLeft = false;
  let moveRight = false;
  let shouldAttack = false;

  // Intelligent movement based on strategy
  if (ai.aiState.currentStrategy === 'defensive') {
    // Defensive: Keep distance and dodge
    if (absDistance < safeDistance) {
      moveLeft = distance > 0;
      moveRight = distance < 0;
    } else if (absDistance > safeDistance + 50) {
      // Too far, move closer
      moveLeft = distance < 0;
      moveRight = distance > 0;
    }
  } else if (ai.aiState.currentStrategy === 'aggressive') {
    // Aggressive: Close distance and attack
    if (absDistance > 60) {
      moveLeft = distance < 0;
      moveRight = distance > 0;
    } else {
      // In close range, reposition for better angles
      moveLeft = distance > 20;
      moveRight = distance < -20;
    }
  } else {
    // Balanced: Mix of both
    if (absDistance > 80) {
      moveLeft = distance < 0;
      moveRight = distance > 0;
    } else if (absDistance < 40) {
      moveLeft = distance > 0;
      moveRight = distance < 0;
    }
  }

  // Enhanced dodging system
  if (player.isAttacking && absDistance < 100 && timeSinceLastDodge > ai.aiState.dodgeCooldown) {
    const dodgeChance = ai.aiState.currentStrategy === 'defensive' ? 0.8 : 0.4;
    if (Math.random() < dodgeChance) {
      // Dodge away from player
      moveLeft = distance > 0;
      moveRight = distance < 0;
      ai.aiState.lastDodgeTime = now;
      ai.aiState.dodgeCooldown = 600 + Math.random() * 400; // 600-1000ms
    }
  }

  // Intelligent attack patterns
  if (inAttackRange && timeSinceLastAttack > ai.aiState.attackCooldown) {
    const attackChance = ai.aiState.aggressionLevel * 0.8; // 24% to 72% based on strategy
    shouldAttack = Math.random() < attackChance;
    
    if (shouldAttack) {
      ai.aiState.lastAttackTime = now;
      ai.aiState.attackCooldown = 300 + Math.random() * 300; // 300-600ms
    }
  }

  // Counter-attack opportunities
  if (player.isAttacking && absDistance < 90 && timeSinceLastAttack > 200) {
    const counterChance = ai.aiState.aggressionLevel * 0.6;
    if (Math.random() < counterChance) {
      shouldAttack = true;
      ai.aiState.lastAttackTime = now;
    }
  }

  // Tactical repositioning
  if (timeSinceDirectionChange > 1000 && Math.random() < 0.3) {
    if (ai.aiState.currentStrategy === 'defensive') {
      // Move to safer position
      moveLeft = ai.position.x < 800; // Approximate screen center
      moveRight = ai.position.x > 800;
    } else {
      // Move to better attack position
      moveLeft = distance > 0;
      moveRight = distance < 0;
    }
    ai.aiState.lastDirectionChange = now;
  }

  return {
    moveLeft,
    moveRight,
    shouldAttack
  };
}
