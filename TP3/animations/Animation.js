/**
  Class representing an animation
  @class
*/
class Animation{
  /**
    Creates an animation
    @constructor
    @param {XMLScene} scene XML Scene where the animation will be represented
    @param {Number} velocity The velocity of the animation
  */
  constructor(scene,velocity){
    this.scene=scene;
    this.velocity = velocity;
    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);
    this.moving = true;
  }
}
