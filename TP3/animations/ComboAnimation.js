/**
  Class representing an Animation of type Combo
  @extends Animation
  @class
*/
class ComboAnimation extends Animation {
  /**
    @param {XMLScene} scene XML Scene where the animation will be represented
    @param {Number} velocity The animation's velocity
    @param {Array} animations The animations that this combo animation represents
    @constructor
  */
  constructor(scene, velocity, animations) {
    super(scene, velocity);
    this.animations = animations;
    this.index = 0;
  }

  /**
    Checks if each one of the current animation has reached its end
    @name checkStatus
    @memberof ComboAnimation
  */
  checkStatus() {
    if (!this.animations[this.index].moving) {
      this.index++;
      if (this.index == this.animations.length) {
        this.moving = false;
      }
    }
  }
  /**
    Calculates the animation's transform matrix
    @param {Number} deltaTime time bewteen updates
    @name update
    @memberof ComboAnimation
  */
  update(deltaTime) {
    this.animations[this.index].update(deltaTime);
    this.transformMatrix = this.animations[this.index].transformMatrix;
    this.checkStatus();
  }
}
