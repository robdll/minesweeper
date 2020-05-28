const difficullty = {
    easy: { bomb: 10 },
    medium: { bomb: 15 },
    hard: { bomb: 20 },
}

function start(type) {

    //restart logic
    var nodeList = document.getElementsByClassName("game-cell");
    var gameCells = Array.from(nodeList);
    const popup = document.getElementById('popup');
    popup.classList.remove('show');
    gameCells.forEach( cell => { 
        cell.innerText = '';
        cell.classList = ['game-cell']
    })

    let bombs = difficullty[type].bomb;
    // place bombs logic
    var totalCells = gameCells.length;
    while(bombs > 0 ) {
        let index = Math.floor(Math.random() * totalCells);
        gameCells[index].classList.add('bomb');
        gameCells.splice(index, 1)
        totalCells--;
        bombs--;
    }

    //place numbers logic
    gameCells = Array.from(nodeList);
    gameCells.forEach( (cell, idx, arr) => {
        if(!cell.classList.contains('bomb')) {
            let toIgnore = getCellToIgnore(idx)
            let adjacentCells = [-11, -10, -9, -1, 1, 9, 10, 11]
                .filter( c => toIgnore.indexOf(c) < 0)
                .map( c => c+idx)
                .map( c => arr[c]);
            let bombNumber = adjacentCells.map( c => c.classList.contains('bomb') ? 1 : 0).reduce( (a,b) => a+b, 0);
            if(bombNumber>0) {
                var cls = ['blue', 'green', 'red', 'peru', 'purple', 'purple', 'purple'];
                gameCells[idx].innerText = bombNumber;
                gameCells[idx].classList.add(cls[bombNumber-1]);
            }
        }
    });

    //mask cells 
    gameCells.forEach( cell => { cell.classList.add('mask') })

    //click logic
    gameCells.forEach( cell => {
        cell.onclick = function (el) {
            let isBomb = el.target.classList.contains('bomb');
            if(isBomb) {
                el.target.classList.remove('mask');
                displayGameOver('You Lost', 'red')
            } else {
                checkContent(el.target)
            }
        }
    })

    //recursion function
    function checkContent(cell) {
        if(!cell.classList.contains('mask')) {
            return
        }
        cell.classList.remove('mask');
        checkWin()
        let isNextToBomb = cell.innerText !== '';
        if(!isNextToBomb) {
            let cellIdx = gameCells.indexOf(cell);
            let toIgnore = getCellToIgnore(cellIdx)
            let adjacentCells = [-11, -10, -9, -1, 1, 9, 10, 11];
            adjacentCells.filter( c => toIgnore.indexOf(c) < 0)
                .map( c => c+cellIdx)
                .map( c => gameCells[c])
                .forEach( c => { checkContent(c) });
        }   
    }

    //display game over logic 
    function checkWin() {
        var remainingCell = gameCells.filter( c => c.classList.contains('mask'));
        if(remainingCell.length === difficullty[type].bomb) {
            displayGameOver('You Won!', 'green')
        }
    }

    // util function
    function getCellToIgnore(id) {
        let toIgnore = [];
        const cellsAbove = [-11, -10, -9];
        const cellsBelow = [9, 10, 11];
        const cellsOnLeft = [-11, -1, 9];
        const cellsOnRight = [-9, 1, 11];
        if (id<10)     { toIgnore = toIgnore.concat(cellsAbove);  }
        if (id>=90)    { toIgnore = toIgnore.concat(cellsBelow);  }
        if (id%10===0) { toIgnore = toIgnore.concat(cellsOnLeft); }
        if (id%10===9) { toIgnore = toIgnore.concat(cellsOnRight);}
        return toIgnore;
    }
    

    function displayGameOver(text, cls) {
        const popup = document.getElementById('popup');
        popup.classList.add('show');
        const cardHeader = document.getElementsByClassName('game-over-header')[0];
        cardHeader.innerText = text;
        cardHeader.classList.add(cls);

    }

}

start('easy');

