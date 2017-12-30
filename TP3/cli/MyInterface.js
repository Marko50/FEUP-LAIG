 /**
 * MyInterface class, creating a GUI interface.
 * @constructor
 */
function MyInterface() {
    //call CGFinterface constructor
    CGFinterface.call(this);
    this.film = false;
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


MyInterface.prototype.addStartGame = function(){
  this.gui.add(this.scene,'startGameHuman').name('Player vs Player');
  this.gui.add(this.scene,'startGamePCEasy').name('Play PC Easy');
  this.gui.add(this.scene,'startGameHard').name('Play PC Hard');
}

MyInterface.prototype.addUndo = function(){
  this.gui.add(this.scene,'undo').name('Undo last action');
}

MyInterface.prototype.addScenesGroup = function(){
this.gui.add(this.scene, 'selectedAmbient', ['1', '2','3'] ).name("Selected Ambient");

}

MyInterface.prototype.removeFilmOption(){
  this.gui.remove('film');
  this.film = false;
}


MyInterface.prototype.addFilmOption = function(){
  this.gui.add(this.scene,'film').name('Game Film');
    this.film = true;
}
