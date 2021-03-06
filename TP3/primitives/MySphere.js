/**
 * MySphere
 * @param {XMLscene} scene - CGFscene where the Sphere will be displayed
 * @param {String} coords - coordinates parsed from the XML file
 * @constructor
 */
function MySphere(scene, coords) {
  CGFobject.call(this, scene);
  this.initBuffers(coords);
};

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor = MySphere;

/**
 * Initializes the Sphere buffers (vertices, indices, normals and texCoords)
 * @function
 * @memberof MySphere
 * @name initBuffers
 * @param {String} coords - coordinates parsed from the XML file
 */
MySphere.prototype.initBuffers = function(coords) {
  var arr = [];
  arr = coords.split(" ");
  var stacks = parseInt(arr[1]);
  var radius = parseInt(arr[0]);
  var slices = parseInt(arr[2]);

  this.vertices = [];
  this.normals = [];
  this.indices = [];
  this.TexCoords = [];

  var ang_slices = (2 * Math.PI) / slices;
  var ang_stacks = Math.PI / stacks;

  for (let i = 0; i <= stacks; i++) {
    for (let j = 0; j <= slices; j++) {
      let x = radius * Math.cos(ang_slices * j) * Math.sin(ang_stacks * i);
      let y = radius * Math.sin(ang_slices * j) * Math.sin(ang_stacks * i);
      let z = radius * Math.cos(ang_stacks * i);

      this.vertices.push(x, y, z);
      this.normals.push(x, y, z);
      this.TexCoords.push(j / slices, 1 - i / stacks);
    }
  }


  for (let i = 0; i < stacks; i++) {
    for (let j = 0; j < slices; j++) {
      this.indices.push(i * (slices + 1) + j, (i + 1) * (slices + 1) + j, (i + 1) * (slices + 1) + j + 1);
      this.indices.push(i * (slices + 1) + j, (i + 1) * (slices + 1) + j + 1, i * (slices + 1) + j + 1);
    }
  }

  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
}
/**
 * Updates primitive tex coords.
 * @function
 * @name updateTexCoords
 * @memberof MySphere
 * @param {number} s - the amplification factor on S axis
 * @param {number} t - the amplification factor on t axis
 */
MySphere.prototype.updateTexCoords = function(s, t) {

}
