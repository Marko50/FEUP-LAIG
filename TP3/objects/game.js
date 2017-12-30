class Game {
  constructor(scene) {
    this.scene = scene;
    this.currentTeam = 1;
    this.finished = true;
    this.selectedCell = null;
    this.selectedPiece = null;
    this.pchard = false;
    this.pceasy = false;
    this.human = false;
    this.lastCellPlayer1 = new Array();
    this.lastCellPlayer2 = new Array();
    this.client = new client(this);
    this.board = new board(this.scene,8,5);
    this.stackBoards = new Array();
  }

  startGame(){
    this.finished = false;
  }

  rollBack(){
    if(this.human && this.stackBoards.length > 0){
      if(this.currentTeam == 1){
        this.currentTeam = 2;
      }
      else {
        this.currentTeam = 1;
      }
      console.log(this.board);
      this.board = this.stackBoards[this.stackBoards.length - 1];
      console.log(this.board);
      this.stackBoards.pop();
    }
  }

  parseSelected(obj){
    if(obj.type == "piece"){
      if(obj.elegible && obj.team == this.currentTeam && this.board.elegible){
        this.selectedPiece = obj;
        this.board.readyCells = true;
      }
    }
    else if(obj.type == "cell"){
      this.selectedCell = obj;
      if(this.selectedPiece != null && this.selectedCell.elegible){
        this.selectedCell = obj;
        this.stackBoards.push(this.board.clone());
        this.client.play(this.board, this.selectedPiece.signature, this.selectedCell.line, this.selectedCell.col);
        this.board.play(this.selectedPiece, this.selectedCell);
        if(this.human){
          if(this.currentTeam == 1){
            this.lastCellPlayer1 = this.selectedCell;
            this.currentTeam = 2;
          }
          else {
            this.lastCellPlayer2 = this.selectedCell;
            this.currentTeam = 1;
          }
        }
        this.selectedPiece = null;
        this.selectedCell = null;
        this.board.readyCells = false;

        if(this.pchard){
          this.stackBoards.push(this.board.clone());
          this.board.elegible = false;
          setTimeout(() => {this.client.playPCHard(this.board);}, 5000);
        }

        else if(this.pceasy){
          this.stackBoards.push(this.board.clone());
          this.board.elegible = false;
          setTimeout(() => {this.client.playPCHard(this.board);}, 5000);
        }
      }
    }

  }

parseWinner(winner){
  if(winner == 1)
    this.scene.winsTeam1++;
  else if(winner == 2)
    this.scene.winsTeam2++;
  this.finished = true;
}

  display(deltaTime){
    this.board.display(deltaTime);
  }
}
