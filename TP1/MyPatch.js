/**
 * MyPatch
 * @constructor
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

 MyPatch.prototype.initBuffers =function(){
   var nurbsSurface = new CGFnurbsSurface(this.degreeU, this.degreeV, this.knots1, this.knots2, this.controlPoints);
   getSurfacePoint = function(u, v){
   		return nurbsSurface.getPoint(u, v);
   	};

     this.nurbsObject = new CGFnurbsObject(this.scene, getSurfacePoint, this.uDivs, this.vDivs);

     this.primitiveType = this.scene.gl.TRIANGLES;
 };


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

MyPatch.prototype.display = function () {
  this.scene.pushMatrix();
	this.nurbsObject.display();
  this.scene.popMatrix();
};

MyPatch.prototype.updateTexCoords = function(length_s, length_t) {

};
