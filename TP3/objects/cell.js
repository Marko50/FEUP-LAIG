var DEGREE_TO_RAD = Math.PI / 180;


class cell {
  constructor(scene, x,y,dimension, appearance, id) {
    this.dimension = dimension;
    this.scene = scene;
    this.material = appearance;
    let xi = x;
    let yi = y;
    let xf = x + dimension;
    let yf = y - dimension;
    this.centerx = (xf + xi)/2.0;
    this.centery = (yf + yi)/2.0;
    this.id = id;
    let xis = xi.toString();
    let yis = yi.toString();
    let xfs = xf.toString();
    let yfs = yf.toString();
    let coords = xfs + " " + yfs + " " + xis + " " + yis;
    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);
    mat4.translate(this.transformMatrix, this.transformMatrix, [5, 0,50]);
    mat4.rotate(this.transformMatrix, this.transformMatrix, -90 * DEGREE_TO_RAD, [1, 0, 0]);
    console.log("coords: " + coords);
    this.obj = new MyRectangle(scene, coords);
    this.obj.piece = this;
  }

  display(){
    this.scene.registerForPick(this.id, this.obj);
    this.scene.pushMatrix();
    this.scene.multMatrix(this.transformMatrix);
    this.material.apply();
    this.obj.display();
    this.scene.popMatrix();
  }
}
