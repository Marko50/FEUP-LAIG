/**
 * MyTriangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyTriangle(scene, coords) {
	CGFobject.call(this,scene);
	this.initBuffers(coords);
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

MyTriangle.prototype.initBuffers = function (coords) {
  let arr = [];
  arr = coords.split(" ");
  let x1 = parseFloat(arr[0]);
  let y1 = parseFloat(arr[1]);
  let z1 = parseFloat(arr[2]);

  let x2 = parseFloat(arr[3]);
  let y2 = parseFloat(arr[4]);
  let z2 = parseFloat(arr[5]);

  let x3 = parseFloat(arr[6]);
  let y3 = parseFloat(arr[7]);
  let z3 = parseFloat(arr[8]);

	this.vertices = [
					x3,y3,z3,
					x2,y2,z2,
          x1,y1,z1
		];

	this.indices = [
            2, 1, 0
        ];

	this.normals = [
			x3,y3,z3,
		  x2,y2,z2,
      x1,y1,z1
		];

	this.texCoords = [
			0, 0,
			0.5, 0,
			0.5, -1,
			0, 0,
			0.5, 0,
			0.5, -1,
	];

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();

};

MyTriangle.prototype.generateTexCoords = function(x1,y1,z1,x2,y2,z2,x3,y3,z3){
	let a = Math.sqrt((x1-x2)^2 + (y1-y2)^2 + (z1-z2)^2);
	let b = Math.sqrt((x2-x3)^2 + (y2-y3)^2 + (z2-z3)^2);
	let c = Math.sqrt((x1-x3)^2 + (y1-y3)^2 + (z1-z3)^2);

}

MyTriangle.prototype.updateTexCoords = function(s,t){

}
