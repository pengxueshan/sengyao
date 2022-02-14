import BasicObj, { BasicObjInitParams } from './basic';

class Bullet extends BasicObj {
  constructor(params: BasicObjInitParams) {
    params.color = 'black';
    params.radius = 5;
    super(params);
  }
}

export default Bullet;
