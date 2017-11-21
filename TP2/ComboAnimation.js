class ComboAnimation extends Animation{
  constructor(scene, id, velocity, animations){
    super(scene, id, velocity);
    this.animations = animations;
    this.index = 0;
  }

  checkStatus(){
    if(!this.animations[this.index].moving){
      this.index++;
      if(this.index == this.animations.length){
        this.moving = false;
      }
    }
  }

  update(currentTime){
    if(this.moving){
        this.animations[this.index].update(currentTime);
        this.checkStatus();
    }
    else{
      this.animations[this.index].update(currentTime);
    }

  }
}
