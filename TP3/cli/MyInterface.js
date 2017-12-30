 /**
 * MyInterface class, creating a GUI interface.
 * @constructor
 */
function MyInterface() {
    //call CGFinterface constructor
    CGFinterface.call(this);
}
;

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * Initializes the interface.
 * @function
 * @name init
 * @memberof MyInterface
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
    // call CGFinterface init
    CGFinterface.prototype.init.call(this, application);

    // init GUI. For more information on the methods, check:
    //  http://workshop.chromeexperiments.com/examples/gui

    this.gui = new dat.GUI();

    // add a group of controls (and open/expand by defult)

    return true;
};

/**
 * Adds a folder containing the IDs of the lights passed as parameter.
 * @function
 * @name addLightsGroup
 * @memberof MyInterface
 */
MyInterface.prototype.addLightsGroup = function(lights) {

    var group = this.gui.addFolder("Lights");
    group.open();

    // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
    // e.g. this.option1=true; this.option2=false;

    for (var key in lights) {
        if (lights.hasOwnProperty(key)) {
            this.scene.lightValues[key] = lights[key][0];
            group.add(this.scene.lightValues, key);
        }
    }
}


MyInterface.prototype.addScenesGroup = function(){
var f1 = this.gui.addFolder("Scene");
f1.open();


this.gui.add(this.scene, 'selectedAmbient', ['1', '2','3'] );

}


/**
 * Adds a folder containing the IDs of the selectable Nodes passed as parameter.
 * @function
 * @name addSelectablesGroup
 * @memberof MyInterface
 */
MyInterface.prototype.addSelectablesGroup = function(nodes) {
    var group = this.gui.addFolder("Selectable Nodes");
    group.open();

    for(var key in nodes){
      if(nodes.hasOwnProperty(key) && nodes[key].selectable){
        this.scene.nodesSelectableValues[key] = nodes[key].selected;
        group.add(this.scene.nodesSelectableValues, key);
      }
    }

}


/**
 * Adds a folder containing the IDs of the shaders passed as parameter.
 * @function
 * @name addShadersGroup
 * @memberof MyInterface
 */
MyInterface.prototype.addShadersGroup = function() {
    let i = 0;
    let shaders = {};
    for(let i = 0; i < this.scene.shaders.length; i++){
      shaders[this.scene.shaders[i][0]]= i;
    }
    this.gui.add(this.scene, 'selectedShader', shaders).name('Shader examples');

}

/**
 * Adds the selectors for the selection color of the xml scene
 * @function
 * @name addSelectionColor
 * @memberof MyInterface
 */
MyInterface.prototype.addSelectionColor = function(){
  let obj = this;
  this.gui.add(this.scene, 'r',0,1).onChange(function(v)
	{
		obj.scene.updateR(v);
	});
  this.gui.add(this.scene, 'g',0,1).onChange(function(v)
	{
		obj.scene.updateG(v);
	});
  this.gui.add(this.scene, 'b',0,1).onChange(function(v)
	{
		obj.scene.updateB(v);
	});
}
