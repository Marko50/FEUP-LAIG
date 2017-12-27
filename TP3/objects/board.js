class board {

  constructor(scene, dimensionBoard, dimensionCell) {
      this.scene = scene;
      this.readyCells = false;
      this.setColors();
      this.generateBoard(dimensionBoard,dimensionCell);
      this.generatePieces((dimensionBoard*dimensionBoard)/2);
  }

  generatePieces(dimension){
    this.pieces = [];
    let id = 2*dimension + 1;
    for(let i = 0; i < dimension; i++){
      this.pieces.push(new piece(this.scene,1,this.green,id,'x',2*i,0));
      id++;
    }

    for(let i = 0; i < dimension; i++){
      this.pieces.push(new piece(this.scene,2,this.yellow,id,'o',2*i,60));
      id++;
    }
  }

  setColors(){
    this.red = new CGFappearance(this.scene);
    this.red.setShininess(0);
    this.red.setAmbient(0, 0, 0, 1);
    this.red.setSpecular(1, 0, 0, 0);
    this.red.setEmission(0, 0, 0, 0);

    this.green = new CGFappearance(this.scene);
    this.green.setShininess(0);
    this.green.setAmbient(0, 0, 0, 1);
    this.green.setSpecular(0, 1, 0, 0);
    this.green.setEmission(0, 0, 0, 0);

    this.yellow = new CGFappearance(this.scene);
    this.yellow.setShininess(0);
    this.yellow.setAmbient(0, 0, 0, 1);
    this.yellow.setSpecular(0, 1, 1, 0);
    this.yellow.setEmission(0, 0, 0, 0);

    this.blue = new CGFappearance(this.scene);
    this.blue.setShininess(0);
    this.blue.setAmbient(0, 0, 0, 1);
    this.blue.setSpecular(0, 0, 1, 0);
    this.blue.setEmission(0, 0, 0, 0);
  }

  generateBoard(dimensionBoard,dimensionCell){
    this.dimension = dimensionBoard;
    this.board = [];
    this.boardProlog = [];
    let id = 1;
    for(let i = 0; i < dimensionBoard; i++){
      let line = [];
      let lineProlog = [];
      for(let j = 0; j < dimensionBoard; j++){
        line.push(new cell(this.scene,6*i,6*j + dimensionCell,dimensionCell,this.red, id));
        lineProlog.push('v');
        id++;
      }
      this.boardProlog.push(lineProlog);
      this.board.push(line);
    }

  }

  registerCellsForPick(){
    for(let i = 0; i < this.dimension; i++){
      for(let j = 0; j < this.dimension; j++){
        this.scene.registerForPick(this.board[i][j].id, this.board[i][j]);
      }
    }
  }

  movePieceToCell(piece, cell){
    console.log(cell);
    this.boardProlog[cell.line][cell.col] = piece.signature;
    let controlpoints = [];
    controlpoints[0] = piece.posX;
    controlpoints[1] = 0;
    controlpoints[2] = piece.posZ;
    controlpoints[3] = piece.posX;
    controlpoints[4] = 5;
    controlpoints[5] = piece.posZ;
    controlpoints[6] = piece.posX;
    controlpoints[7] = 10;
    controlpoints[8] = piece.posZ;
    controlpoints[9] = cell.centerx;
    controlpoints[10] = 0;
    controlpoints[11] = cell.centery;

    piece.animation = new BezierAnimation(this.scene, 5, controlpoints);
    piece.moving = true;
  }

  display(currentTime){
    for(let i = 0; i < this.dimension; i++){
      for(let j = 0; j < this.dimension; j++){
        this.board[i][j].display();
      }
    }

    for(let i = 0; i < this.pieces.length; i++){
      this.pieces[i].display(currentTime);
    }
  }

}
