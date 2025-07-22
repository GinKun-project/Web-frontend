export function rectangularCollision(rect1, rect2) {
  return (
    rect1.position.x + rect1.width >= rect2.position.x &&
    rect1.position.x <= rect2.position.x + rect2.width &&
    rect1.position.y + rect1.height >= rect2.position.y &&
    rect1.position.y <= rect2.position.y + rect2.height
  );
}

export function detectDirection(source, target) {
  if (source.position.x < target.position.x) {
    source.facing = "right";
  } else {
    source.facing = "left";
  }
}

export function clamp(val, min, max) {
  return Math.max(min, Math.min(val, max));
}
