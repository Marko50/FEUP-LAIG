/**
 * constructor of the camera Animation
 * @constructor CameraAnimation
 *
 */
 function CameraAnimation(destinationPos, originPos, destinationDir,originDir) {

 this.time = 1000;

 this.originPos = originPos;
 this.destinationPos = destinationPos;
 this.originDir = originDir;
 this.destinationDir = destinationDir;

 this.Distance = vec3.create();

 vec3.subtract(this.Distance, this.destinationPos, this.originPos);

 this.velPos = vec3.create();
 this.velPos[0] = this.Distance[0] / this.time;
 this.velPos[1] = this.Distance[1] / this.time;
 this.velPos[2] = this.Distance[2] / this.time;

 this.travelledPosDist = vec3.create(0, 0, 0);

 this.dirDist = vec3.create();

 vec3.subtract(this.dirDist, this.destinationDir, this.originDir);

 this.velDir = vec3.create();
 this.velDir[0] = this.dirDist[0] / this.time;
 this.velDir[1] = this.dirDist[1] / this.time;
 this.velDir[2] = this.dirDist[2] / this.time;

 this.travelledDirDist = vec3.create(0, 0, 0);

}
