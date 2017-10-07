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
  var x1 = parseFloat(arr[0]);
  var y1 = parseFloat(arr[1]);
  var z1 = parseFloat(arr[2]);

  var x2 = parseFloat(arr[3]);
  var y2 = parseFloat(arr[4]);
  var z2 = parseFloat(arr[5]);

  var x3 = parseFloat(arr[6]);
  var y3 = parseFloat(arr[7]);
  var z3 = parseFloat(arr[8]);

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
