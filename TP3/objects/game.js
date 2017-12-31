/**
  Class representing a Game
  @class
*/
class Game {
  /**
    Creates a Game
    @constructor
    @param {XMLscene} scene Scene where the game will be represented
  */
  constructor(scene) {
    this.scene = scene;
    this.currentTeam = 1;
    this.finished = true;
    this.selectedCell = null;
    this.selectedPiece = null;
    this.pchard = false;
    this.pceasy = false;
    this.human = false;
    this.client = new client(this);
    this.board = new board(this.scene,8,5);
    this.stackBoards = new Array();
    this.stackPlays = new Array();
    this.currentTime = Date.now();
    this.elapsedTime = 0;
    this.movieIndex = 0;
  }
  /**
    Prepares the game movie
    @name prepareMovie
    @memberof Game
  */
  prepareMovie(){
    this.board = new board(this.scene,8,5);
    this.movie = true;
  }
  /**
    Starts a new Game
    @name startGame
    @memberof Game
  */
  startGame(){
    this.board.elegible = true;
    this.finished = false;
  }

  /**
    Reverts last action on this game
    @name rollBack
    @memberof Game
  */
  rollBack(){
    if(this.human && this.stackBoards.length > 0 && !this.finished){
      if(this.currentTeam == 1){
        this.currentTeam = 2;
      }
      else {
        this.currentTeam = 1;
      }
      this.board = this.stackBoards[this.stackBoards.length - 1];
      this.stackBoards.pop();
    }
  }

  /**
    Deals with selected objects
    @name parseSelected
    @param {Object} obj - Has to be either a piece or a cell
    @memberof Game
  */
  parseSelected(obj){
    if(obj.type == "piece"){
      if(obj.elegible && obj.team == this.currentTeam && this.board.elegible){
        this.selectedPiece = obj;
        this.selectedPiece.selected = true;
      }
    }
    else if(obj.type == "cell"){
      this.selectedCell = obj;
      if(this.selectedPiece != null && this.selectedCell.elegible){
        this.selectedCell = obj;
        this.stackBoards.push(this.board.clone());
        this.client.play(this.board, this.selectedPiece, this.selectedCell);
        if(this.human){
          if(this.currentTeam == 1){
            this.currentTeam = 2;
          }
          else {
            this.currentTeam = 1;
          }
        }
        else if(this.pchard){
          this.stackBoards.push(this.board.clone());
          this.board.elegible = false;
          setTimeout(() => {this.client.playPCHard(this.board);}, 7000);
        }

        else if(this.pceasy){
          this.stackBoards.push(this.board.clone());
          this.board.elegible = false;
          setTimeout(() => {this.client.playPCHard(this.board);}, 7000);
        }
        this.selectedPiece = null;
        this.selectedCell = null;
      }
    }

  }

/**
    Deals with game winner
    @name parseWinner
    @param {Number} winner - winner either team 1 or team 2
    @memberof Game
  */
parseWinner(winner){
  if(winner == 1)
    this.scene.winsTeam1++;
  else if(winner == 2)
    this.scene.winsTeam2++;
  this.finished = true;

  if(!this.scene.interface.film)
    this.scene.interface.addFilmOption();
}

/**
  Displays the game
  @name display
  @param {Number} deltaTime - time between frames
  @memberof Game
*/
display(deltaTime){
  if(this.movie){
    if(this.movieIndex < this.stackPlays.length)
    {
      let move = this.stackPlays[this.movieIndex];
      let cl = this.client;
      let b = this.board;
      setTimeout(() => {
        let Piece = b.selectPiece(move[0].id);
        let Cell = b.selectCell(move[1].line - 1,move[1].col - 1);
        cl.play(this.board, Piece, Cell);
      }, 3000 + this.movieIndex*1000*1.5);
      this.movieIndex++;
      this.board.display(deltaTime);
    }
    else this.movie = false;
  }
  else{
    if(!this.finished){
      let time = Date.now();
      let delta = (time - this.currentTime)/1000;
      this.elapsedTime+= delta;
      this.currentTime = time;
    }
    this.board.display(deltaTime);
  }
}
}
