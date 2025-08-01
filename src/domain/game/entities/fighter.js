import { Sprite } from './sprite';

export class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    attackBox = { offset: {}, width: 100, height: 50 },
    health = 100,
    facing = "right"
  }) {
    super({ position, imageSrc, scale, framesMax });
    this.velocity = velocity;
    this.offset = offset;
    this.attackBox = {
      position: {
        x: this.position.x + attackBox.offset.x,
        y: this.position.y + attackBox.offset.y
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height
    };
    this.health = health;
    this.isAttacking = false;
    this.facing = facing;
    this.gravity = 0.7;
  }

  update(ctx) {
    this.draw(ctx);
    this.animateFrames();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    const canvas = ctx.canvas;
    const charWidth = this.width * this.scale;
    const charHeight = this.height * this.scale;
    
    // Constrain horizontal movement with proper margins
    const margin = 60;
    if (this.position.x < margin) this.position.x = margin;
    if (this.position.x > canvas.width - charWidth - margin) this.position.x = canvas.width - charWidth - margin;

    // Ground collision with proper margin from bottom
    const groundLevel = canvas.height - charHeight - 80; // 80px margin from bottom
    if (this.position.y + charHeight + this.velocity.y >= groundLevel) {
      this.velocity.y = 0;
      this.position.y = groundLevel;
    } else {
      this.velocity.y += this.gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    // Add visual feedback for AI attacks
    if (this.image.src.includes('enemy')) {
      this.attackEffect = true;
      setTimeout(() => {
        this.attackEffect = false;
      }, 200);
    }
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  takeHit(damage = 10) {
    this.health = Math.max(0, this.health - damage);
  }
}
