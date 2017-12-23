/**
 * Circle
 * @param {XMLscene} scene - CGFscene where the Circle will be displayed
 * @param {number} slices - number of slices of to draw the circle passed by the cylinder
 * @constructor
 */
  function Circle(scene, slices) {
 	CGFobject.call(this,scene);

	this.slices = slices;

 	this.initBuffers();
 };

 Circle.prototype = Object.create(CGFobject.prototype);
 Circle.prototype.constructor = Circle;

 /**
  * Create all the vertexes needed for the circle. Initiates GL Buffers
  * @function
  * @memberof Circle
  * @name initBuffers
  */
 Circle.prototype.initBuffers = function() {
	  this.texCoords = [];
    this.vertices = [];
    this.normals = [];
    this.firstTexCoords = [];
    var angle = 2*Math.PI/this.slices;
    this.indices = [];
    var vertice = 0;
    this.vertices.push(0,0,0);
    this.firstTexCoords.push(0.5,0.5);
    this.normals.push(0,0,1);
    for(var i = 0; i < this.slices; i++) {
    	this.firstTexCoords.push(Math.cos((i+1)*angle)*0.5 + 0.5,Math.sin((i+1)*angle) * 0.5 + 0.5);
    	this.vertices.push(Math.cos(i*angle));
 		  this.vertices.push(Math.sin(i*angle));
 		  this.vertices.push(0);
 	    this.normals.push(0,0,1);
    }

    for (var j = 0; j <= this.slices; j++) {
    	this.indices.push(0);
    	this.indices.push(j);
    	if(j == this.slices)
			this.indices.push(1);
		else this.indices.push(j+1);
    }

  this.texCoords = this.firstTexCoords.slice();
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();

 }

 /**
  * Updates primitive tex coords.
  * @function
  * @name updateTexCoords
  * @memberof Circle
  * @param {number} s - the amplification factor on S axis
  * @param {number} t - the amplification factor on t axis
  */
 Circle.prototype.updateTexCoords = function(s,t) {
  for (var i = 0; i < this.texCoords.length; i += 2) {
      this.texCoords[i] = this.firstTexCoords[i] / s;
      this.texCoords[i + 1] = this.firstTexCoords[i+1] / t;
    }

    this.updateTexCoordsGLBuffers();
};
