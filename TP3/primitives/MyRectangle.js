/**
 * MyRectangle
 * @constructor
 * @param {XMLscene} scene - CGFscene where the rectangle will be displayed
 * @param {String} coords - coordinates parsed from the XML file
 */
 function MyRectangle(scene, coords) {
 	CGFobject.call(this,scene);
 	this.initBuffers(coords);
 };

 MyRectangle.prototype = Object.create(CGFobject.prototype);
 MyRectangle.prototype.constructor = MyRectangle;

/**
  * Create all the vertexes needed for the rectangle. Initiates GL Buffers
  * @function
  * @memberof MyRectangle
  * @name initBuffers
  * @param {String} coords - coordinates parsed from the XML file
*/
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

   /*this.FirstTexCoords = [
     1,1,
     1,0,
     0,1,
     0,0
   ];*/

  this.rotateTexCoords(0);


  this.calcNormals(x1,y1,x2,y2);

  this.texCoords = this.FirstTexCoords.slice();

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
};

/**
  * Calculation of the rectangle normals. Will always return 0,0,1 because the rectangle is drawn on xy plane
  * @function
  * @memberof MyRectangle
  * @name calcNormals
  * @param {number} x1 - x coordinate of the top left point
  * @param {number} y1 - y coordinate of the top left point
  * @param {number} x2 - x coordinate of the bottom right point
  * @param {number} y2 - y coordinate of the bottom right point
*/
MyRectangle.prototype.calcNormals = function(x1,y1,x2,y2){
  let x3 = x2;
  let y3 = y1;

  let v1 = vec2.fromValues(x3 - x1, y3 - y1);
  let v2 = vec2.fromValues(x2 - x3, y2 - y3);

  let normal = vec2.create();
  vec2.cross(normal, v1,v2);

  this.normals = [
    normal[0], normal[1], 1,
    normal[0], normal[1], 1,
    normal[0], normal[1], 1,
    normal[0], normal[1], 1
  ];
}

MyRectangle.prototype.rotateTexCoords = function(teta){
     /*this.FirstTexCoords = [
       1,1, ->x2,y2 -> 3
       1,0, ->x2,y1 -> 2
       0,1, ->x1->y2 -> 1
       0,0 ->x1,y1 -> 0
     ];*/

     /*(0)|---------|(2)
          |         |
      (1) |---------|(3)*/
     let DEGREE_TO_RAD = Math.PI/180;

     let cosTeta = Math.cos(teta*DEGREE_TO_RAD);
     let sinTeta = Math.sin(teta*DEGREE_TO_RAD);
     let x3 = cosTeta;
     let y3 = 1 - sinTeta;

     let sinBeta = 1/Math.sqrt(2);
     let cosBeta = sinBeta;

     let cosBetaPlusTeta = cosBeta*cosTeta - sinBeta*sinTeta;
     let sinBetaPlusTeta = sinBeta*cosTeta + sinTeta*cosBeta;

     let x2 = cosBetaPlusTeta*Math.sqrt(2);
     let y2 = 1 - sinBetaPlusTeta*Math.sqrt(2);

     let x0 = 0;
     let y0 = 1 - cosTeta;

     let x1 = 0;
     let y1 = 1;

     this.FirstTexCoords = [
       x3,y3,
       x2,y2,
       x1,y1,
       x0,y0
     ];
}

/**
 * Updates primitive tex coords.
 * @function
 * @name updateTexCoords
 * @memberof MyRectangle
 * @param {number} s - the amplification factor on S axis
 * @param {number} t - the amplification factor on t axis
 */
MyRectangle.prototype.updateTexCoords = function(s,t){

    for (var i = 0; i < this.texCoords.length; i += 2) {
      this.texCoords[i] = this.FirstTexCoords[i] / s;
      this.texCoords[i + 1] = this.FirstTexCoords[i+1] / t;
    }

    this.updateTexCoordsGLBuffers();
}
