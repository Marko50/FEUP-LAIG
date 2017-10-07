/**
 * MyGraphNode class, representing an intermediate node in the scene graph.
 * @constructor
**/

function MyGraphNode(graph, nodeID) {
    this.graph = graph;
    this.scene = graph.scene;
    this.nodeID = nodeID;

    // IDs of child nodes.
    this.children = [];

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
 */
MyGraphNode.prototype.addChild = function(nodeID) {
    this.children.push(nodeID);
}

/**
 * Adds a leaf to this node's leaves array.
 */
MyGraphNode.prototype.addLeaf = function(leaf,coords) {
  //  this.leaves.push(leaf);
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


MyGraphNode.prototype.display = function(){
  for(var i = 0; i < this.leaves.length; i++){
    this.leaves[i].display();
  }
}
