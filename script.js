const gameBoard = (function(doc){
    let board=[];
    const mainDiv = doc.querySelector(".mainDiv");
    const reselect = doc.createElement('button');
    const rematch = doc.createElement('button');
    const endGameControls = doc.querySelector(".endGameControls");

    const populator = function(doc){
        if(!!doc){
            reselect.classList.add("controlButton");
            reselect.innerText = "reselect";
            rematch.classList.add("controlButton");
            rematch.innerText = "rematch";
            for(let x = 0;x<9;x++){
                board[x]= doc.createElement("div");
                board[x].classList.add("boardPiece");
                board[x].classList.add("invisibleText");
                board[x].setAttribute("data-played", "false");
                board[x].innerText = x;
                mainDiv.append(board[x]);
            }
        }
        else{
            alert("Error! no document found!");
        }
    }
    const resetBoard = function(){
        mainDiv.classList.remove("preGame");
        endGameControls.classList.remove("preGame");
        mainGameLogic.initCPULogic();
    }
    const gameStart = function(){
        mainDiv.classList.remove("preGame");
        endGameControls.classList.remove("preGame");
        mainGameLogic.initCPULogic();
    }
    const gameEnd = function(){
        mainDiv.classList.add("preGame");
        endGameControls.append(rematch, reselect);
        endGameControls.classList.add("preGame");
    }

    
    rematch.addEventListener('click', () =>{resetBoard();console.log("hey");});
    reselect.addEventListener('click', () => {playerSelectionButtonsManager.reset(); mainGameLogic.wipe() })
    populator(doc);
    gameEnd();

    return{board, gameStart, gameEnd,};
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
    const playCountAlert = function(val){
        playCount+= val;
        cpuLogic(getActivePlayer());
    }

    const setPlayers = function(newPlayer){
        if(!_players[0]){
            _players[0]=newPlayer; 
            newPlayer.setSign("X");
            }
        else{
            _players[1] = newPlayer; 
            newPlayer.setSign("O"); 
            gameBoard.gameStart();}
    }
    const playMove = function(boardPiece, activePlayer){
        let validMove = false;
        if(boardPiece.dataset.played == 'false'){
            boardPiece.innerText = activePlayer.getSign();
            boardPiece.classList.remove("invisibleText");
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
    //returns whether game ends or not
    const gameOver = function(){
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
        else if(playCount == 10){
            gameEnd = true;
        }
        return gameEnd;
    }

    const reset = function(){
        _board.forEach((boardPiece, index) =>{boardPiece.dataset.played = 'false'; boardPiece.classList.add("invisibleText"); boardPiece.innerText = index;})
        playCount = 2;
        scoreFields.set("field1", _players[0].getWins());
        scoreFields.set("field2", _players[1].getWins());
        //gameBoard.gameEnd();
        initCPULogic();
        
    }

    const initCPULogic = function(){
        cpuLogic(getActivePlayer());
    }
    for (let x = 0; x < _board.length; x++){
        _board[x].addEventListener('click', function(){
                playerMakeMove(board[x],getActivePlayer());
            })
    }

    //returns whether move was successful or not
    const playerMakeMove = function(boardPiece, player){
        if(playMove(boardPiece,player)){
            if(gameOver()){
                reset();
                return true;
            }
            playCountAlert(1);
            return true;
        }return false;       
    }

    const cpuLogic = function(cpuPlayer){
        if(cpuPlayer.getName() == "CPU"){
            while(!playerMakeMove(_board[getRandomMove()], cpuPlayer));
        }
    }

    const getRandomMove = function(){
        return Math.floor(Math.random()*9);
    }

    const wipe = function(){
        _board.forEach((boardPiece, index) =>{boardPiece.dataset.played = 'false'; boardPiece.classList.add("invisibleText"); boardPiece.innerText = index;})
        playCount = 2;
        scoreFields.set("field1", 0);
        scoreFields.set("field2", 0);
        _players = [];
        gameBoard.gameEnd();
    }
    
    return{setPlayers, initCPULogic, wipe}
})(gameBoard.board);


const scoreFields = (function(){
    const field1 = document.getElementById("Score1");
    const field2 = document.getElementById("Score2");
    const fields = {field1, field2};

    const set = function(name, val){
        fields[name].innerText = val; 
    }
    return{set};
})()

const playerSelectionButtonsManager = (function(){
    const buttons = document.querySelectorAll(".player");
    const start = document.querySelector(".start");
    let playerSelection = [];
    let playersReady = 0;
    buttons.forEach(button => button.addEventListener("click", function(e)
    {
        selectionMade(e);
    }
        ));
    start.addEventListener('click', function(e){startGame()})

    const selectionMade = function(e){
        playerSelection[playersReady] = e.target.innerText;
        playersReady++;
        e.target.parentNode.classList.add("preGame");
    }

    const startGame = function(){
        if(playersReady !== 2){
            console.log("you fucked up");
            return;
        }
        start.classList.add("preGame");

        playerSelection.forEach(player => {
            console.log(player);
            playerFactory(player).newPlayer();
        })
    }

    const reset = function(){
        playersReady = 0;
        buttons.forEach(button => {button.parentNode.classList.remove("preGame");})
        start.classList.remove("preGame");
    }
    return {reset};
})()

