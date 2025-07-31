export function drawBackground(ctx, canvas) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(0.5, '#16213e');
  gradient.addColorStop(1, '#0f3460');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add some grid lines for visual effect
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  
  const gridSize = 50;
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  
  // Draw ground platform
  const groundY = canvas.height - 75;
  ctx.fillStyle = 'rgba(139, 69, 19, 0.8)';
  ctx.fillRect(0, groundY, canvas.width, 75);
  
  // Add some ground details
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(canvas.width, groundY);
  ctx.stroke();
}

export function drawHealthBar(ctx, x, y, width, height, percent, color) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(x - 2, y - 2, width + 4, height + 4);
  
  ctx.fillStyle = '#333';
  ctx.fillRect(x, y, width, height);
  
  const filledWidth = Math.max(0, width * (percent / 100));
  ctx.fillStyle = color;
  ctx.fillRect(x, y, filledWidth, height);
  
  if (percent > 0) {
    const glowGradient = ctx.createLinearGradient(x, y, x + filledWidth, y);
    glowGradient.addColorStop(0, color);
    glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(x, y, filledWidth, height);
  }
}

export function drawFightingGameUI(ctx, canvas, playerHealth, enemyHealth, timer = '03:30') {
  const uiHeight = 80;
  const margin = 20;
  const healthBarWidth = (canvas.width - 200) / 2;
  const healthBarHeight = 25;
  const healthBarY = margin + 10;
  
  const uiGradient = ctx.createLinearGradient(0, 0, 0, uiHeight);
  uiGradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
  uiGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
  ctx.fillStyle = uiGradient;
  ctx.fillRect(0, 0, canvas.width, uiHeight);
  
  drawHealthBar(ctx, margin, healthBarY, healthBarWidth, healthBarHeight, playerHealth, '#ff4444');
  
  drawHealthBar(ctx, canvas.width - margin - healthBarWidth, healthBarY, healthBarWidth, healthBarHeight, enemyHealth, '#44ff44');
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(timer, canvas.width / 2, healthBarY + 5);
  
  ctx.fillStyle = '#ff4444';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('PLAYER', margin, healthBarY + healthBarHeight + 10);
  
  ctx.fillStyle = '#44ff44';
  ctx.textAlign = 'right';
  ctx.fillText('ENEMY', canvas.width - margin, healthBarY + healthBarHeight + 10);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('ROUND 1', canvas.width / 2, healthBarY + healthBarHeight + 10);
}
