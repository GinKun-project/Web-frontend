export function getPlayerIntent(keys) {
  return {
    moveLeft: keys['ArrowLeft'] || keys['a'] || false,
    moveRight: keys['ArrowRight'] || keys['d'] || false,
    attack: keys[' '] || false
  };
}
