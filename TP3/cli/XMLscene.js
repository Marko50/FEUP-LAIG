var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 * @param {MyInterface} interface - GUI interface
 */
function XMLscene(interface) {
  CGFscene.call(this);
  this.interface = interface;
  this.lightValues = {};

  this.selectedCell = null;
  this.selectedPiece = null;
  this.currentTime = Date.now();
  this.elapsedTime = 0;
  this.winsTeam1 = 0;
  this.winsTeam2 = 0;
  this.selectedAmbient =3;
  this.selectedCamera=1;
  this.actualCamera=1;
  this.ambientlength=3;
  this.lastCurrTime=0;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function(application) {
  CGFscene.prototype.init.call(this, application);

  this.initCameras();

  this.enableTextures(true);

  this.gl.clearDepth(100.0);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.enable(this.gl.CULL_FACE);
  this.gl.depthFunc(this.gl.LEQUAL);

  this.setPickEnabled(true);
  this.axis = new CGFaxis(this);
  this.game = new Game(this);
  this.selectShader = new CGFshader(this.gl, "../shaders/selec.vert", "../shaders/selec.frag");
}

XMLscene.prototype.logPicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				let obj = this.pickResults[i][0];
        if(obj){
          this.game.parseSelected(obj);
          // let customId = this.pickResults[i][1];
					// console.log("Picked object: " + obj + ", with pick id " + customId);
        }
			}
			this.pickResults.splice(0,this.pickResults.length);
		}
	}
}

XMLscene.prototype.startGameHuman = function(){
  this.game = new Game(this);
  this.game.startGame();
  this.game.human = true;
  if(this.interface.film){
    this.interface.removeFilmOption();
  }
}

XMLscene.prototype.startGamePCEasy = function(){
  this.game = new Game(this);
  this.game.startGame();
  this.game.pceasy = true;
  if(this.interface.film){
    this.interface.removeFilmOption();
  }
}

XMLscene.prototype.startGameHard = function(){
  this.game = new Game(this);
  this.game.startGame();
  this.game.pchard = true;
  if(this.interface.film){
    this.interface.removeFilmOption();
  }
}


XMLscene.prototype.undo = function(){
  this.game.rollBack();
}

XMLscene.prototype.film = function (index) {
  this.game.prepareMovie();
}


/**
 * Initializes the scene lights with the values read from the LSX file.
 * @function
 * @memberof XMLscene
 * @name initLights
 */
XMLscene.prototype.initLights = function() {
  var i = 0;
  // Lights index.

  // Reads the lights from the scene graph.
  for (var key in this.graph.lights) {
    if (i >= 8)
      break; // Only eight lights allowed by WebGL.

    if (this.graph.lights.hasOwnProperty(key)) {
      var light = this.graph.lights[key];

      this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
      this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
      this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
      this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);

      this.lights[i].setVisible(true);
      if (light[0])
        this.lights[i].enable();
      else
        this.lights[i].disable();

      this.lights[i].update();

      i++;
    }
  }

}

/**
 * Initializes the scene cameras.
 * @function
 * @memberof XMLscene
 * @name initCameras
 */
XMLscene.prototype.initCameras = function() {
  //this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));

  this.cameraPerspectives = [];
  this.cameraPerspectives[0] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(50, 50, 50), vec3.fromValues(0, 0, 0));
  this.cameraPerspectives[1] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(150, 150, 150), vec3.fromValues(0, -5, 0));
  this.cameraPerspectives[2] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(-5, 150, 1), vec3.fromValues(5, 0, 1));

  this.cameraAnimation = null;
  this.camera = this.cameraPerspectives[this.selectedCamera-1];
}

/** Handler called when the graph is finally loaded.
 * As loading is asynchronous, this may be called already after the application has started the run loop
 * @function
 * @memberof XMLscene
 * @name onGraphLoaded
 */
XMLscene.prototype.onGraphLoaded = function() {
  this.camera.near = this.graph.near;
  this.camera.far = this.graph.far;
  this.axis = new CGFaxis(this, this.graph.referenceLength);

  this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1],
    this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);

  this.gl.clearColor(0.5, 0.3, 0.2, this.graph.background[3]);

  this.initLights();

  // Adds lights group.
  this.interface.addLightsGroup(this.graph.lights);
  this.interface.addScenesGroup();
  this.interface.addCameraPerspetives();
  this.interface.addStartGame();
  this.interface.addUndo();
  //this.interface.addFilmOption();
}

/**
 * Displays the scene.
 * @function
 * @memberof XMLscene
 * @name display
 */
XMLscene.prototype.display = function() {
  document.getElementById('time').innerHTML = Math.round(this.game.elapsedTime);
  document.getElementById('scoreTeam').innerHTML = "Home " + this.winsTeam1 + " " + this.winsTeam2  + " Away";

  // ---- BEGIN Background, camera and axis setup
  this.logPicking();

  let time = Date.now();
  let deltaTime = (time - this.currentTime)/1000;
  this.elapsedTime += deltaTime;
  this.currentTime = time;

  // Clear image and depth buffer everytime we update the scene
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


  // Initialize Model-View matrix as identity (no transformation
  this.updateProjectionMatrix();
  this.loadIdentity();

  // Apply transformations corresponding to the camera position relative to the origin
  this.applyViewMatrix();

  this.pushMatrix();

  if (this.graph.loadedOk) {
    // Applies initial transformations.
    this.multMatrix(this.graph.initialTransforms);

    // Draw axis
    this.axis.display();

    var i = 0;
    //Lights
    for (var key in this.lightValues) {
      if (this.lightValues.hasOwnProperty(key)) {
        if (this.lightValues[key]) {
          this.lights[i].setVisible(true);
          this.lights[i].enable();
        } else {
          this.lights[i].setVisible(false);
          this.lights[i].disable();
        }
        this.lights[i].update();
        i++;
      }
    }
    //Inserts the scenes ambient not wanted
    for(let i=0; i<this.ambientlength;i++){
      if((i+1)!=this.selectedAmbient){
        if(this.graph.NOTselectedAmbient.indexOf((i+1))==-1){
        this.graph.NOTselectedAmbient.push(i+1);
        }
      }
      else{
        if(this.graph.NOTselectedAmbient.indexOf((i+1))!=-1){
          let k=this.graph.NOTselectedAmbient.indexOf((i+1));
          this.graph.NOTselectedAmbient.splice(k,1);
        }
      }
    }
	  
    if(this.actualCamera != this.selectedCamera){

      this.position1 = vec3.fromValues(50, 50, 50);
      this.position2 = vec3.fromValues(150, 150, 150);
      this.position3 = vec3.fromValues(-5, 150, 1);

      this.direction1 = vec3.fromValues(0, 0, 0);
      this.direction2 = vec3.fromValues(0, -5, 0);
      this.direction3 = vec3.fromValues(0, -5, 0);

      this.position=[this.position1,this.position2,this.position3];
      this.direction=[this.direction1,this.direction2,this.direction3];

      this.cameraAnimation = new CameraAnimation(this.position[this.selectedCamera-1],this.position[this.actualCamera-1],this.direction[this.selectedCamera-1],this.direction[this.actualCamera-1]);
      this.actualCamera = this.selectedCamera;
      }

    this.update(this.currentTime);
    this.interface.setActiveCamera(this.camera);


    // Displays the scene.
    this.graph.displayScene();


    this.game.display(deltaTime);



  } else {
    // Draw axis
    this.axis.display();
  }

  this.clearPickRegistration();
  this.popMatrix();
  // ---- END Background, camera and axis setup

}



XMLscene.prototype.update = function(currTime) {

    if (this.cameraAnimation != null) {
    var deltaTime = currTime - this.lastCurrTime;
    this.animateCamera(deltaTime);
  }
  this.lastCurrTime = currTime;
};

XMLscene.prototype.animateCamera = function (deltaTime) {

	var animation = this.cameraAnimation;
	var camera = this.camera;

	if (this.lastCurrTime != 0)
		if (Math.abs(animation.travelledPosDist[0]) < Math.abs(animation.Distance[0]) ||
			Math.abs(animation.travelledPosDist[1]) < Math.abs(animation.Distance[1]) ||
			Math.abs(animation.travelledPosDist[2]) < Math.abs(animation.Distance[2]) ||
			Math.abs(animation.travelledDirDist[0]) < Math.abs(animation.dirDist[0]) ||
			Math.abs(animation.travelledDirDist[1]) < Math.abs(animation.dirDist[1]) ||
			Math.abs(animation.travelledDirDist[2]) < Math.abs(animation.dirDist[2]) ) {


			let distPosX = animation.velPos[0] * deltaTime;
			let distPosY = animation.velPos[1] * deltaTime;
			let distPosZ = animation.velPos[2] * deltaTime;

			if(Math.abs(animation.travelledPosDist[0]) < Math.abs(animation.Distance[0])) {

				camera.position[0] += distPosX;
				animation.travelledPosDist[0] += distPosX;

			}

			if(Math.abs(animation.travelledPosDist[1]) < Math.abs(animation.Distance[1])) {

				camera.position[1] += distPosY;
				animation.travelledPosDist[1] += distPosY;

			}

			if(Math.abs(animation.travelledPosDist[2]) < Math.abs(animation.Distance[2])) {

				camera.position[2] += distPosZ;
				animation.travelledPosDist[2] += distPosZ;

			}

			let distDirX = animation.velDir[0] * deltaTime;
			let distDirY = animation.velDir[1] * deltaTime;
			let distDirZ = animation.velDir[2] * deltaTime;

			if(Math.abs(animation.travelledDirDist[0]) < Math.abs(animation.dirDist[0])) {

				camera.target[0] += distDirX;
				camera.direction[0] += distDirX;
				animation.travelledDirDist[0] += distDirX;

			}

			if(Math.abs(animation.travelledDirDist[1]) < Math.abs(animation.dirDist[1])) {

				camera.target[1] += distDirY;
				camera.direction[1] += distDirY;
				animation.travelledDirDist[1] += distDirY;

			}

			if(Math.abs(animation.travelledDirDist[2]) < Math.abs(animation.dirDist[2])) {

				camera.target[2] += distDirZ;
				camera.direction[2] += distDirZ;
				animation.travelledDirDist[2] += distDirZ;

			}

		} else {

    vec3.copy(camera.position, animation.destinationPos);
    vec3.copy(camera.direction, animation.destinationDir);
    vec3.copy(camera.target, animation.destinationDir);
		this.cameraAnimation = null;

		}
    this.camera=camera;
}

