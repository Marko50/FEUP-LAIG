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
    this.client = new client(this);
    this.board = new board(this.scene,8,5);
    this.stackBoards = new Array();
    this.stackPlays = new Array();
    this.currentTime = Date.now();
    this.elapsedTime = 0;
    this.movieIndex = 0;
  }
  /*for (let i = 0; i < playSeq.length; i++) {
window.setTimeout(fazerJogada, 1000 * i, arg1, arg2);
} */
  prepareMovie(){
    this.board = new board(this.scene,8,5);
    this.movie = true;
  }
  startGame(){
    this.board.elegible = true;
    this.finished = false;
  }

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

parseWinner(winner){
  if(winner == 1)
    this.scene.winsTeam1++;
  else if(winner == 2)
    this.scene.winsTeam2++;
  this.finished = true;

  if(!this.scene.interface.film)
    this.scene.interface.addFilmOption();
}

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
