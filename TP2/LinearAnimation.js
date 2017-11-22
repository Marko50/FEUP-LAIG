class LinearAnimation extends Animation {
  constructor(scene, velocity, controlPoints) {
    super(scene, velocity);
    this.cp = [];
    for (let i = 0; i < controlPoints.length; i += 3) {
      this.cp.push(vec3.fromValues(controlPoints[i], controlPoints[i + 1], controlPoints[i + 2]));
    }
    this.index = 0;
    this.aux = mat4.create();
    mat4.identity(this.aux);
    this.calcLength();
    this.calcAngle();
    this.calcVelocity();
  }

  calcLength() {
    this.posX = this.cp[this.index][0];
    this.posZ = this.cp[this.index][2];
    this.posY = this.cp[this.index][1];
    let direction = vec3.create();
    vec3.sub(direction, this.cp[this.index], this.cp[this.index + 1]);
    this.length= vec3.length(direction);
    this.timeForFrame = this.length/this.velocity;
    this.elapsedTime = 0;
  }

  calcAngle() {
    this.cosAngle = (this.cp[this.index + 1][0] - this.cp[this.index][0]) / this.length;
    this.yModifier = (this.cp[this.index + 1][1] - this.cp[this.index][1])/Math.abs(this.cp[this.index + 1][1] - this.cp[this.index][1]);
    this.sinAngle = (this.cp[this.index + 1][2] - this.cp[this.index][2]) / this.length;
    if(this.cosAngle == 0){
      this.angle = Math.PI/2;
    }
    else if(this.sinAngle == 0){
      this.angle = 0;
    }
    else if (this.cosAngle > 0 && this.sinAngle > 0) {
      this.angle = Math.acos(this.cosAngle);
    } else if (this.cosAngle > 0 && this.sinAngle < 0) {
      this.angle = Math.PI * 3 / 2 + Math.acos(this.cosAngle);
    } else if (this.cosAngle < 0 && this.sinAngle > 0) {
      this.angle = Math.PI / 2 + Math.acos(this.cosAngle);
    } else if (this.cosAngle < 0 && this.sinAngle < 0) {
      this.angle = Math.PI + Math.acos(this.cosAngle);
    }
  }

  calcVelocity() {
    this.vx = this.velocity * this.cosAngle;
    this.vz = this.velocity * this.sinAngle;
    this.vy = Math.sqrt(this.velocity*this.velocity - this.vx*this.vx - this.vz*this.vz)*this.yModifier;
  }

  checkPositionStatus() {
    if (this.elapsedTime >= this.timeForFrame) {
      this.index++;
      if (this.index == this.cp.length - 1) {
        this.moving = false;
      }
      else{
        this.calcLength();
        this.calcAngle();
        this.calcVelocity();
      }
    }
  }

  update(currentTime) {
    if (this.moving) {
      let deltaTime = (currentTime - this.lastTime) / 1000.0;
      this.elapsedTime += deltaTime;
      this.lastTime = currentTime;
      this.posX += deltaTime * this.vx;
      this.posZ += deltaTime * this.vz;
      this.posY += deltaTime * this.vy;
      mat4.translate(this.transformMatrix, this.aux, [this.posX, this.posY, this.posZ]);
      mat4.translate(this.transformMatrix, this.transformMatrix ,[0,0,0]);
      mat4.rotate(this.transformMatrix, this.transformMatrix, this.angle, [0,1,0]);
      this.checkPositionStatus();
    } else {
      mat4.translate(this.transformMatrix, this.aux, [this.posX, this.posY, this.posZ]);
      mat4.translate(this.transformMatrix, this.transformMatrix, [0,0,0]);
      mat4.rotate(this.transformMatrix, this.transformMatrix, this.angle, [0,1,0]);
    }
  }


}
