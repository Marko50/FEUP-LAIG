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
  var arr = [];
  arr = coords.split(" ");
  var x1 = parseFloat(arr[0]);
  var y1 = parseFloat(arr[1]);
  var x2 = parseFloat(arr[2]);
  var y2 = parseFloat(arr[3]);

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

   this.FirstTexCoords = [
     1,1,
     1,0,
     0,1,
     0,0
   ];


    this.normals = [
     0,0,1,
     0,0,1,
     0,0,1,
     0,0,1
    ];

  this.texCoords = this.FirstTexCoords.slice();

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
};

MyRectangle.prototype.updateTexCoords = function(s,t){

    for (var i = 0; i < this.texCoords.length; i += 2) {
      this.texCoords[i] = this.FirstTexCoords[i] / s;
      this.texCoords[i + 1] = this.FirstTexCoords[i+1] / t;
    }

    this.updateTexCoordsGLBuffers();
}
