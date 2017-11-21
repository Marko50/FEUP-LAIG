class CircularAnimation extends Animation{
  constructor(scene, id, velocity, center, radius, startang, rotang){
    super(scene, id, velocity);
    var DEGREE_TO_RAD = Math.PI/180;
    this.animationCenter = vec3.fromValues(center[0],center[1],center[2]);
    this.startAngle = startang * DEGREE_TO_RAD;
    this.rotAngle = rotang * DEGREE_TO_RAD;
    this.animationRadius = radius;
    this.elapsedTime = 0;
    this.angle = 0;
    this.angularVelocity = this.velocity / this.animationRadius;
    this.posY = this.animationCenter[1];
    this.aux = mat4.create();
    mat4.identity(this.aux);
  }

  checkPositionStatus(){
    if(this.angle >= this.rotAngle){
      this.moving = false;
    }
  }

  calcPosition(deltaTime){
    this.angle += this.startAngle + this.angularVelocity*deltaTime;
    this.posX = Math.cos(this.angle) * this.animationRadius;
    this.posZ = Math.sin(this.angle) * this.animationRadius;
  }

  update(currentTime){
    if(this.moving){
      let deltaTime = (currentTime - this.lastTime)/1000.0;
      this.lastTime = currentTime;
      this.elapsedTime += deltaTime;
      this.calcPosition(deltaTime);
      mat4.translate(this.transformMatrix, this.aux, [this.animationCenter[0], this.animationCenter[1],this.animationCenter[2]]);
      mat4.translate(this.transformMatrix, this.transformMatrix, [this.posX, this.posY, this.posZ]);
      mat4.rotate(this.transformMatrix, this.transformMatrix,this.startAngle - this.angle, [0, 1, 0]);
      this.checkPositionStatus();
    }
    else{
      mat4.translate(this.transformMatrix, this.aux, [this.animationCenter[0], this.animationCenter[1],this.animationCenter[2]]);
      mat4.translate(this.transformMatrix, this.transformMatrix, [this.posX, this.posY, this.posZ]);
      mat4.rotate(this.transformMatrix, this.transformMatrix, this.startAngle + this.angle, [0, 1, 0]);
    }
  }
}
