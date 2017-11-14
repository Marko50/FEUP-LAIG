class LinearAnimation extends Animation{
  constructor(scene, id, velocity, controlPoints){
    super(scene, id, velocity);
    this.cp = [];
    for(let i = 0; i < controlPoints.length; i+= 3){
      this.cp.push(vec3.fromValues(controlPoints[i],controlPoints[i+1],controlPoints[i+2]));
    }
    this.index = 0;
    this.moving = true;
    this.calcLength();
    this.calcAngle();
    this.calcVelocity();
    this.posX = 0;
    this.posZ = 0;
  }

  calcLength(){
    let direction = vec3.create();
    vec3.sub(direction, this.cp[this.index], this.cp[this.index+1]);
    this.length = vec3.length(direction);
  }

  calcAngle(){
    this.cosAngle = (this.cp[this.index+1][0] - this.cp[this.index][0])/this.length;
    this.sinAngle = (this.cp[this.index+1][2] - this.cp[this.index][2])/this.length;
    this.angle;
    if(this.cosAngle > 0 && this.ssinAngle > 0){
      this.angle = Math.acos(cosAngle);
    }
    else if(this.cosAngle > 0 && this.sinAngle < 0){
      this.angle = Math.PI*3/2 + Math.acos(cosAngle);
    }
    else if(this.cosAngle < 0 && this.sinAngle > 0){
      this.angle = Math.PI/2 + Math.acos(cosAngle);
    }
    else if(this.cosAngle < 0 && this.sinAngle < 0){
      this.angle = Math.PI + Math.acos(cosAngle);
    }
  }

  calcVelocity(){
    this.vx = this.velocity * this.cosAngle;
    this.vz = this.velocity * this.sinAngle;
  }

  checkPositionStatus(){
    if(this.index == this.cp.length - 1){
      this.moving = false;
    }
    else if(this.posX == this.cp[this.index+1][0] && this.posZ == this.cp[this.index+1][2]){
      index++;
      this.calcLength();
      this.calcAngle();
      this.calcVelocity();
    }
  }

  update(currentTime){
    //console.log("CurrentTime: " + currentTime);
    let deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    //console.log(this.index);
    if(this.moving){
      this.posX += deltaTime * this.vx;
      this.posZ += deltaTime * this.vz;
      //console.log("posX: " + this.posX);
    //  console.log("posZ: " + this.posZ);
      mat4.translate(this.transformMatrix, this.transformMatrix, [this.posX, 0,this.posZ]);
      //mat4.translate(this.transformMatrix, this.transformMatrix, [this.cp[this.index][0],this.cp[this.index][1],this.cp[this.index][2]]);
      //mat4.rotate(this.transformMatrix, this.transformMatrix, this.angle , [0, 1, 0]);
      this.scene.multMatrix(this.transformMatrix);
    }
    else{
      mat4.translate(this.transformMatrix, this.transformMatrix, [this.posX, 0,this.posZ]);
    //  mat4.translate(this.transformMatrix, this.transformMatrix, [this.cp[this.index][0],this.cp[this.index][1],this.cp[this.index][2]]);
    //  mat4.rotate(this.transformMatrix, this.transformMatrix, this.angle , [0, 1, 0]);
      this.scene.multMatrix(this.transformMatrix);
    }
    this.checkPositionStatus();
  }


}
