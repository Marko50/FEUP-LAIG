
function Gamescene(interface) {
  CGFscene.call(this);
  this.cameras = [];
  this.interface = interface;
}

Gamescene.prototype = Object.create(CGFscene.prototype);
Gamescene.prototype.constructor = Gamescene;

Gamescene.prototype.init = function(application) {
  CGFscene.prototype.init.call(this, application);

  this.initCameras();
  this.initLights();


  this.enableTextures(true);

  this.gl.clearDepth(100.0);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.enable(this.gl.CULL_FACE);
  this.gl.depthFunc(this.gl.LEQUAL);

  this.axis = new CGFaxis(this);

  this.testObject = new MyPiece(this, 0);
  this.axis = new CGFaxis(this);
}

/**
 * Initializes the scene lights
 * @function
 * @memberof Gamescene
 * @name initLights
 */
Gamescene.prototype.initLights = function() {
  this.lights[0].setPosition(1,1,1,1);
	this.lights[0].setAmbient(0.1,0.1,0.1,1);
	this.lights[0].setDiffuse(0.9,0.9,0.9,1);
	this.lights[0].setSpecular(0,0,0,1);
	this.lights[0].enable();
	this.lights[0].update();
}

/**
 * Initializes the scene cameras.
 * @function
 * @memberof XMLscene
 * @name initCameras
 */
Gamescene.prototype.initCameras = function() {
  this.cameras[0] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
  this.camera = this.cameras[0];
  this.camera.near = 0.1;
  this.camera.far = 500;
}

/** Handler called when the graph is finally loaded.
 * As loading is asynchronous, this may be called already after the application has started the run loop
 * @function
 * @memberof XMLscene
 * @name onGraphLoaded
 */
Gamescene.prototype.updateInterface = function() {

}


Gamescene.prototype.logPicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (let i=0; i< this.pickResults.length; i++) {
				let obj = this.pickResults[i][0];
				if (obj)
				{
					let customId = this.pickResults[i][1];
					console.log("Picked object: " + obj + ", with pick id " + customId);
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}
	}
}

/**
 * Displays the scene.
 * @function
 * @memberof XMLscene
 * @name display
 */
Gamescene.prototype.display = function() {
  // ---- BEGIN Background, camera and axis setup

  // Clear image and depth buffer everytime we update the scene
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

  // Initialize Model-View matrix as identity (no transformation
  this.updateProjectionMatrix();
  this.loadIdentity();

  // Apply transformations corresponding to the camera position relative to the origin
  this.applyViewMatrix();

  this.pushMatrix();
   //Lights
   for (let i = 0; i < this.lights.length; i++) {
       this.lights[i].enable();
       this.lights[i].update();
  }


  //this.testObject.display();
  this.axis.display();

  this.popMatrix();
  // ---- END Background, camera and axis setup

}
