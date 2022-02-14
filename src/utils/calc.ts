// 解三元一次方程
export function equation(
  arr1: Array<number>,
  arr2: Array<number>,
  arr3: Array<number>
) {
  const a1 = arr1[0];
  const b1 = arr1[1];
  const c1 = arr1[2];
  const d1 = arr1[3];

  const a2 = arr2[0];
  const b2 = arr2[1];
  const c2 = arr2[2];
  const d2 = arr2[3];

  const a3 = arr3[0];
  const b3 = arr3[1];
  const c3 = arr3[2];
  const d3 = arr3[3];

  //分离计算单元
  const m1 = c1 - (b1 * c2) / b2;
  const m2 = c2 - (b2 * c3) / b3;
  const m3 = d2 - (b2 * d3) / b3;
  const m4 = a2 - (b2 * a3) / b3;
  const m5 = d1 - (b1 * d2) / b2;
  const m6 = a1 - (b1 * a2) / b2;

  //计算xyz
  const x = ((m1 / m2) * m3 - m5) / ((m1 / m2) * m4 - m6);
  const z = (m3 - m4 * x) / m2;
  const y = (d1 - a1 * x - c1 * z) / b1;

  return {
    x,
    y,
    z,
  };
}

// 根据变换前后的已知点
// 获取transform参数
interface Point {
  x: number;
  y: number;
}
export function getMatrix(
  point1: Point,
  _point1: Point,
  point2: Point,
  _point2: Point,
  point3: Point,
  _point3: Point
) {
  //传入x值解第一个方程 即 X = ax + cy + e 求ace
  //传入的四个参数，对应三元一次方程：ax+by+cz=d的四个参数：a、b、c、d，跟矩阵方程对比c为1
  const arr1 = [point1.x, point1.y, 1, _point1.x];
  const arr2 = [point2.x, point2.y, 1, _point2.x];
  const arr3 = [point3.x, point3.y, 1, _point3.x];

  const result = equation(arr1, arr2, arr3);

  //传入y值解第二个方程 即 Y = bx + dy + f 求 bdf
  arr1[3] = _point1.y;
  arr2[3] = _point2.y;
  arr3[3] = _point3.y;

  const result2 = equation(arr1, arr2, arr3);

  //获得a、c、e
  const a = result.x;
  const c = result.y;
  const e = result.z;

  //获得b、d、f
  const b = result2.x;
  const d = result2.y;
  const f = result2.z;

  return {
    a,
    b,
    c,
    d,
    e,
    f,
  };
}

// 由已知四个点（a，b，c，d）组成的矩形
// 分割成nxn的小矩形
export function rectSplit(n: number, a: Point, b: Point, c: Point, d: Point) {
  //ad向量方向n等分
  const ad_x = (d.x - a.x) / n;
  const ad_y = (d.y - a.y) / n;
  //bc向量方向n等分
  const bc_x = (c.x - b.x) / n;
  const bc_y = (c.y - b.y) / n;

  const ndots = [];
  let x1, y1, x2, y2, ab_x, ab_y;

  //左边点递增，右边点递增，获取每一次递增后的新的向量，继续n等分，从而获取所有点坐标
  for (let i = 0; i <= n; i++) {
    //获得ad向量n等分后的坐标
    x1 = a.x + ad_x * i;
    y1 = a.y + ad_y * i;
    //获得bc向量n等分后的坐标
    x2 = b.x + bc_x * i;
    y2 = b.y + bc_y * i;

    for (let j = 0; j <= n; j++) {
      //ab向量为：[x2 - x1 , y2 - y1]，所以n等分后的增量为除于n
      ab_x = (x2 - x1) / n;
      ab_y = (y2 - y1) / n;

      ndots.push({
        x: x1 + ab_x * j,
        y: y1 + ab_y * j,
      });
    }
  }

  return ndots;
}
