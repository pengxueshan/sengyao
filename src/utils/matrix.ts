import Stage, { StageInitParams } from './stage';
import { rectSplit } from './calc';

interface Point {
  x: number;
  y: number;
}

class Matrix extends Stage {
  endPoints: Array<Point> = [];
  transformedPoints: Array<Point> = [];

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
    this.addEvent();
  }

  addEvent() {
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
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
      20,
      this.endPoints[0],
      this.endPoints[1],
      this.endPoints[2],
      this.endPoints[3]
    );
  }

  renderStage() {
    this.context.save();
    this.calcTransformPoints();
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
