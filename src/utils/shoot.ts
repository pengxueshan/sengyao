import Stage, { StageInitParams } from './stage';
import Bullet from './bullet';
import Bird from './bird';

class Shoot extends Stage {
  birds: Array<Bird | null>;
  birdsCount = 3;
  bullet: Bullet | undefined;

  constructor(params: StageInitParams) {
    super(params);
    this.birds = [];
    this.init();
  }

  init() {
    this.handleClick = this.handleClick.bind(this);
    this.canvas.addEventListener('mousedown', this.handleClick);
  }

  checkBirds() {
    const delta = this.birdsCount - this.birds.length;
    if (delta > 0) {
      for (let i = 0; i < delta; i++) {
        this.birds.push(
          new Bird({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: Math.random() * 10 - 5,
            vy: Math.random() * 10 - 5,
            vz: Math.random() * 4 - 2,
            context: this.context,
          })
        );
      }
    }
    this.checkBirdsIsLiving();
  }

  checkBirdsIsLiving() {
    for (let i = 0; i < this.birds.length; i++) {
      const b = this.birds[i];
      if (!b) continue;
      const left = 0;
      const right = this.canvas.width;
      const top = 0;
      const bottom = this.canvas.height;
      if (
        b.x < left ||
        b.x > right ||
        b.y < top ||
        b.y > bottom ||
        b.scale === 0
      ) {
        this.birds[i] = null;
      } else if (this.bullet) {
        const birdLeft = b.x - b.radius * b.scale;
        const birdRight = b.x + b.radius * b.scale;
        const birdTop = b.y - b.radius * b.scale;
        const birdBottom = b.y + b.radius * b.scale;
        const bulletX = this.bullet.x;
        const bulletY = this.bullet.y;
        if (
          bulletX > birdLeft &&
          bulletX < birdRight &&
          bulletY > birdTop &&
          bulletY < birdBottom
        ) {
          this.birds[i] = null;
          this.bullet = undefined;
        }
      }
    }
    this.birds = this.birds.filter((b) => !!b);
  }

  handleClick(e: MouseEvent) {
    this.bullet = undefined;
    const x = e.offsetX;
    const y = e.offsetY;
    this.bullet = new Bullet({
      x,
      y,
      vx: Math.random() * 2 - 1,
      vy: Math.random() * 2 - 1,
      vz: Math.random() * -50,
      context: this.context,
    });
  }

  renderBirds() {
    this.checkBirds();
    this.birds.forEach((b) => {
      b?.render();
    });
  }

  renderBullet() {
    if (this.bullet) {
      this.bullet.render();
    }
  }

  renderStage() {
    this.context.save();
    this.context.globalCompositeOperation = 'xor';
    this.renderBirds();
    this.renderBullet();
    this.context.restore();
  }
}

export default Shoot;
