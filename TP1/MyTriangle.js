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
  //2 0 12 12 0 2 0 0 0
  var arr = [];
  arr = coords.split(" ");
  var x1 = arr[0];
  var y1 = arr[1];
  var z1 = arr[2];

  var x2 = arr[3];
  var y2 = arr[4];
  var z2 = arr[5];

  var x3 = arr[6];
  var y3 = arr[7];
  var z3 = arr[8];

	this.vertices = [
          x1,y1,z1,
          x2,y2,z2,
          x3,y3,z3
		];

	this.indices = [
            2, 1, 0
        ];

	this.normals = [
      x1,y1,z1,
      x2,y2,z2,
      x3,y3,z3
		];

	this.texCoords = [
			0, 0,
			0.5, 0,
			0.5, 1,
			0, 0,
			0.5, 0,
			0.5, 1,
	];

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();

};
