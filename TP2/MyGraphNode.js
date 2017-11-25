/**
 * MyGraphNode
 * @param {MySceneGraph} graph - graph passed to the node constructor.
 * @param {String} nodeID - the identifier of the node
 * @constructor
 **/
function MyGraphNode(graph, nodeID, selectable) {
  this.selectable = selectable;
  this.selected = false;
  this.graph = graph;
  this.scene = graph.scene;
  this.nodeID = nodeID;

  this.animationINDEX = 0;

  // IDs of child nodes.
  this.children = [];

  this.moving = false;

  // IDs of child nodes.
  this.leaves = [];

  // The material ID.
  this.materialID = null;

  // The texture ID.
  this.textureID = null;

  //ANIMATIONS_INDEX
  this.animations = [];

  this.animationsMatrix = mat4.create();
  mat4.identity(this.animationsMatrix);

  this.transformMatrix = mat4.create();
  mat4.identity(this.transformMatrix);

  this.lastTime = Date.now();
}


MyGraphNode.prototype.addAnimation = function(animation){
  this.moving = true;
  this.animations.push(animation);
}


MyGraphNode.prototype.updateAnimations = function(currentTime){
  if(this.animations[this.animationINDEX].moving){
    this.animations[this.animationINDEX].update(currentTime);
    this.animationsMatrix = this.animations[this.animationINDEX].transformMatrix;
  }
  else{
    this.lastTime = Date.now();
    this.animationINDEX++;
    if(this.animationINDEX == this.animations.length){
      this.animationINDEX--;
      this.moving = false;
    }
  }
}


/**
 * Adds the reference (ID) of another node to this node's children array.
 * @function
 * @memberof MyGraphNode
 * @name addChild
 * @param {String} nodeID - identifier of the child node to be added
 */
MyGraphNode.prototype.addChild = function(nodeID) {
  this.children.push(nodeID);
}

/**
 * Adds a leaf to this node's leaves array.
 * @function
 * @memberof MyGraphNode
 * @name addLeaf
 * @param {String} leaf - the type of the leaf
 * @param {String} coords - coordinates from the primitive parsed from the XML file
 */
MyGraphNode.prototype.addLeaf = function(leaf, coords) {
  if (leaf === 'rectangle') {
    this.leaves.push(new MyRectangle(this.scene, coords));
  } else if (leaf === 'triangle') {
    this.leaves.push(new MyTriangle(this.scene, coords));
  } else if (leaf == "cylinder") {
    this.leaves.push(new MyCylinder(this.scene, coords));
  } else if (leaf == "sphere") {
    this.leaves.push(new MySphere(this.scene, coords));
  }
}


/**
 * Adds a patch leaf to this node's leaves array.
 * @function
 * @memberof MyGraphNode
 * @name addPatch
 * @param {number} uDivs - uDivs
 * @param {number} vDivs - vDivs
 * @param {number} degreeU - degree on the U axis
 * @param {number} degreeV - degree on the V axis
 * @param {Array} controlp - control points of the patch
 */
MyGraphNode.prototype.addPatch = function(uDivs, vDivs, degreeU, degreeV, controlp) {
  this.leaves.push(new MyPatch(this.scene, uDivs, vDivs, degreeU, degreeV, controlp));
}

MyGraphNode.prototype.update = function(){
  if(this.moving)
  {
    let currentTime = Date.now();
    let deltaTime = (currentTime - this.lastTime) / 1000.0;
    this.lastTime = currentTime;
    this.updateAnimations(deltaTime);
  }
  this.scene.multMatrix(this.animationsMatrix);
}

MyGraphNode.prototype.display = function(s, t){
  for (let i = 0; i < this.leaves.length; i++) {
    this.leaves[i].updateTexCoords(s, t);
    this.leaves[i].display();
  }
}
