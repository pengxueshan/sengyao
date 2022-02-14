export interface StageInitParams {
  id: string;
  width?: number;
  height?: number;
}

class Stage {
  container: HTMLDivElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor({ id, width = 600, height = 300 }: StageInitParams) {
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
  }

  // child class should override this method
  // to do more business
  renderStage() {}

  render() {
    window.requestAnimationFrame(() => {
      this.render();
    });
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.save();
    this.renderStage();
    this.context.restore();
  }
}

export default Stage;
