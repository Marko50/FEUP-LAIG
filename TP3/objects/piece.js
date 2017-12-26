class piece {
  constructor(scene,team,appearence,id, distancex,distancey) {
    this.scene = scene;
    this.id = id;
    this.team = team;
    this.material = appearence;
    this.obj = new MyCylinder(scene, "1 1 1 1 20 1 1");
    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);
    mat4.translate(this.transformMatrix, this.transformMatrix, [distancex ,0,distancey]);
    mat4.rotate(this.transformMatrix, this.transformMatrix, -90 * DEGREE_TO_RAD, [1, 0, 0]);
    this.obj.piece = this;
  }

  display(){
    this.scene.registerForPick(this.id, this.obj);
    this.scene.pushMatrix();
    this.scene.multMatrix(this.transformMatrix);
    this.material.apply();
    this.obj.display();
    this.scene.popMatrix();
  }
}
