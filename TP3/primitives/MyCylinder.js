/**
 * Represents a cylinder
 * @param {XMLscene} scene CGFscene where the Cylinder will be displayed
 * @param {String} coords - coordinates parsed from the XML file
 * @constructor
 */
function MyCylinder(scene, coords) {
  CGFobject.call(this, scene);
  this.scene = this.scene;
  var arr = [];
  arr = coords.split(" ");
  var height = parseInt(arr[0]);
  var bottomRadius = parseInt(arr[1]);
  var topRadius = parseInt(arr[2]);
  var stack = parseInt(arr[3]);
  var slice = parseInt(arr[4]);
  var booltop = parseInt(arr[5]);
  var boolbot = parseInt(arr[6]);

  this.stacks = stack;
  this.slices = slice;
  this.height = height;
  this.bottomRadius = bottomRadius;
  this.topRadius = topRadius;
  this.booltop = booltop;
  this.boolbot = boolbot;

  this.cyl = new MyCylinderwithoutTops(this.scene, this.slices, this.stacks, this.bottomRadius, this.topRadius);

  if (this.booltop == 1) this.top = new Circle(this.scene, this.slices);

  if (this.boolbot == 1) this.bot = new Circle(this.scene, this.slices);


};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

/**
 * Displays the cylinder
 * @function
 * @memberof MyCylinder
 * @name display
 */
MyCylinder.prototype.display = function() {
  this.scene.pushMatrix();
  this.scene.scale(1, 1, this.height);
  this.cyl.display();
  this.scene.popMatrix();

  if (this.booltop == 1) {
    this.scene.pushMatrix();
    this.scene.translate(0, 0, this.height);
    this.scene.scale(this.topRadius, this.topRadius, 1);
    this.top.display();
    this.scene.popMatrix();
  }

  if (this.boolbot == 1) {
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.scale(this.bottomRadius, this.bottomRadius, 1);
    this.bot.display();
    this.scene.popMatrix();
  }
}

/**
 * Updates top and bottom tex coords.
 * @function
 * @name updateTexCoords
 * @memberof MyCylinder
 * @param {number} s - the amplification factor on S axis
 * @param {number} t - the amplification factor on t axis
 */
MyCylinder.prototype.updateTexCoords = function(s,t){
  if(this.booltop==1){
    this.top.updateTexCoords(s,t);
  }
  if(this.boolbot==1){
    this.bot.updateTexCoords(s,t);
  }
}
