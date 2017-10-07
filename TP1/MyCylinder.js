/**
 * MyCylinder
 * @constructor
 */
function MyCylinder(scene, coords) {
  CGFobject.call(this, scene);
  this.initBuffers(coords);
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function(coords) {
  /*
   * TODO:
   * Replace the following lines in order to build a prism with a **single mesh**.
   *
   * How can the vertices, indices and normals arrays be defined to
   * build a prism with varying number of slices and stacks?
   */

  var arr = [];
  arr = coords.split(" ");

  var height = arr[0];
  var bottomRadius = arr[1];
  var topRadius = arr[2];
  var stack = arr[3];
  var slice = arr[4];

  this.stacks=stack;
  this.slices=slice;
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var radsConst = (Math.PI / 180) * (360 / this.slices);
    var deltaZ = 1 / this.stacks;

	var deltaX = 1 / this.slices;
 	var deltaY = 1 / this.stacks;
 	var xCoord = 0;
 	var yCoord = 0;

	// Vertices, Texture Coordinates & Normals
	for(var i = 0; i <= this.stacks; i++) {
		for(var j = 0; j < this.slices; j++) {
			this.vertices.push(Math.cos(radsConst * j), Math.sin(radsConst * j), i * deltaZ);
      this.normals.push(Math.cos(radsConst * j), Math.sin(radsConst * j), 0);

			this.vertices.push(Math.cos(radsConst * (j+1)), Math.sin(radsConst * (j+1)), i * deltaZ);
			this.normals.push(Math.cos(radsConst * (j+1)), Math.sin(radsConst * (j+1)), 0);

			this.texCoords.push(xCoord, yCoord);
			xCoord += deltaX;
			this.texCoords.push(xCoord, yCoord);
		}
		xCoord = 0;
		yCoord += deltaY;
	}

	// Indices
	for(i = 0; i < this.stacks; i++) {
		for(j = 0; j < this.slices; j++) {
			this.indices.push(i*this.slices*2 + j*2, i*this.slices*2 + j*2+1, (i+1)*this.slices*2 + j*2);
			this.indices.push(i*this.slices*2 + j*2+1, (i+1)*this.slices*2 + j*2+1, (i+1)*this.slices*2 + j*2);
		}
	}

/*
  this.texCoords = [];
  this.vertices = [];
  this.normals = [];
  this.indices = [];

  var stackHeight = 1 / stacks;
  var stackSlices = 1/ slices;
  var delta;
  var deltaRadius = (topRadius - bottomRadius) / stacks;
  var angle = 2 * Math.PI / slices;

  var patchLengthx = 1 / slices;
  var patchLengthy = 1 / stacks;
  var xCoord = 0;
  var yCoord = 0;
  var ang = (2 * Math.PI) / slices;
  var zCoord = 0;
  var zLength = 1 / stacks;
  var deltaRadius = (topRadius - bottomRadius) / stacks;

  for (i = 0; i <= stacks; i++) {
      delta = (deltaRadius * i) + bottomRadius;
      for (j = 0; j < slices; j++) {
          this.vertices.push(Math.cos(ang * j), Math.sin(ang * j), 0);
          this.normals.push( Math.cos(ang * j),  Math.sin(ang * j), 0);
          //this.originalTexCoords.push(xCoord, yCoord);
          xCoord += patchLengthx;
      }
      xCoord = 0;
      yCoord += patchLengthy;
      zCoord += zLength;
  }

  for(i = 0; i < stacks; i++) {
		for(j = 0; j < slices; j++) {
			this.indices.push(i*slices*2 + j*2, i*slices*2 + j*2+1, (i+1)*slices*2 + j*2);
			this.indices.push(i*slices*2 + j*2+1, (i+1)*slices*2 + j*2+1, (i+1)*slices*2 + j*2);
		}
	}
*/
  console.log(this.vertices);
  console.log(this.indices);
  console.log(this.normals);


  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
};
