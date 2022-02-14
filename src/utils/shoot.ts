import Bullet from './bullet';
import Bird from './bird';

interface InitParams {
  id: string;
  width?: number;
  height?: number;
}

class Shoot {
  container: HTMLDivElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  birds: Array<Bird | null>;
  birdsCount = 3;
  bullet: Bullet | undefined;

  constructor({ id, width = 600, height = 300 }: InitParams) {
    if (!id) throw Error('id can not be null');
    this.canvas = document.createElement('canvas');
    const context = this.canvas.getContext('2d');
    if (!context) throw Error('can not found 2d context');
    this.context = context;
    this.canvas.width = width;
    this.canvas.height = height;
    const container = document.querySelector('#' + id) as HTMLDivElement;
    if (!container) throw Error('can not found container');
    this.container = container;
    this.container.replaceChildren(this.canvas);
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
      context: this.context,
    });
    setTimeout(() => {
      if (this.bullet) {
        this.bullet = undefined;
      }
    }, 100);
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

  render() {
    window.requestAnimationFrame(() => {
      this.render();
    });
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.save();
    this.context.globalCompositeOperation = 'xor';
    this.renderBirds();
    this.renderBullet();
    this.context.restore();
  }
}

export default Shoot;
