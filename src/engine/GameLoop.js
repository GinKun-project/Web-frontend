let animationId;

export function startGameLoop(ctx, canvas) {
  let x = 50;
  let dx = 2;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.fillRect(x, canvas.height / 2 - 25, 50, 50);

    x += dx;
    if (x + 50 > canvas.width || x < 0) dx *= -1;

    animationId = requestAnimationFrame(draw);
  }

  draw();
}

export function stopGameLoop() {
  cancelAnimationFrame(animationId);
}
