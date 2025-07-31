export class Sprite {
  constructor({ position, imageSrc, scale = 1, framesMax = 1 }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.frameCurrent = 0;
    this.frameElapsed = 0;
    this.frameHold = 5;

    this.width = 50;  
    this.height = 150;
    
    this.image.onerror = () => {
      console.error('Failed to load image:', imageSrc);
    };
    
    this.image.onload = () => {
      console.log('Image loaded successfully:', imageSrc);
    };
  }

  draw(ctx) {
    if (this.image.complete && this.image.naturalHeight !== 0) {
      console.log('Drawing sprite at position:', this.position, 'with scale:', this.scale);
      
      // Draw attack effect for AI
      if (this.attackEffect && this.image.src.includes('enemy')) {
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(this.position.x - 5, this.position.y - 5, 
                    (this.image.width / this.framesMax) * this.scale + 10, 
                    this.image.height * this.scale + 10);
        ctx.restore();
      }
      
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
    } else {
      console.log('Drawing fallback rectangle for:', this.image.src, 'at position:', this.position);
      ctx.fillStyle = this.image.src.includes('player') ? '#00ff00' : '#ff0000';
      ctx.fillRect(this.position.x, this.position.y, 100, 150);
      
      // Add some details to make characters more visible
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Arial';
      ctx.fillText(this.image.src.includes('player') ? 'PLAYER' : 'ENEMY', 
                   this.position.x, this.position.y - 10);
    }
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