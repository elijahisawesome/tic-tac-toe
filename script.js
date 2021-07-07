const gameBoard = (function(doc){
    let board=[];
    const mainDiv = doc.querySelector(".mainDiv");

    const populator = function(doc){
        if(!!doc){
            for(let x = 0;x<9;x++){
                board[x]= doc.createElement("div");
                board[x].classList.add("boardPiece");
                board[x].setAttribute("data-played", "false");
                //test
                board[x].innerText = x;
                //test
                mainDiv.append(board[x]);
            }
        }
        else{
            alert("Error! no document found!");
        }
    }

    populator(doc);

    return{board};

})(document);


const playerFactory = (playerName) =>{
    const _playerName = playerName;
    let wins = 0;
    let sign = '';

    const hasWon = function(){
        wins++;
    }
    const setSign = function(newSign){
        sign = newSign;
    }
    const getSign = function(){
        return sign;
    }
    const getWins = function(){
        return wins;
    }
    const newPlayer = function(){
        mainGameLogic.setPlayers(this);
    }
    const getName = function(){
        return _playerName;
    }
    return {getWins,hasWon,newPlayer,getName,setSign,getSign};
}

const mainGameLogic = (function(board) {
    let _players = [];
    let playCount = 2;
    const _board = board;

    const setPlayers = function(newPlayer){
        if(!_players[0]){_players[0]=newPlayer; newPlayer.setSign("X");}
        else{_players[1] = newPlayer; newPlayer.setSign("O");}
    }
    const playMove = function(boardPiece, activePlayer){
        let validMove = false;
        if(boardPiece.dataset.played == 'false'){
            boardPiece.innerText = activePlayer.getSign();
            boardPiece.dataset.played = 'true';
            validMove = true;
        }
        return validMove;
    }
    const getActivePlayer  = function(){ 
        let activePlayer;
        (playCount %2 == 0) ? activePlayer = _players[0] : activePlayer = _players[1];
        return activePlayer;
    }
    const playLogic = function(){
        let gameEnd = false;
        if(_board[0].innerText == _board[1].innerText && _board[0].innerText == _board[2].innerText){
            getActivePlayer().hasWon();
            gameEnd = true;
        }
        else if(_board[0].innerText == _board[4].innerText && _board[0].innerText == _board[8].innerText){
            getActivePlayer().hasWon();
            gameEnd = true;
        }
        else if(_board[0].innerText == _board[3].innerText && _board[0].innerText == _board[6].innerText){
            getActivePlayer().hasWon();
            gameEnd = true;
        }
        else if(_board[3].innerText == _board[4].innerText && _board[3].innerText == _board[5].innerText){
            getActivePlayer().hasWon();
            gameEnd = true;
        }
        else if(_board[6].innerText == _board[7].innerText && _board[6].innerText == _board[8].innerText){
            getActivePlayer().hasWon();
            gameEnd = true;
        }
        else if(_board[6].innerText == _board[4].innerText && _board[6].innerText == _board[2].innerText){
            getActivePlayer().hasWon();
            gameEnd = true;
        }
        else if(_board[1].innerText == _board[4].innerText && _board[1].innerText == _board[7].innerText){
            getActivePlayer().hasWon();
            gameEnd = true;
        }
        else if(_board[2].innerText == _board[5].innerText && _board[2].innerText == _board[8].innerText){
            getActivePlayer().hasWon();
            gameEnd = true;
        }
        else if(playCount == 8){
            gameEnd = true;
        }
        return gameEnd;
    }
    const reset = function(){
        //build up reset logic here.
        alert("Game Over!");
    }

    for (let x = 0; x < _board.length; x++){
        _board[x].addEventListener('click', function(){
            if(playMove(_board[x],getActivePlayer())){
                if(playLogic()){
                    reset();
                }
                playCount++;
                }
            })
    }

    return{setPlayers}
})(gameBoard.board);

const buttons = document.querySelectorAll(".player");
buttons.forEach(button => button.addEventListener("click", function(){playerFactory(button.innerText).newPlayer()}));