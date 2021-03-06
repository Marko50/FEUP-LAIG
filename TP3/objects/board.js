var DISTANCE_BETWEEN_CELLS = 6;

/**
  Class representing a board
  @class
*/
class board {
  /**
    Creates a board
    @constructor
    @param {XMLscene} scene Scene where the board will be represented
    @param {Number} dimensionBoard size of the board
    @param {Number} dimensionCell size of the board's cells
  */
  constructor(scene, dimensionBoard, dimensionCell) {
      this.scene = scene;
      this.elegible = false;
      this.setColors();
      this.generateBoard(dimensionBoard,dimensionCell);
      this.generatePieces((dimensionBoard*dimensionBoard)/2);
  }

  /**
    Generates the boards pieces
    @name generatePieces
    @param {Number} dimension size of the board
    @memberof piece
  */
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

  /**
    Creates materials
    @name setColors
    @memberof piece
  */
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

  /**
    Generates the boards cells
    @name generateBoard
    @param {Number} dimensionBoard size of the board
    @param {Number} dimensionCell size of the cells
    @memberof piece
  */
  generateBoard(dimensionBoard,dimensionCell){
    this.dimension = dimensionBoard;
    this.dimensionCell = dimensionCell;
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

    this.lastPrologBoard = this.boardProlog;

  }

  /**
    Updates the board according to the prolog
    @name updateBoard
    @memberof piece
  */
  updateBoard(){
    for(let i = 0; i < this.boardProlog.length; i++){
      for(let j = 0; j < this.boardProlog[i].length; j++){
        if(this.boardProlog[i][j] == 'x'){
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

  /**
    Plays a piece on a cell
    @name play
    @param {piece} piece piece to be played
    @param {cell} cell cell where the piece will be played
    @memberof piece
  */
  play(piece, cell){
    let finalx = 5 + cell.centerx;
    let finalz = 50 - cell.centery;

    let controlpoints = [];
    controlpoints[0] = piece.posX;
    controlpoints[1] = 0;
    controlpoints[2] = piece.posZ;

    controlpoints[3] = finalx;
    controlpoints[4] = 5;
    controlpoints[5] = finalz;

    controlpoints[6] = finalx;
    controlpoints[7] = 5;
    controlpoints[8] = finalz;

    controlpoints[9] = finalx;
    controlpoints[10] = 0;
    controlpoints[11] = finalz;

    piece.animation = new BezierAnimation(this.scene,20, controlpoints);
    piece.moving = true;
    piece.elegible = false;
    piece.selected = false;
    cell.piece = piece;
    cell.elegible = false;
  }
  /**
    Selects a specific cell
    @name selectCell
    @param {Number} x x board coordinate
    @param {Number} y y board coordinate
    @memberof piece
  */
  selectCell(x,y){
    return this.board[x][y];
  }

  /**
    Selects a specific piece
    @name selectPiece
    @param {Number} id Identificator of the piece
    @memberof piece
  */
  selectPiece(id){
    for(let i = 0; i < this.piecesTeam1.length; i++){
      if(this.piecesTeam1[i].id == id)
        return this.piecesTeam1[i];
    }

    for(let i = 0; i < this.piecesTeam2.length; i++){
      if(this.piecesTeam2[i].id == id)
        return this.piecesTeam2[i];
    }
  }

  /**
    Selects the first elegible piece
    @name selectElegiblePCPiece
    @memberof piece
  */
  selectElegiblePCPiece(){
    for(let i = 0; i < this.piecesTeam2.length; i++){
      if(this.piecesTeam2[i].elegible){
        return this.piecesTeam2[i];
      }
    }
  }


  /**
    Displays the board
    @name display
    @param {Number} currentTime time between frames
    @memberof piece
  */
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

  /**
    Creates a colne of the board
    @name clone
    @memberof piece
  */
  clone(){
    let ret = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    ret.board = [];7
    ret.piecesTeam1 = [];
    ret.piecesTeam2 = [];
    for(let i = 0; i < this.board.length; i++){
      let line = []
      for(let j = 0; j < this.board.length; j++){
        line.push(Object.assign(Object.create(Object.getPrototypeOf(this.board[i][j])), this.board[i][j]));
      }
      ret.board.push(line);
    }
    for(let i = 0; i < this.piecesTeam1.length; i++){
      ret.piecesTeam1.push(Object.assign(Object.create(Object.getPrototypeOf(this.piecesTeam1[i])),this.piecesTeam1[i]));
    }
    for(let i = 0; i < this.piecesTeam2.length; i++){
      ret.piecesTeam2.push(Object.assign(Object.create(Object.getPrototypeOf(this.piecesTeam2[i])),this.piecesTeam2[i]));
    }
    return ret;
  }

}
