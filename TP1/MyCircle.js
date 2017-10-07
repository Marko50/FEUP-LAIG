/**
 * MyCircle
 * @constructor
 */
  function Circle(scene, slices) {
 	CGFobject.call(this,scene);

	this.slices = slices;

 	this.initBuffers();
 };

 Circle.prototype = Object.create(CGFobject.prototype);
 Circle.prototype.constructor = Circle;

 Circle.prototype.initBuffers = function() {

	this.texCoords = [];

    this.vertices = [];
    this.normals = [];
    var angle = 2*Math.PI/this.slices;
    this.indices = [];
    var vertice = 0;
    this.vertices.push(0,0,0);
    this.texCoords.push(0.5,0.5);
    this.normals.push(0,0,1);
    for(var i = 0; i < this.slices; i++) {
    	this.texCoords.push(Math.cos((i+1)*angle)*0.5 + 0.5,Math.sin((i+1)*angle) * 0.5 + 0.5);
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


 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();

 }
