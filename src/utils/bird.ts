import BasicObj, { BasicObjInitParams } from './basic';

class Bird extends BasicObj {
  constructor(params: BasicObjInitParams) {
    params.color = 'red';
    params.radius = params.radius || Math.random() * 10 + 5;
    super(params);
  }
}

export default Bird;
