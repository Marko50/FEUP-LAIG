/**
  Class representing an Animation of type Linear
  @extends Animation
*/
class LinearAnimation extends Animation {
  /**
    Creates a Linear animation
    @constructor
    @param {XMLScene} scene XML Scene where the animation will be represented
    @param {Number} velocity The animation velocity
    @param {Array} controlPoints controlPoints of the animation
  */
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
  /**
    Calculates the length of the current frame as well as its duration
    @name calcLength
    @memberof LinearAnimation
  */
  calcLength() {
    this.posX = this.cp[this.index][0];
    this.posZ = this.cp[this.index][2];
    this.posY = this.cp[this.index][1];
    let direction = vec3.create();
    vec3.sub(direction, this.cp[this.index], this.cp[this.index + 1]);
    this.length = vec3.length(direction);
    this.timeForFrame = this.length / this.velocity;
    this.elapsedTime = 0;
  }
  /**
    Calculates the angle of two consecutive frame diretions
    @name calcAngle
    @memberof LinearAnimation
  */
  calcAngle() {
    this.cosAngle = (this.cp[this.index + 1][0] - this.cp[this.index][0]) / this.length;
    let aux = (this.cp[this.index + 1][1] - this.cp[this.index][1]);
    if (aux == 0) this.yModifier = 0;
    else this.yModifier = (this.cp[this.index + 1][1] - this.cp[this.index][1]) / Math.abs(this.cp[this.index + 1][1] - this.cp[this.index][1]);
    this.sinAngle = (this.cp[this.index + 1][2] - this.cp[this.index][2]) / this.length;
    if (this.cosAngle == 0) {
      if (this.sinAngle == -1) this.angle = Math.PI / 2;
      else this.angle = 3 * Math.PI / 2;
    }
    else if (this.sinAngle == 0) {
      if (this.cosAngle == -1) this.angle = 0;
      else this.angle = Math.PI;
    } else if (this.cosAngle > 0 && this.sinAngle > 0) {
      this.angle = Math.acos(this.cosAngle);
    } else if (this.cosAngle > 0 && this.sinAngle < 0) {
      this.angle = Math.PI * 3 / 2 + Math.acos(this.cosAngle);
    } else if (this.cosAngle < 0 && this.sinAngle > 0) {
      this.angle = Math.PI / 2 + Math.acos(this.cosAngle);
    } else if (this.cosAngle < 0 && this.sinAngle < 0) {
      this.angle = Math.PI + Math.acos(this.cosAngle);
    }
  }
  /**
    Calculates the velocity in each axis
    @name calcVelocity
    @memberof LinearAnimation
  */
  calcVelocity() {
    this.vx = this.velocity * this.cosAngle;
    this.vz = this.velocity * this.sinAngle;
    this.vy = Math.sqrt(Math.round(this.velocity * this.velocity - this.vx * this.vx - this.vz * this.vz, 3)) * this.yModifier;
  }
  /**
    Checks if the current frame has reached its end
    @name checkPositionStatus
    @memberof LinearAnimation
  */
  checkPositionStatus() {
    if (this.elapsedTime >= this.timeForFrame) {
      this.index++;
      if (this.index == this.cp.length - 1) {
        this.moving = false;
      } else {
        this.calcLength();
        this.calcAngle();
        this.calcVelocity();
      }
    }
  }
  /**
    calculates the animation's transform matrix
    @param {Number} deltaTime
    @name update
    @memberof LinearAnimation
  */
  update(deltaTime) {
    this.elapsedTime += deltaTime;
    this.posX += deltaTime * this.vx;
    this.posZ += deltaTime * this.vz;
    this.posY += deltaTime * this.vy;
    mat4.translate(this.transformMatrix, this.aux, [this.cp[this.index][0], this.cp[this.index][1],this.cp[this.index][2]]);
    mat4.translate(this.transformMatrix, this.transformMatrix, [this.posX, this.posY, this.posZ]);
    mat4.rotate(this.transformMatrix, this.transformMatrix, this.angle, [0, 1, 0]);
    this.checkPositionStatus();
    }


  }
