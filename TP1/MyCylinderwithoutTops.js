/**
 * MyCylinderwithoutTops
 * @param {XMLscene} scene - CGFscene where the Circle will be displayed
 * @param {number} slices - number of slices to draw the cylinder parsed from XML file
 * @param {number} stack - number of stacks to draw the cylinder parsed from XML file
 * @param {number} bottomRadius - value of the bottom base radius to draw the cylinder parsed from XML file
 * @param {number} topRadius - value of the top base radius the cylinder parsed from XML filer
 * @constructor
 */
function MyCylinderwithoutTops(scene, slice, stack, bottomRadius, topRadius) {
  CGFobject.call(this, scene);

  this.stacks = stack;
  this.slices = slice;
  this.bottomRadius = bottomRadius;
  this.topRadius = topRadius;

  ;

  this.initBuffers();
};

MyCylinderwithoutTops.prototype = Object.create(CGFobject.prototype);
MyCylinderwithoutTops.prototype.constructor = MyCylinderwithoutTops;


/**
 * Create all the vertexes needed for the cylinder. Initiates GL Buffers
 * @function
 * @memberof MyCylinderwithoutTops
 * @name initBuffers
 */
MyCylinderwithoutTops.prototype.initBuffers = function() {
  this.vertices = [];
  this.indices = [];
  this.normals = [];
  this.texCoords = [];

  var ang = (2 * Math.PI) / this.slices;
  var deltaZ = 1 / this.stacks;
  var deltaX = 1 / this.slices;
  var deltaY = 1 / this.stacks;

  var deltaRadius = (this.topRadius - this.bottomRadius) / this.stacks;
  var delta;

  var xCoord = 0;
  var yCoord = 0;
  var zCoord = 0;


  for (i = 0; i <= this.stacks; i++) {
    delta = (deltaRadius * i) + this.bottomRadius;
    for (j = 0; j < this.slices; j++) {
      this.vertices.push(delta * Math.cos(ang * j), delta * Math.sin(ang * j), zCoord);
      this.normals.push(delta * Math.cos(ang * j), delta * Math.sin(ang * j), zCoord);
      this.texCoords.push(xCoord, yCoord);
      xCoord += deltaX;
    }
    xCoord = 0;
    yCoord += deltaY;
    zCoord += deltaZ;
  }


  for (i = 0; i < this.stacks; i++) {
    for (j = 0; j < this.slices - 1; j++) {
      this.indices.push(i * this.slices + j, i * this.slices + j + 1, (i + 1) * this.slices + j);
      this.indices.push(i * this.slices + j + 1, (i + 1) * this.slices + j + 1, (i + 1) * this.slices + j);
    }

    this.indices.push(i * this.slices + this.slices - 1, i * this.slices, (i + 1) * this.slices + this.slices - 1);
    this.indices.push(i * this.slices, i * this.slices + this.slices, (i + 1) * this.slices + this.slices - 1);
  }


  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
};
