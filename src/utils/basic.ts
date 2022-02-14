export interface BasicObjInitParams {
  x: number;
  y: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  radius?: number;
  color?: string;
  context: CanvasRenderingContext2D;
}
class BasicObj {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
  context: CanvasRenderingContext2D;
  scale: number = 1;
  see: Array<number> = [-500, 500];

  constructor({
    x,
    y,
    z,
    vx = 0,
    vy = 0,
    vz = 0,
    context,
    radius,
    color,
  }: BasicObjInitParams) {
    this.x = x;
    this.y = y;
    this.z = z || 0;
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
    this.radius = radius || Math.random() * 10 + 5;
    this.color = color || 'black';
    this.context = context;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;
    if (this.z < 0 && this.z > this.see[0]) {
      this.scale = Math.abs(1 - this.z / this.see[0]);
    } else if (this.z > 0 && this.z < this.see[1]) {
      this.scale = Math.abs(1 + (3 * this.z) / this.see[1]);
    }
    if (this.z < this.see[0] || this.z > this.see[1]) {
      this.scale = 0;
    }
  }

  render() {
    this.update();
    this.context.save();
    this.context.translate(
      this.x * (1 - this.scale),
      this.y * (1 - this.scale)
    );
    this.context.scale(this.scale, this.scale);
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.restore();
  }
}

export default BasicObj;
