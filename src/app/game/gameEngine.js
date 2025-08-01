import { getPlayerIntent } from './inputManager';
import { getAIIntent } from './aiLogic';
import { drawBackground, drawFightingGameUI } from '../../infrastructure/canvas/canvasRenderer';
import { rectangularCollision, detectDirection } from '../../infrastructure/canvas/collisionUtils';

export function runGameFrame({ ctx, canvas, player, enemy, keys, health, timer = '03:30', handleCriticalHit }) {
  drawBackground(ctx, canvas);

  const playerIntent = getPlayerIntent(keys);
  const aiIntent = getAIIntent(enemy, player);

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // Player movement and attacks
  if (playerIntent.moveLeft && player.position.x > 80) player.velocity.x = -6;
  if (playerIntent.moveRight && player.position.x < canvas.width - 150) player.velocity.x = 6;
  if (playerIntent.attack) {
    player.attack();
    if (player.isAttacking && rectangularCollision(player.attackBox, enemy)) {
      if (handleCriticalHit) {
        handleCriticalHit(player, enemy, true);
      } else {
        enemy.takeHit(15 + Math.floor(Math.random() * 10)); // 15-25 damage
      }
      health.enemy = enemy.health;
    }
  }

  // Enhanced AI movement with intelligent dodging
  if (aiIntent.moveLeft && enemy.position.x > 80) {
    enemy.velocity.x = -5 - Math.random() * 3; // Variable speed between -5 and -8
  }
  if (aiIntent.moveRight && enemy.position.x < canvas.width - 150) {
    enemy.velocity.x = 5 + Math.random() * 3; // Variable speed between 5 and 8
  }
  
  // AI attacks with critical hit system
  if (aiIntent.shouldAttack) {
    enemy.attack();
    if (enemy.isAttacking && rectangularCollision(enemy.attackBox, player)) {
      if (handleCriticalHit) {
        handleCriticalHit(enemy, player, false);
      } else {
        player.takeHit(15 + Math.floor(Math.random() * 10)); // 15-25 damage
      }
      health.player = player.health;
    }
  }

  detectDirection(player, enemy);
  detectDirection(enemy, player);

  player.update(ctx);
  enemy.update(ctx);

  drawFightingGameUI(ctx, canvas, health.player, health.enemy, timer);
}
