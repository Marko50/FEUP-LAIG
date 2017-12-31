/**
  Class representing a piece
  @class
*/
class piece {
  /**
    Creates a piece
    @constructor
    @param {XMLscene} scene Scene where the piece will be represented
    @param {Number} team Team wither 1 or 2
    @param {CGFappearance} appearence Material used on the piece
    @param {Number} id Identificator for picking
    @param {Character} sign Signature, either 'o' or 'x'
    @param {Number} distancex x spacial coordinate
    @param {Number} distancey y spacial coordinate
  */
  constructor(scene,team,appearence,id,sign, distancex,distancey) {
    this.scene = scene;
    this.posX = distancex;
    this.posZ = distancey;
    this.selected = false;
    this.id = id;
    this.type = "piece";
    this.signature = sign;
    this.moving = false;
    this.animation = null;
    this.team = team;
    this.elegible = true;
    this.material = appearence;
    this.obj = new MyCylinder(scene, "1 1 1 1 20 1 1");
    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);
    mat4.translate(this.transformMatrix, this.transformMatrix, [distancex ,0,distancey]);
    mat4.rotate(this.transformMatrix, this.transformMatrix, -90 * DEGREE_TO_RAD, [1, 0, 0]);
    this.originalTransformMatrix = mat4.create();
    mat4.identity(this.originalTransformMatrix);
    mat4.translate(this.originalTransformMatrix, this.originalTransformMatrix, [distancex ,0,distancey]);
    mat4.rotate(this.originalTransformMatrix, this.originalTransformMatrix, -90 * DEGREE_TO_RAD, [1, 0, 0]);
  }

  /**
    Updates the piece animation
    @name updateMovement
    @param {Number} currentTime - time between frames
    @memberof piece
  */
  updateMovement(currentTime){
    if(this.moving){
      if(this.animation.moving){
        this.animation.update(currentTime);
        this.transformMatrix = this.animation.transformMatrix;
        mat4.rotate(this.transformMatrix, this.transformMatrix, -90 * DEGREE_TO_RAD, [1, 0, 0]);
      }
      else{
        this.moving = false;
      }
    }
  }

  /**
    Displays the piece
    @name display
    @param {Number} currentTime - time between frames
    @memberof piece
  */
  display(currentTime){
    this.scene.registerForPick(this.id, this);
    this.updateMovement(currentTime);
    this.scene.pushMatrix();
    this.scene.multMatrix(this.transformMatrix);
    this.material.apply();
    if(this.selected)
    {
      this.scene.setActiveShader(this.scene.selectShader);
      this.obj.display();
      this.scene.setActiveShader(this.scene.defaultShader);
    }
    else this.obj.display();
    this.scene.popMatrix();
  }
}
