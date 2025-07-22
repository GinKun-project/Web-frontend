import { getPlayerIntent } from './inputManager';
import { getAIIntent } from './aiLogic';
import { drawBackground, drawHealthBar } from '../../infrastructure/canvas/canvasRenderer';
import { rectangularCollision, detectDirection } from '../../infrastructure/canvas/collisionUtils';

export function runGameFrame({ ctx, canvas, player, enemy, keys, health }) {
  drawBackground(ctx, canvas);

  const playerIntent = getPlayerIntent(keys);
  const aiIntent = getAIIntent(enemy, player);

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (playerIntent.moveLeft) player.velocity.x = -5;
  if (playerIntent.moveRight) player.velocity.x = 5;
  if (playerIntent.attack) {
    player.attack();
    if (player.isAttacking && rectangularCollision(player.attackBox, enemy)) {
      enemy.takeHit(10);
      health.enemy = enemy.health;
    }
  }

  if (aiIntent.moveLeft) enemy.velocity.x = -2;
  if (aiIntent.moveRight) enemy.velocity.x = 2;
  if (aiIntent.shouldAttack) {
    enemy.attack();
    if (enemy.isAttacking && rectangularCollision(enemy.attackBox, player)) {
      player.takeHit(10);
      health.player = player.health;
    }
  }

  detectDirection(player, enemy);
  detectDirection(enemy, player);

  player.update(ctx);
  enemy.update(ctx);

  drawHealthBar(ctx, 50, 50, 200, 20, health.player, 'red');
  drawHealthBar(ctx, canvas.width - 250, 50, 200, 20, health.enemy, 'green');
}
