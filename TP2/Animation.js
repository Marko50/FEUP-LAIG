class Animation{
  constructor(scene,velocity){
    this.scene=scene;
    this.velocity = velocity;
    this.lastTime = Date.now();
    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);
    this.moving = true;
  }
}
