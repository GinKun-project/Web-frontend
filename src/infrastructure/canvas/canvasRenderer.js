export function drawBackground(ctx, canvas) {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawHealthBar(ctx, x, y, width, height, percent, color) {
  const filledWidth = Math.max(0, width * (percent / 100));
  ctx.fillStyle = 'gray';
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, filledWidth, height);
}
