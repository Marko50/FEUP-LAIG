/**
 * MyRectangle
 * @constructor
 */
 function MyRectangle(scene, coords) {
 	CGFobject.call(this,scene);

 	this.initBuffers(coords);
 };

 MyRectangle.prototype = Object.create(CGFobject.prototype);
 MyRectangle.prototype.constructor = MyRectangle;

 MyRectangle.prototype.initBuffers = function(coords) {

   //0 4 5 0
   //0 14 5 10
   this.texCoords = [
    0,1,
    1,1,
    0,0,
    1,0
  ];
  var arr = [];
  arr = coords.split(" ");
  var x1 = arr[0];
  var x2 = arr[1];
  var y1 = arr[2];
  var y2 = arr[3];



 	this.vertices = [
 	  x2, y2, 0,
 	  x2, y1, 0,
 	  x1, y2, 0,
 	  x1, y1, 0
 	];

 	  this.indices = [
 	    0, 1, 2,
 	    3, 2, 1
 	  ];

    this.normals = [
     0,0,1,
     0,0,1,
     0,0,1,
     0,0,1
    ];

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
};
