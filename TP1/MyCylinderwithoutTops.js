/**
 * MyCylinder
 * @constructor
 */
function MyCylinderwithoutTops(scene, slice, stack, bottomRadius, topRadius) {
  CGFobject.call(this, scene);

  this.stacks=stack;
  this.slices=slice;
  this.bottomRadius=bottomRadius;
  this.topRadius=topRadius;

  ;

  this.initBuffers();
};

MyCylinderwithoutTops.prototype = Object.create(CGFobject.prototype);
MyCylinderwithoutTops.prototype.constructor = MyCylinderwithoutTops;

MyCylinderwithoutTops.prototype.initBuffers = function() {
  /*
   * TODO:
   * Replace the following lines in order to build a prism with a **single mesh**.
   *
   * How can the vertices, indices and normals arrays be defined to
   * build a prism with varying number of slices and stacks?
   */
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

/*
	// Vertices, Texture Coordinates & Normals
	for(var i = 0; i <= this.stacks; i++) {
    delta = (deltaRadius * i) + this.baseRadius;
		for(var j = 0; j < this.slices; j++) {
			this.vertices.push(delta * Math.cos(radsConst * j), delta * Math.sin(radsConst * j), i * deltaZ);
      this.normals.push(Math.cos(radsConst * j), Math.sin(radsConst * j), 0);

			this.vertices.push(delta * Math.cos(radsConst * (j+1)),delta * Math.sin(radsConst * (j+1)), i * deltaZ);
			this.normals.push(Math.cos(radsConst * (j+1)), Math.sin(radsConst * (j+1)), 0);

			this.texCoords.push(xCoord, yCoord);
			xCoord += deltaX;
			this.texCoords.push(xCoord, yCoord);
		}
		xCoord = 0;
		yCoord += deltaY;
	}*/

  /*
  	// Indices
  	for(i = 0; i < this.stacks; i++) {
  		for(j = 0; j < this.slices; j++) {
  			this.indices.push(i*this.slices*2 + j*2, i*this.slices*2 + j*2+1, (i+1)*this.slices*2 + j*2);
  			this.indices.push(i*this.slices*2 + j*2+1, (i+1)*this.slices*2 + j*2+1, (i+1)*this.slices*2 + j*2);
  		}
  	}*/

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

//Indices
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
