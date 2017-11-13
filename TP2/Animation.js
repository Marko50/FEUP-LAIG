class Animation{
  constructor(scene,id,velocity){
    this.scene=scene;
    this.id=id;
    this.velocity = velocity;
    this.lastTime = Date.now()/1000.0;
  }
}
