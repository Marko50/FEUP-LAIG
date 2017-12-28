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

class client {
  constructor(scene) {
    this.scene = scene;
    this.port = 8081;
  }

  play(Board, signature, x, y){
    let prologBoard = prepareBoardForProlog(Board.boardProlog);
    let xhttp = new XMLHttpRequest();
    let request = "setPeca(" + x.toString() + "," + y.toString() + "," + signature + "," + prologBoard +")";
    let url = 'http://localhost:' + this.port.toString() + '/' + request;
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       let response = readPrologResponseBoard(xhttp.response);
       Board.boardProlog = response;
       Board.updateBoard();
     }
    };
    xhttp.open("GET", url , true);
    xhttp.send();
  }

  playPC(Board){

  }

  checkEndGame(Board){
    let prologBoard = prepareBoardForProlog(Board.boardProlog);
    //verificaFimJogo([['v','x','x'],['x','x','x'],['x','x','x']])
    let xhttp = new XMLHttpRequest();
    let request = "verificaFimJogo(" + prologBoard + ")";
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
       let response = xhttp.response.text;
       if(response == "yes"){
         Board.finished = true;
         this.checkWinner(Board);
       }
     }
    };
    xhttp.open("GET", 'http://localhost:' + this.port.toString() + '/' + request , true);
    xhttp.send();
  }

  checkWinner(Board){
    let prologBoard = prepareBoardForProlog(Board.boardProlog);
    let xhttp = new XMLHttpRequest();
    let request = "verificaVencedorJogo(" + prologBoard + ")";
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
       let response = xhttp.response.text;
       let winner = parseInt(response);
       
     }
    };
    xhttp.open("GET", 'http://localhost:' + this.port.toString() + '/' + request , true);
    xhttp.send();
  }

}
