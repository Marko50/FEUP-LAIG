/**
 * MyPatch
 * @constructor
 * @param {XMLScene} scene - CGFscene where the nurb will be displayed
 * @param {number} uDivs - uDivs
 * @param {number} vDivs - vDivs
 * @param {number} degreeU - degree on the U axis
 * @param {number} degreeV - degree on the V axis
 * @param {Array} points - control points of the patch
 */
 function MyPatch(scene, uDivs, vDivs, degreeU , degreeV, points) {
 	CGFobject.call(this,scene);
  this.scene = scene;
  this.uDivs=uDivs;
  this.vDivs=vDivs;
  this.degreeU=degreeU;
  this.degreeV=degreeV;
  this.knots1 = this.getKnotsVector(this.degreeU);
  this.knots2 = this.getKnotsVector(this.degreeV);

  this.controlPoints = points;

  this.initBuffers();

 };

 MyPatch.prototype = Object.create(CGFobject.prototype);
 MyPatch.prototype.constructor = MyPatch;

/**
  Creates the CFGUnurbsObject ad Surface
  @function
  @memberof MyPatch
  @name initBuffers
*/
 MyPatch.prototype.initBuffers =function(){
   var nurbsSurface = new CGFnurbsSurface(this.degreeU, this.degreeV, this.knots1, this.knots2, this.controlPoints);
   getSurfacePoint = function(u, v){
   		return nurbsSurface.getPoint(u, v);
   	};

    this.nurbsObject = new CGFnurbsObject(this.scene, getSurfacePoint, this.uDivs, this.vDivs);

    this.primitiveType = this.scene.gl.TRIANGLES;
 };

 /**
   * Creates the knots
   * @function
   * @memberof MyPatch
   * @name getKnotsVector
   * @param {number} degree - The degree in some axis
 */
MyPatch.prototype.getKnotsVector = function(degree) {

	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
}

/**
  *DIsplays the nurb
  * @function
  * @memberof MyPatch
  * @name display
*/
MyPatch.prototype.display = function () {
  this.scene.pushMatrix();
	this.nurbsObject.display();
  this.scene.popMatrix();
};

/**
 * Updates primitive tex coords.
 * @function
 * @name updateTexCoords
 * @memberof MyPatch
 * @param {number} s - the amplification factor on S axis
 * @param {number} t - the amplification factor on t axis
 */
MyPatch.prototype.updateTexCoords = function(length_s, length_t) {

};
