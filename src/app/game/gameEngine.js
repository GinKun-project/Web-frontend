import { getPlayerIntent } from './inputManager';
import { getAIIntent } from './aiLogic';
import { drawBackground, drawFightingGameUI } from '../../infrastructure/canvas/canvasRenderer';
import { rectangularCollision, detectDirection } from '../../infrastructure/canvas/collisionUtils';

export function runGameFrame({ ctx, canvas, player, enemy, keys, health, timer = '03:30' }) {
  drawBackground(ctx, canvas);

  const playerIntent = getPlayerIntent(keys);
  const aiIntent = getAIIntent(enemy, player);

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (playerIntent.moveLeft && player.position.x > 80) player.velocity.x = -6;
  if (playerIntent.moveRight && player.position.x < canvas.width - 150) player.velocity.x = 6;
  if (playerIntent.attack) {
    player.attack();
    if (player.isAttacking && rectangularCollision(player.attackBox, enemy)) {
      enemy.takeHit(10);
      health.enemy = enemy.health;
    }
  }

  // Enhanced AI movement with variable speed
  if (aiIntent.moveLeft && enemy.position.x > 80) {
    enemy.velocity.x = -4 - Math.random() * 2; // Variable speed between -4 and -6
  }
  if (aiIntent.moveRight && enemy.position.x < canvas.width - 150) {
    enemy.velocity.x = 4 + Math.random() * 2; // Variable speed between 4 and 6
  }
  if (aiIntent.shouldAttack) {
    enemy.attack();
    if (enemy.isAttacking && rectangularCollision(enemy.attackBox, player)) {
      player.takeHit(10);
      health.player = player.health;
    }
  }

  detectDirection(player, enemy);
  detectDirection(enemy, player);

  console.log('Player position:', player.position, 'Enemy position:', enemy.position);
  player.update(ctx);
  enemy.update(ctx);

  drawFightingGameUI(ctx, canvas, health.player, health.enemy, timer);
}
