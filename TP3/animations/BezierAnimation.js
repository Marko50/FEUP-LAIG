/**
 * Class representing an Animation of type Bezier
 * @class
 * @extends Animation
 **/
class BezierAnimation extends Animation{
  /**
    Creates a Bezier animation
    @constructor
    @param {XMLScene} scene XML Scene where the animation will be represented
    @param {Number} velocity The animation velocity
    @param {Array} controlPoints controlPoints of the animation
  */
  constructor(scene,velocity, controlPoints){
    super(scene,velocity);
    this.s = 0;
    this.aux = mat4.create();
    mat4.identity(this.aux);
    this.casteljou(controlPoints);
  }
  /**
    Does the first level of casteljou's algorithm to calculate the approximate distance of the animation
    @param {Array} controlPoints controlPoints of the animation
    @name casteljou
    @memberof BezierAnimation
  */
  casteljou(controlPoints){
    let p1 = vec3.fromValues(controlPoints[0],controlPoints[1],controlPoints[2]);
    let p2 = vec3.fromValues(controlPoints[3],controlPoints[4],controlPoints[5]);
    let p3 = vec3.fromValues(controlPoints[6],controlPoints[7],controlPoints[8]);
    let p4 = vec3.fromValues(controlPoints[9],controlPoints[10],controlPoints[11]);
    let p1p2 = vec3.fromValues((p2[0]-p1[0])/2,(p2[1]-p1[1])/2,(p2[2]-p1[2])/2);
    let p2p3 = vec3.fromValues((p3[0]-p2[0])/2,(p3[1]-p2[1])/2,(p3[2]-p2[2])/2);
    let p3p4 = vec3.fromValues((p4[0]-p3[0])/2,(p4[1]-p3[1])/2,(p4[2]-p3[2])/2);
    let p1p2p3 = vec3.fromValues((p2p3[0]-p1p2[0])/2,(p2p3[1]-p1p2[1])/2 ,(p2p3[2]-p1p2[2])/2);
    let p2p3p4 = vec3.fromValues((p3p4[0]-p2p3[0])/2,(p3p4[1]-p2p3[1])/2 ,(p3p4[2]-p2p3[2])/2);

    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.p4 = p4;

    this.x = this.p1[0];
    this.y = this.p1[1];
    this.z = this.p1[2];

    let v112 = vec3.create();
    let d112;;
    vec3.subtract(v112, p1p2, p1);
    d112 = vec3.length(v112);

    let v12123= vec3.create();
    let d12123;
    vec3.subtract(v12123, p1p2p3, p1p2);
    d12123 = vec3.length(v12123);

    let v123234= vec3.create();
    let d123234;
    vec3.subtract(v123234, p2p3p4, p1p2p3);
    d123234 = vec3.length(v123234);

    let v23434= vec3.create();
    let d23434;
    vec3.subtract(v23434,p3p4,p2p3p4);
    d23434 = vec3.length(v23434);

    let v344= vec3.create();
    let d344;
    vec3.subtract(v344,p4,p3p4);
    d344 = vec3.length(v344);

    let d = d112 + d12123 + d123234 + d23434 + d344;

    this.T = d/this.velocity;
  }
  /**
    Calculates the position of the object in the animation
    @param {Number} deltaTime time between updates
    @name calcPosition
    @memberof BezierAnimation
  */
  calcPosition(deltaTime){
    let param1 = Math.pow(1-this.s,3);
    let param2 = 3*this.s*(1-Math.pow(this.s,2));
    let param3 = 3*Math.pow(this.s, 2)*(1-this.s);
    let param4 = Math.pow(this.s, 3);

    let newX = param1 * this.p1[0] + param2 * this.p2[0] + param3 * this.p3[0] + param4 * this.p4[0];
    let newY = param1 * this.p1[1] + param2 * this.p2[1] + param3 * this.p3[1] + param4 * this.p4[1];
    let newZ = param1 * this.p1[2] + param2 * this.p2[2] + param3 * this.p3[2] + param4 * this.p4[2];

    this.angle = Math.atan2(newX - this.x, newZ - this.z);

    this.x = newX;
    this.y = newY;
    this.z = newZ;

    this.s += deltaTime/this.T;
  }

  /**
    Checks if the animation has reached its end
    @name checkPositionStatus
    @memberof BezierAnimation
  */
  checkPositionStatus(){
    if(this.s >= 1 ){
      this.moving = false;
    }
  }

  /**
    Calculates the animation's transform matrix
    @param {Number} deltaTime time between updates
    @name update
    @memberof BezierAnimation
  */
  update(deltaTime) {
    mat4.translate(this.transformMatrix, this.aux, [this.x, this.y, this.z]);
    //mat4.rotate(this.transformMatrix, this.transformMatrix, this.angle, [0, 1, 0]);
    this.calcPosition(deltaTime);
    this.checkPositionStatus();
  }
}
