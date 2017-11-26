/**
  Class representing an Animation of type Circular
  @extends Animation
*/
class CircularAnimation extends Animation{
  /**
    Creates a Ciruclar animation
    @constructor
    @param {XMLScene} scene XML Scene where the animation will be represented
    @param {Number} velocity The animation velocity
    @param {Array} center The animation's center
    @param {Number} radius The animation's radius
    @param {Number} startang The initial angle that the object has to rotate
    @param {Number} rotang The total angle that the object has to rotate
   */
  constructor(scene,velocity, center, radius, startang, rotang){
    super(scene,velocity);
    var DEGREE_TO_RAD = Math.PI/180;
    this.animationCenter = vec3.fromValues(center[0],center[1],center[2]);
    this.startAngle = startang * DEGREE_TO_RAD;
    this.rotAngle = rotang * DEGREE_TO_RAD;
    this.animationRadius = radius;
    this.elapsedTime = 0;
    this.angle = 0;
    this.angularVelocity = this.velocity / this.animationRadius;
    this.moving = true;
    this.posY = this.animationCenter[1];
    this.aux = mat4.create();
    mat4.identity(this.aux);
  }
  /**
    Checks if the animation has reached its end
    @name checkPositionStatus
    @memberof CircularAnimation
  */
  checkPositionStatus(){
    if(this.angle >= this.rotAngle){
      this.moving = false;
    }
  }
  /**
    Calculates the position of the object in the animation as well as the angle
    @param {Number} deltaTime time between updates
    @name calcPosition
    @memberof CircularAnimation
  */
  calcPosition(deltaTime){
    this.angle += this.startAngle + this.angularVelocity*deltaTime;
    this.posX = Math.cos(this.angle) * this.animationRadius;
    this.posZ = Math.sin(this.angle) * this.animationRadius;
  }
  /**
    Calculates the animation's transform matrix.
    @param {Number} deltaTime time between updates
    @name update
    @memberof CircularAnimation
  */
  update(deltaTime) {
    this.elapsedTime += deltaTime;
    this.calcPosition(deltaTime);
    mat4.translate(this.transformMatrix, this.aux, [this.animationCenter[0], this.animationCenter[1], this.animationCenter[2]]);
    mat4.translate(this.transformMatrix, this.transformMatrix, [this.posX, this.posY, this.posZ]);
    mat4.rotate(this.transformMatrix, this.transformMatrix, -this.startAngle + this.angle, [0, 1, 0]);
    this.checkPositionStatus();
  }
}
