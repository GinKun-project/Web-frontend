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

    // Attack box update
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // Movement
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Gravity
    if (this.position.y + this.height + this.velocity.y >= ctx.canvas.height) {
      this.velocity.y = 0;
      this.position.y = ctx.canvas.height - this.height;
    } else {
      this.velocity.y += this.gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  takeHit(damage = 10) {
    this.health = Math.max(0, this.health - damage);
  }
}
