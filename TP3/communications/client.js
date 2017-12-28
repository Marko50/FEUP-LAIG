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
  console.log(PrologBoard);
  let ret = JSON.parse("[" + PrologBoard + "]");

  return ret;
}

class client {
  constructor(scene) {
    this.scene = scene;
    this.port = 8081;
  }

  play(Board, signature, x, y){
    let prologBoard = prepareBoardForProlog(Board);
    let xhttp = new XMLHttpRequest();
    let request = "setPeca(" + x.toString() + "," + y.toString() + "," + signature + "," + prologBoard +")";
    let url = 'http://localhost:' + this.port.toString() + '/' + request;
    console.log(url);
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       let response = readPrologResponseBoard(xhttp.response);
       console.log(response);
     }
    };
    xhttp.open("GET", url , true);
    xhttp.send();
  }

  playPC(Board){

  }

  checkEndGame(Board){
    let prologBoard = prepareBoardForProlog(Board);
    //verificaFimJogo([['v','x','x'],['x','x','x'],['x','x','x']])
    let xhttp = new XMLHttpRequest();
    let request = "verificaFimJogo(" + prologBoard + ")";
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
       let response = xhttp.response.text;
       console.log(response);
     }
    };
    xhttp.open("GET", 'http://localhost:' + this.port.toString() + '/' + request , true);
    xhttp.send();
  }

  checkWinner(Board){
    let prologBoard = prepareBoardForProlog(Board);
    let xhttp = new XMLHttpRequest();
    let request = "verificaVencedorJogo(" + prologBoard + ")";
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
       let response = xhttp.response.text;
       console.log(response);
     }
    };
    xhttp.open("GET", 'http://localhost:' + this.port.toString() + '/' + request , true);
    xhttp.send();
  }

}
