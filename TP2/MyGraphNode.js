/**
 * MyGraphNode
 * @param {MySceneGraph} graph - graph passed to the node constructor.
 * @param {String} nodeID - the identifier of the node
 * @constructor
**/
function MyGraphNode(graph, nodeID) {
    this.graph = graph;
    this.scene = graph.scene;
    this.nodeID = nodeID;

    // IDs of child nodes.
    this.children  = [];

    // IDs of child nodes.
    this.leaves = [];

    // The material ID.
    this.materialID = null ;

    // The texture ID.
    this.textureID = null ;

    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);

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
MyGraphNode.prototype.addLeaf = function(leaf,coords) {
  if(leaf == "rectangle"){
    this.leaves.push(new MyRectangle(this.scene,coords));
  }
  else if (leaf == "triangle") {
    this.leaves.push(new MyTriangle(this.scene, coords));
  }
  else if (leaf == "cylinder"){
    this.leaves.push(new MyCylinder(this.scene, coords));
  }
  else if(leaf == "sphere")
  {
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
MyGraphNode.prototype.addPatch = function(uDivs,vDivs,degreeU,degreeV,controlp){
  this.leaves.push(new MyPatch(this.scene,uDivs,vDivs,degreeU,degreeV,controlp));
}
