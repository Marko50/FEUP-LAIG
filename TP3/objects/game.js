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
    this.client = new client(this.scene);
    this.board = new board(this.scene,8,5);
  }

  startGame(){
    this.finished = false;
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
        this.board.play(this.selectedPiece, this.selectedCell);
        this.client.play(this.board, this.selectedPiece.signature, this.selectedCell.line, this.selectedCell.col);
        this.selectedPiece = null;
        this.selectedCell = null;
        this.board.readyCells = false;

        if(this.human){
          if(this.currentTeam == 1)
            this.currentTeam = 2;
          else this.currentTeam = 1;
        }

        else if(this.pchard){
          this.board.elegible = false;
          setTimeout(() => {this.client.playPCHard(this.board);}, 5000);
        }

        else if(this.pceasy){
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

  console.log("Player1: " + this.winsTeam1);
  console.log("Player2: " + this.winsTeam2);
  this.finished = true;
}

  display(deltaTime){
    this.board.display(deltaTime);
  }
}
