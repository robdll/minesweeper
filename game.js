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

    //place numbers
    var cellsAbove = [-11, -10, -9];
    var cellsBelow = [9, 10, 11];
    var cellsOnLeft = [-11, -1, 9];
    var cellsOnRight = [-9, 1, 11];
    gameCells = Array.from(nodeList);
    gameCells.forEach( (cell, idx, arr) => {
        if(!cell.classList.contains('bomb')) {
            var toIgnore = [];
            if (idx<10)     { toIgnore = toIgnore.concat(cellsAbove);  }
            if (idx>=90)    { toIgnore = toIgnore.concat(cellsBelow);  }
            if (idx%10===0) { toIgnore = toIgnore.concat(cellsOnLeft); }
            if (idx%10===9) { toIgnore = toIgnore.concat(cellsOnRight);}
            var adjacentCells = [-11, -10, -9, -1, 1, 9, 10, 11]
                .filter( c => toIgnore.indexOf(c) < 0)
                .map( c => c+idx)
                .map( c => arr[c]);
            var bombNumber = adjacentCells.map( c => c.classList.contains('bomb') ? 1 : 0).reduce( (a,b) => a+b, 0);
            if(bombNumber>0) gameCells[idx].innerText = bombNumber
        }
    });

    //mask cells 
    gameCells.forEach( n => {
        n.classList.add('mask')
        n.onclick = function (el) {
            console.log(el.target.classList)
            el.target.classList.remove('mask')
        }
    })
}

start(10);

