/**
 * Represents a cylinder
 * @param {XMLscene} scene CGFscene where the Cylinder will be displayed
 * @param {String} coords - coordinates parsed from the XML file
 * @constructor
 */
var PIECE_SLICES = 20;
var PIECE_STACKS = 1;

function MyPiece(scene, id) {
  this.scene = scene;
  this.id = id;
  CGFobject.call(this, this.scene);
  this.animationsMatrix = mat4.create();
  mat4.identity(this.animationsMatrix);

  this.transformMatrix = mat4.create();
  mat4.identity(this.transformMatrix);

  this.cyl = new MyCylinderwithoutTops(this.scene, PIECE_SLICES, PIECE_STACKS,true,true);
  this.top = new Circle(this.scene, PIECE_SLICES);
  this.bot = new Circle(this.scene, PIECE_SLICES);
};

MyPiece.prototype = Object.create(CGFobject.prototype);
MyPiece.prototype.constructor = MyPiece;

/**
 * Displays the cylinder
 * @function
 * @memberof MyPiece
 * @name display
 */
MyPiece.prototype.display = function() {
  this.scene.pushMatrix();
  this.scene.scale(1, 1, this.height);
  this.cyl.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(0, 0, this.height);
  this.scene.scale(this.topRadius, this.topRadius, 1);
  this.top.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.rotate(Math.PI, 0, 1, 0);
  this.scene.scale(this.bottomRadius, this.bottomRadius, 1);
  this.bot.display();
  this.scene.popMatrix();
}

/**
 * Updates top and bottom tex coords.
 * @function
 * @name updateTexCoords
 * @memberof MyPiece
 * @param {number} s - the amplification factor on S axis
 * @param {number} t - the amplification factor on t axis
 */
MyPiece.prototype.updateTexCoords = function(s,t){
  this.top.updateTexCoords(s,t);
  this.bot.updateTexCoords(s,t);
}
