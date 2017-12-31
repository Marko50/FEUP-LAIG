var DEGREE_TO_RAD = Math.PI / 180;
var DISTANCE_BETWEEN_CELLS = 6;

/**
  Class representing a cell on a board
  @class
*/
class cell {
  /**
    Creates a cell
    @constructor
    @param {XMLscene} scene Scene where the cell will be displayed
    @param {Number} x X spacial coordinate
    @param {Number} y Y spacial coordinate
    @param {Number} dimension Size of the cell
    @param {CGFappearance} appearence Material used on the cell
    @param {Number} id Identification for picking
    @param {Number} line x coordinate on the board
    @param {Number} column y coordinate on the board
  */
  constructor(scene, x,y,dimension, appearance, id,line,column) {
    this.dimension = dimension;
    this.scene = scene;
    this.material = appearance;
    this.type = "cell";
    this.line = line;
    this.col = column;
    this.elegible = true;
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
    mat4.translate(this.transformMatrix, this.transformMatrix, [5, 0, 50]);
    mat4.rotate(this.transformMatrix, this.transformMatrix, -90 * DEGREE_TO_RAD, [1, 0, 0]);
    this.obj = new MyRectangle(scene, coords);
    this.piece = null;
  }

  /**
    Displays the cell
    @name display
    @memberof cell
  */
  display(){
    this.scene.registerForPick(this.id, this);
    this.scene.pushMatrix();
    this.scene.multMatrix(this.transformMatrix);
    this.material.apply();
    this.obj.display();
    this.scene.popMatrix();
  }
}
