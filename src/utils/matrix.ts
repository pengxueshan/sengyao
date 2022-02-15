import Stage, { StageInitParams } from './stage';
import { rectSplit, getMatrix } from './calc';

interface Point {
  x: number;
  y: number;
}

class Matrix extends Stage {
  endPoints: Array<Point> = [];
  transformedPoints: Array<Point> = [];
  img: HTMLImageElement | undefined;
  maxCount: number = 20;
  initTransformPoints: Array<Point> | undefined;
  movePointer: Point | undefined;

  constructor(params: StageInitParams) {
    super(params);
    this.init();
  }

  init() {
    const pointA = {
      x: 10,
      y: 10,
    };
    const pointB = {
      x: this.canvas.width - 10,
      y: 10,
    };
    const pointC = {
      x: this.canvas.width - 10,
      y: this.canvas.height - 10,
    };
    const pointD = {
      x: 10,
      y: this.canvas.height - 10,
    };
    this.endPoints = [pointA, pointB, pointC, pointD];
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.addEvent();
    this.loadImage();
  }

  loadImage() {
    const img = new Image();
    img.src = '/fish.webp';
    img.onload = () => {
      console.log('image loaded', img.width);
    };
    this.img = img;
  }

  addEvent() {
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseMove(e: MouseEvent) {
    this.movePointer = {
      x: e.offsetX,
      y: e.offsetY,
    };
  }

  handleMouseDown(e: MouseEvent) {
    const startPoint = {
      x: e.offsetX,
      y: e.offsetY,
    };
    let dragPoint: undefined | Point;
    for (let i = 0; i < this.endPoints.length; i++) {
      const p = this.endPoints[i];
      const deltaX = Math.abs(startPoint.x - p.x);
      const deltaY = Math.abs(startPoint.y - p.y);
      if (deltaX < 30 && deltaY < 30) {
        dragPoint = p;
        break;
      }
    }
    let handleMouseMove = (e: MouseEvent) => {
      if (!dragPoint) return;
      dragPoint.x = e.offsetX;
      dragPoint.y = e.offsetY;
    };
    let handleMouseUp = () => {
      this.canvas.removeEventListener('mousemove', handleMouseMove);
      this.canvas.removeEventListener('mouseup', handleMouseUp);
    };
    this.canvas.addEventListener('mousemove', handleMouseMove);
    this.canvas.addEventListener('mouseup', handleMouseUp);
    this.canvas.addEventListener('mouseleave', handleMouseUp);
  }

  calcTransformPoints() {
    this.transformedPoints = rectSplit(
      this.maxCount,
      this.endPoints[0],
      this.endPoints[1],
      this.endPoints[2],
      this.endPoints[3]
    );
    if (!this.initTransformPoints || this.initTransformPoints.length < 1) {
      this.initTransformPoints = this.transformedPoints;
    }
  }

  renderImage() {
    if (
      !this.img ||
      !this.initTransformPoints ||
      !this.initTransformPoints.length
    )
      return;
    const imgBandWidth = this.img.width / this.maxCount;
    const imgBandHeight = this.img.height / this.maxCount;
    const count = this.maxCount + 1;
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        const index1 = i * count + j;
        const index2 = i * count + j + 1;
        const index3 = (i + 1) * count + j + 1;
        const index4 = (i + 1) * count + j;
        const s1 = this.initTransformPoints[index1];
        const s2 = this.initTransformPoints[index2];
        const s3 = this.initTransformPoints[index3];
        const s4 = this.initTransformPoints[index4];
        const d1 = this.transformedPoints[index1];
        const d2 = this.transformedPoints[index2];
        const d3 = this.transformedPoints[index3];
        const d4 = this.transformedPoints[index4];
        if (!d4) continue;
        // 画上半部分三角
        this._renderImage({
          i,
          j,
          s1,
          s2,
          s3: s4,
          d1,
          d2,
          d3: d4,
          imgBandWidth,
          imgBandHeight,
          startPoint: s1,
        });
        // 画下半部分三角
        this._renderImage({
          i,
          j,
          s1: s3,
          s2: s4,
          s3: s2,
          d1: d3,
          d2: d4,
          d3: d2,
          imgBandWidth,
          imgBandHeight,
          startPoint: s1,
        });
      }
    }
  }

  _renderImage({
    i,
    j,
    s1,
    s2,
    s3,
    d1,
    d2,
    d3,
    imgBandWidth,
    imgBandHeight,
    startPoint,
  }: {
    i: number;
    j: number;
    s1: Point;
    s2: Point;
    s3: Point;
    d1: Point;
    d2: Point;
    d3: Point;
    imgBandWidth: number;
    imgBandHeight: number;
    startPoint: Point;
  }) {
    if (!s1 || !s2 || !s3 || !d1 || !d2 || !d3) return;
    if (!this.img || !this.initTransformPoints) return;
    this.context.save();
    const { a, b, c, d, e, f } = getMatrix(s1, d1, s2, d2, s3, d3);
    this.context.transform(a, b, c, d, e, f);
    this.context.beginPath();
    this.context.moveTo(s1.x, s1.y);
    this.context.lineTo(s2.x, s2.y);
    this.context.lineTo(s3.x, s3.y);
    this.context.closePath();
    this.context.clip();
    this.context.drawImage(
      this.img,
      j * imgBandWidth,
      i * imgBandHeight,
      imgBandWidth,
      imgBandHeight,
      startPoint.x,
      startPoint.y,
      Math.abs(s2.x - s1.x),
      Math.abs(s3.y - s1.y)
    );
    this.context.restore();
  }

  updatePoint() {
    if (!this.movePointer) return;
    const pointer = this.movePointer;
    const maxDis = 140;
    const focallength = 250;
    let len = this.transformedPoints.length;
    const ax = pointer.x;
    const ay = pointer.y;
    let c, scale, dis, xc, yc;
    while (len) {
      len--;
      const d = this.transformedPoints[len];
      let ix = d.x;
      let iy = d.y;
      let z = 0;

      if (!ax || !ay) break;

      xc = ix - ax;
      yc = iy - ay;

      dis = Math.sqrt(xc * xc + yc * yc);

      // 将效果放大
      let ez = (maxDis - dis) * 10;
      ez = ez < 0 ? 0 : ez;

      // 赋给目的z轴值ez以及当前z轴值z
      c = ez - z;
      z += c * 0.1;
      scale = focallength / (focallength + z);

      d.x = ax + (ix - ax) / scale;
      d.y = ay + (iy - ay) / scale;
    }
  }

  renderStage() {
    this.context.save();
    this.calcTransformPoints();
    this.updatePoint();
    this.renderImage();
    this.transformedPoints.forEach((p) => {
      this.context.beginPath();
      this.context.arc(p.x, p.y, 1, 0, Math.PI * 2);
      this.context.closePath();
      this.context.fillStyle = 'red';
      this.context.fill();
    });
    this.context.restore();
  }
}

export default Matrix;
