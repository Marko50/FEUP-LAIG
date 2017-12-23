/**
 * MyTriangle
 * @param {XMLscene} scene - CGFscene where the Cylinder will be displayed
 * @param {String} coords - coordinates parsed from the XML file
 * @constructor
 */
function MyTriangle(scene, coords) {
	CGFobject.call(this,scene);
	this.initBuffers(coords);
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

/**
	* Creates all the vertexes needed for the trianle. Initiates GL Buffers
	* @function
	* @param {String} coords - coordinates parsed from the XML file
	*	@memberof MyTriangle
	* @name initBuffers
*/
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


	this.calcNormals(x1,y1,z1,x2,y2,z2,x3,y3,z3);

	this.generateTexCoords(x1,y1,z1,x2,y2,z2,x3,y3,z3);

	this.texCoords = this.FirstTexCoords.slice();

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();

};

/**
	* Calculation of the triangles' normals
	* @function
	* @memberof MyTriangle
	* @name calcNormals
	* @param {number} x1 - x coordinate of the first point
	* @param {number} y1 - y coordinate of the first point
	* @param {number} z1 - z coordinate of the first point
	* @param {number} x2 - x coordinate of the second point
	* @param {number} y2 - y coordinate of the second point
	* @param {number} z2 - z coordinate of the second point
	* @param {number} x3 - x coordinate of the third point
	* @param {number} x3 - y coordinate of the third point
	* @param {number} x3 - z coordinate of the third point
*/
MyTriangle.prototype.calcNormals = function(x1,y1,z1,x2,y2,z2,x3,y3,z3){
	let v1 = vec3.fromValues(x2-x1 , y2-y1, z2-z1);
	let v2 = vec3.fromValues(x3 - x1, y3 - y1, z3 - z1);
	let normal = vec3.create();
	vec3.cross(normal, v1,v2);

	this.normals = [
			normal[0],normal[1],normal[2],
		  normal[0],normal[1],normal[2],
      normal[0],normal[1],normal[2]
		];

}

/**
	* Calculation of the triangles' tex coords
	* @function
	* @memberof MyTriangle
	* @name generateTexCoords
	* @param {number} x1 - x coordinate of the first point
	* @param {number} y1 - y coordinate of the first point
	* @param {number} z1 - z coordinate of the first point
	* @param {number} x2 - x coordinate of the second point
	* @param {number} y2 - y coordinate of the second point
	* @param {number} z2 - z coordinate of the second point
	* @param {number} x3 - x coordinate of the third point
	* @param {number} x3 - y coordinate of the third point
	* @param {number} x3 - z coordinate of the third point
*/
MyTriangle.prototype.generateTexCoords = function(x1,y1,z1,x2,y2,z2,x3,y3,z3){
	let c = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) + (z1-z2)*(z1-z2));
	let a = Math.sqrt((x2-x3)*(x2-x3) + (y2-y3)*(y2-y3) + (z2-z3)*(z2-z3));
	let b = Math.sqrt((x1-x3)*(x1-x3) + (y1-y3)*(y1-y3) + (z1-z3)*(z1-z3));

	let cosB = (a*a - b*b + c*c)/(2*a*c);
	let sinB = Math.sqrt(1 - cosB*cosB);

	let h = a*sinB;

	let aux = [c,a,b,h];

	let max = Math.max.apply(Math,aux);

	b = b/max;
	c = c/max;
	a = a/max;
	h = h/max;

	this.FirstTexCoords = [c-a*cosB,1-h,c,1,0,1];
}

/**
 * Updates primitive tex coords.
 * @function
 * @name updateTexCoords
 * @memberof MyTriangle
 * @param {number} s - the amplification factor on S axis
 * @param {number} t - the amplification factor on t axis
 */
MyTriangle.prototype.updateTexCoords = function(s,t){
	for (var i = 0; i < this.texCoords.length; i += 2) {
		this.texCoords[i] = this.FirstTexCoords[i] / s;
		this.texCoords[i + 1] = this.FirstTexCoords[i+1] / t;
	}
	this.updateTexCoordsGLBuffers();
}
