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
  this.currentTime = Date.now();
  this.elapsedTime = 0;
  this.winsTeam1 = 0;
  this.winsTeam2 = 0;
  this.selectedAmbient =3;
  this.ambientlength=3;
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
}

XMLscene.prototype.logPicking = function ()
{
	if (this.pickMode == false && !this.game.finished) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				let obj = this.pickResults[i][0];
        if(obj){
          let customId = this.pickResults[i][1];
  				console.log("Picked object: " + obj + ", with pick id " + customId);
          this.game.parseSelected(obj);
          }
        }
			}
			this.pickResults.splice(0,this.pickResults.length);
		}
}

XMLscene.prototype.startGameHuman = function(){
  this.game = new Game(this);
  this.game.startGame();
  this.game.human = true;
}

XMLscene.prototype.startGamePCEasy = function(){
  this.game = new Game(this);
  this.game.startGame();
  this.game.pceasy = true;
}

XMLscene.prototype.startGameHard = function(){
  this.game = new Game(this);
  this.game.startGame();
  this.game.pchard = true;
}


XMLscene.prototype.undo = function(){
  this.game.rollBack();
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
  this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
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
  this.interface.addStartGame();
  this.interface.addScenesGroup();
  this.interface.addUndo();
}

/**
 * Displays the scene.
 * @function
 * @memberof XMLscene
 * @name display
 */
XMLscene.prototype.display = function() {
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
