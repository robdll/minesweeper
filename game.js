function start(n) {
    // place bombs
    if(n > 30) { n = 30; }
    var nodeList = document.getElementsByClassName("game-cell");
    gameCells = Array.from(nodeList);
    var totalCells = gameCells.length;
    while(n > 0 ) {
        var index = Math.floor(Math.random() * totalCells);
        gameCells[index].classList.add('bomb');
        gameCells.splice(index, 1)
        totalCells--;
        n--;
    }

   
}

start(10);

