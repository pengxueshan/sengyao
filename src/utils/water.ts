interface InitParams {
  id: string;
  width?: number;
  height?: number;
  pointsCount?: number;
}

class Water {
  container: HTMLDivElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  pointsCount: number;
  points: Array<Point> = [];
  waterHorizon: number = 0;
  band = 0;
  balls: Array<Ball> = [];

  constructor({
    id,
    width = 600,
    height = 300,
    pointsCount = 100,
  }: InitParams) {
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
    this.pointsCount = pointsCount;
    this.init();
  }

  init() {
    const band = this.canvas.width / (this.pointsCount - 1);
    this.band = band;
    this.waterHorizon = (this.canvas.height * 2) / 3;
    this.points = new Array(this.pointsCount).fill('').map((_d, index) => {
      return new Point({
        x: index * band,
        y: this.waterHorizon,
      });
    });
    this.points.forEach((p, index) => {
      p.prev = this.points[index - 1];
      p.next = this.points[index + 1];
    });
    this.handleClick = this.handleClick.bind(this);
    this.canvas.addEventListener('mousedown', this.handleClick);
  }

  handleClick(e: MouseEvent) {
    const x = e.offsetX;
    const y = e.offsetY;
    if (y < this.waterHorizon) {
      this.balls.push(
        new Ball({
          x,
          y,
          radius: Math.random() * 5 + 5,
          water: this,
        })
      );
    }
  }

  handleBallCollision(ball: Ball) {
    const x = ball.x;
    const index = Math.round(x / this.band);
    this.points[index].vy = (ball.vy * ball.radius) / 20;
    this.points[index].sourcePoints = this.points[index];
  }

  check() {
    this.balls = this.balls.filter((b) => {
      return b.y < this.canvas.height;
    });
  }

  render() {
    window.requestAnimationFrame(() => {
      this.render();
    });
    this.check();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // render balls
    this.balls.forEach((b) => b.render(this.context));
    // render water
    this.context.save();
    this.context.globalCompositeOperation = 'xor';
    this.context.beginPath();
    this.context.moveTo(this.canvas.width, this.canvas.height);
    this.context.lineTo(0, this.canvas.height);
    this.context.lineTo(0, this.waterHorizon);
    // render horizon line
    this.points.forEach((p) => {
      p.render(this.context);
    });
    this.context.closePath();
    this.context.fillStyle = 'blue';
    this.context.fill();
    this.context.restore();
  }
}

interface PointParams {
  x: number;
  y: number;
  prev?: Point;
  next?: Point;
}

class Point {
  x: number;
  y: number;
  initY: number;
  prev: Point | undefined;
  next: Point | undefined;
  vy: number = 0;
  spring = 0.03;
  fraction = 0.9;
  sourcePoints: Point | undefined;

  constructor({ x, y, prev, next }: PointParams) {
    this.x = x;
    this.y = y;
    this.prev = prev;
    this.next = next;
    this.initY = y;
  }

  update() {
    const distance = this.initY - this.y;
    const ay = distance * this.spring;
    this.vy += ay;
    this.vy *= this.fraction;
    this.y += this.vy;
    this._updateSiblings();
  }

  _updateSiblings() {
    if (!this.sourcePoints || Math.abs(this.vy) <= 0.001) return;
    if (this.sourcePoints.x >= this.x && this.prev) {
      this.prev.vy = this.vy * 0.5;
      this.prev.sourcePoints = this;
      this.prev.update();
    }
    if (this.sourcePoints.x <= this.x && this.next) {
      this.next.vy = this.vy * 0.5;
      this.next.sourcePoints = this;
      this.next.update();
    }
  }

  render(context: CanvasRenderingContext2D) {
    this.update();
    context.lineTo(this.x, this.y);
  }
}

interface BallParams {
  x: number;
  y: number;
  radius: number;
  color?: string;
  water: Water;
}

class Ball {
  x: number;
  y: number;
  radius: number;
  color: string;
  g = 1;
  vy = 0;
  ay = 0;
  water: Water;

  constructor({ x, y, radius, color = 'black', water }: BallParams) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.water = water;
  }

  update() {
    this.ay += this.g;
    this.vy += this.ay;
    this.vy *= 0.3;
    this.y += this.vy;
    if (this.y > this.water.waterHorizon) {
      this.water.handleBallCollision(this);
    }
  }

  render(context: CanvasRenderingContext2D) {
    this.update();
    context.save();
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fillStyle = this.color;
    context.closePath();
    context.fill();
    context.restore();
  }
}

export default Water;
