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

	this.generateTexCoords(x1,y1,z1,x2,y2,z2,x3,y3,z3);

	this.texCoords = this.FirstTexCoords.slice();
	/*this.texCoords = [
		0,1,
		0.5,0,
		1,1
	];*/
	console.log(this.FirstTexCoords);
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();

};

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


	console.log("a: " + a);
	console.log("b: " + b);
	console.log("c: " + c);

	console.log("h: " + h);

	console.log("cosB: " + cosB);
	console.log("sinB: " + sinB);

	//this.FirstTexCoords = [0,1,c,1,c-a*cosB, 1- a*sinB];
	//this.FirstTexCoords = [0.5,0,1,1,0,1];
	this.FirstTexCoords = [c-a*cosB,1-h,c,1,0,1];
}

MyTriangle.prototype.updateTexCoords = function(s,t){
	for (var i = 0; i < this.texCoords.length; i += 2) {
		this.texCoords[i] = this.FirstTexCoords[i] / s;
		this.texCoords[i + 1] = this.FirstTexCoords[i+1] / t;
	}
	this.updateTexCoordsGLBuffers();
}
