/**
* Prepares a board to be sent to prolog server
* @function
* @name prepareBoardForProlog
* @param {Array} Board - Unparsed Board
* @returns {String} - The Board parsed to a string
*/
var prepareBoardForProlog = function(Board){
  let ret = "[";
  for(let i = 0; i < Board.length; i++){
    ret+="[";
    ret += Board[i].toString();
    if(i == Board.length - 1)
      ret += "]";

    else  ret += "],";
    }
  ret +="]";
  return ret;
}

/**
* Reads the response Board from a prolog server
* @function
* @name readPrologResponseBoard
* @param {String} PrologBoard - Unparsed Board
* @returns {Array} - The Board parsed to an Array
*/
var readPrologResponseBoard = function(PrologBoard){
  PrologBoard = PrologBoard.slice(1,PrologBoard.length - 1);
  PrologBoard = PrologBoard.slice(1,PrologBoard.length - 1);
  let retAux = PrologBoard.split('],[');
  let ret = [];
  for(let i = 0; i < retAux.length; i++){
    ret.push(retAux[i].split(','));
  }

  return ret;
}

/**
* Reads the response PC play from Prolog
* @function
* @name readPrologPCResponse
* @param {String} Response - Response from Prolog server
* @param {Number} Line - Line Played
* @param {Number} Column - Column Played
* @returns {Array} - Array with the result board and coordinates of the play
*/
var readPrologPCResponse = function(Response,Line,Column){
  let ResponseAux = Response.slice(2, Response.length - 1);
  let ResponseSplited = ResponseAux.split('-');
  Line = parseInt(ResponseSplited[1]) - 1;
  Column = parseInt(ResponseSplited[2]) - 1;
  let boardUnparsed = ResponseSplited[0];
  let boardUnparsedAux = "[" + boardUnparsed;
  let retBoard = readPrologResponseBoard(boardUnparsedAux);
  ret = [Line,Column,retBoard];
  return ret;
}

/**
  Class representing a client that communicates with the prolog server
  @class
*/
class client {

  /**
    Creates a client
    @constructor
    @param {Game} Game using this client
  */
  constructor(game) {
    this.game = game;
    this.port = 8081;
  }

  /**
    requests Prolog server a play
    @name  play
    @param {board} Board - current Board
    @param {piece} Piece - Piece played
    @param {cell} Cell - Cell where the piece is played
    @memberof Client
  */
  play(Board, Piece, Cell){
    let prologBoard = prepareBoardForProlog(Board.boardProlog);
    let xhttp = new XMLHttpRequest();
    let request = "setPeca(" + Cell.line.toString() + "," + Cell.col.toString() + "," + Piece.signature + "," + prologBoard +")";
    let url = 'http://localhost:' + this.port.toString() + '/' + request;
    let cl = this;
    let game = this.game;
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       let response = readPrologResponseBoard(xhttp.response);
       Board.boardProlog = response;
       Board.play(Piece, Cell);
       Board.updateBoard();
       game.stackPlays.push([Piece, Cell]);
       cl.checkEndGame(Board);
     }
    };
    xhttp.open("GET", url , true);
    xhttp.send();
  }

  /**
    requests Prolog server a PC Hard play
    @name  playPCHard
    @param {board} Board - current Board
    @memberof Client
  */
  playPCHard(Board){
    let prologBoard = prepareBoardForProlog(Board.boardProlog);
    let xhttp = new XMLHttpRequest();
    let request = "jogaPCHard(" + prologBoard + ")";
    let cl = this;
    let game = this.game;
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       let response = readPrologPCResponse(xhttp.response);
       Board.boardProlog = response[2];
       let Cell = Board.selectCell(response[0],response[1]);
       let Piece = Board.selectElegiblePCPiece();
       game.stackPlays.push([Piece,Cell]);
       Board.play(Piece,Cell);
       Board.updateBoard();
       Board.elegible = true;
       cl.checkEndGame(Board);
     }
    };
    xhttp.open("GET", 'http://localhost:' + this.port.toString() + '/' + request , true);
    xhttp.send();
  }

  /**
    requests Prolog server a PC Easy play
    @name  playPCEasy
    @param {board} Board - current Board
    @memberof Client
  */
  playPCEasy(Board){
    let prologBoard = prepareBoardForProlog(Board.boardProlog);
    let xhttp = new XMLHttpRequest();
    let request = "jogaPCEasy(" + prologBoard + ")";
    let cl = this;
    let game = this.game;
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       let linePlayed;
       let columnPlayed;
       let response = readPrologPCResponse(xhttp.response,linePlayed,columnPlayed);
       Board.boardProlog = response[2];
       let Cell = Board.selectCell(response[0],response[1]);
       let Piece = Board.selectElegiblePCPiece();
       game.stackPlays.push([Piece,Cell]);
       Board.play(Piece,Cell);
       Board.updateBoard();
       Board.elegible = true;
       cl.checkEndGame(Board);
     }
    };
    xhttp.open("GET", 'http://localhost:' + this.port.toString() + '/' + request , true);
    xhttp.send();
  }

  /**
    requests Prolog server to check end of game
    @name  checkEndGame
    @param {board} Board - current Board
    @memberof Client
  */
  checkEndGame(Board){
    let prologBoard = prepareBoardForProlog(Board.boardProlog);
    let xhttp = new XMLHttpRequest();
    let request = "verificaFimJogo(" + prologBoard + ")";
    let cl = this;
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       let response = xhttp.response;
       if(response == "yes"){
         cl.checkWinner(Board);
       }
     }
    };
    xhttp.open("GET", 'http://localhost:' + this.port.toString() + '/' + request , true);
    xhttp.send();
  }

  /**
    requests Prolog to check the winner
    @name  checkWinner
    @param {board} Board - current Board
    @memberof Client
  */
  checkWinner(Board){
    let prologBoard = prepareBoardForProlog(Board.boardProlog);
    let xhttp = new XMLHttpRequest();
    let request = "verificaVencedorJogo(" + prologBoard + ")";
    let cl = this;
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       let response = xhttp.response;
       let winner = parseInt(response);
       cl.game.parseWinner(winner);
     }
    };
    xhttp.open("GET", 'http://localhost:' + this.port.toString() + '/' + request , true);
    xhttp.send();
  }

}
