var DISTANCE_BETWEEN_CELLS = 6;

class board {

  constructor(scene, dimensionBoard, dimensionCell) {
      this.scene = scene;
      this.readyCells = false;
      this.setColors();
      this.generateBoard(dimensionBoard,dimensionCell);
      this.generatePieces((dimensionBoard*dimensionBoard)/2);
  }

  generatePieces(dimension){
    this.piecesTeam1 = [];
    this.piecesTeam2 = [];
    let id = 2*dimension + 1;

    for(let i = 0; i < dimension; i++){
      this.piecesTeam1.push(new piece(this.scene,1,this.green,id,'x',2*i,0));
      id++;
    }

    for(let i = 0; i < dimension; i++){
      this.piecesTeam2.push(new piece(this.scene,2,this.yellow,id,'o',2*i,60));
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
        line.push(new cell(this.scene,DISTANCE_BETWEEN_CELLS*i,DISTANCE_BETWEEN_CELLS*j + dimensionCell,dimensionCell,this.red, id,i+1,j+1));
        lineProlog.push('v');
        id++;
      }
      this.boardProlog.push(lineProlog);
      this.board.push(line);
    }

  }

  updateBoard(){
    for(let i = 0; i < this.boardProlog.length; i++){
      for(let j = 0; j < this.boardProlog[i].length; j++){
        if(this.boardProlog[i][j] == 'x'){//player1
          this.board[i][j].piece.team = 1;
          this.board[i][j].piece.signature = 'x';
          this.board[i][j].piece.material = this.green;
        }

        else if(this.boardProlog[i][j] == 'o'){
          this.board[i][j].piece.team = 2;
          this.board[i][j].piece.signature = 'o';
          this.board[i][j].piece.material = this.yellow;
        }
      }
    }
  }

  play(piece, cell){
    let finalx = 5 + cell.centerx;
    let finalz = 50 - cell.centery;

    let controlpoints = [];
    controlpoints[0] = piece.posX;
    controlpoints[1] = 0;
    controlpoints[2] = piece.posZ;

    controlpoints[3] = piece.posX;
    controlpoints[4] = 5;
    controlpoints[5] = piece.posZ ;

    controlpoints[6] = finalx;
    controlpoints[7] = 5;
    controlpoints[8] = finalz;

    controlpoints[9] = finalx;
    controlpoints[10] = 0;
    controlpoints[11] = finalz;

    piece.animation = new BezierAnimation(this.scene,20, controlpoints);
    piece.moving = true;
    piece.elegible = false;
    cell.piece = piece;
  }

  selectCell(x,y){
    console.log("x: " + x);
    console.log("y: " + y);
    return this.board[x][y];
  }

  selectElegiblePCPiece(){
    for(let i = 0; i < this.piecesTeam2.length; i++){
      if(this.piecesTeam2[i].elegible){
        return this.piecesTeam2[i];
      }
    }
  }

  display(currentTime){
    for(let i = 0; i < this.dimension; i++){
      for(let j = 0; j < this.dimension; j++){
        this.board[i][j].display();
      }
    }

    for(let i = 0; i < this.piecesTeam1.length; i++){
      this.piecesTeam1[i].display(currentTime);
    }

    for(let i = 0; i < this.piecesTeam2.length; i++){
      this.piecesTeam2[i].display(currentTime);
    }
  }

}
