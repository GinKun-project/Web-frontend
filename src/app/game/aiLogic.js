export function getAIIntent(ai, player) {
  const distance = player.position.x - ai.position.x;
  const inRange = Math.abs(distance) < 80;

  const moveLeft = distance < -10;
  const moveRight = distance > 10;

  const shouldAttack = inRange;

  return {
    moveLeft,
    moveRight,
    shouldAttack
  };
}
