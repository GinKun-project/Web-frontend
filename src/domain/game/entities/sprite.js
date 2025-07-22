export class Sprite {
  constructor({ position, imageSrc, scale = 1, framesMax = 1 }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.frameCurrent = 0;
    this.frameElapsed = 0;
    this.frameHold = 5; // control animation speed

    this.width = 50;  
    this.height = 150;
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.frameCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x,
      this.position.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.frameElapsed++;
    if (this.frameElapsed % this.frameHold === 0) {
      this.frameCurrent = (this.frameCurrent + 1) % this.framesMax;
    }
  }

  update(ctx) {
    this.draw(ctx);
    this.animateFrames();
  }
}