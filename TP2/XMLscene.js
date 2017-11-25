var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 * @param {MyInterface} interface - GUI interface
 */
function XMLscene(interface) {
  this.elapsedTime = 0;
  this.currentTime = Date.now();
  CGFscene.call(this);
  this.interface = interface;
  this.nodesSelectableValues = {};
  this.lightValues = {};
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.7
 * @function
 * @memberof XMLscene
 * @name init
 */
XMLscene.prototype.init = function(application) {
  CGFscene.prototype.init.call(this, application);

  this.initCameras();

  this.enableTextures(true);

  this.gl.clearDepth(100.0);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.enable(this.gl.CULL_FACE);
  this.gl.depthFunc(this.gl.LEQUAL);
  this.shaders = [
    ["test", new CGFshader(this.gl, "shaders/test.vert", "shaders/test.frag")],
    ["cenas", new CGFshader(this.gl, "shaders/test.vert", "shaders/test2.frag")],
    ["variable", new CGFshader(this.gl, "shaders/variable.vert", "shaders/test.frag")]
  ];
  this.selectedShader = 0;

  this.axis = new CGFaxis(this);
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

  this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

  this.initLights();

  // Adds lights group.
  this.interface.addLightsGroup(this.graph.lights);
  //Ads nodes selectable group
  this.interface.addSelectablesGroup(this.graph.nodes);
  //Ads the shaders group
  this.interface.addShadersGroup();
}

/**
 * Displays the scene.
 * @function
 * @memberof XMLscene
 * @name display
 */
XMLscene.prototype.display = function() {
  // ---- BEGIN Background, camera and axis setup

  // Clear image and depth buffer everytime we update the scene
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

  let timeF = Math.cos(this.elapsedTime);
  this.shaders[2][1].setUniformsValues({timeFactor: timeF});

  let time = Date.now();
  let deltaTime = (time - this.currentTime)/1000;
  this.elapsedTime += deltaTime;
  this.currentTime = time;

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
    //Nodes
    for (var key in this.nodesSelectableValues) {
      if (this.nodesSelectableValues.hasOwnProperty(key)) {
        if (this.nodesSelectableValues[key]) {
          this.graph.nodes[key].selected = true;
        } else {
          this.graph.nodes[key].selected = false;
        }
      }
    }
    // Displays the scene.
    this.graph.displayScene();

  } else {
    // Draw axis
    this.axis.display();
  }


  this.popMatrix();
  // ---- END Background, camera and axis setup

}
