const difficulty = {
    easy: { bomb: 10, available: true },
    medium: { bomb: 15 },
    hard: { bomb: 20 },
}


function start(type) {

    //restart logic
    if(!difficulty[type].available) { return }
    var nodeList = document.getElementsByClassName("game-cell");
    var gameCells = Array.from(nodeList);
    const popup = document.getElementById('popup');
    popup.classList.remove('show');
    gameCells.forEach( cell => { 
        cell.innerText = '';
        cell.classList = ['game-cell']
    });
    ['easy', 'medium', 'hard'].forEach( level => { difficulty[level].active = type === level})


    let bombs = difficulty[type].bomb;
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
            //avoid action if cell is yellow or already checked
            if(!el.altKey && el.target.classList.contains("yellow")) return ;
            if(!el.target.classList.contains('mask')) return ;

            // toggle yellow color if alt clicked 
            if(el.altKey) {
                var placed = document.getElementsByClassName("yellow").length;
                if(el.target.classList.contains("yellow")) {
                    el.target.classList.toggle("yellow");
                    document.getElementById('bomb-available').innerText = (difficulty[type].bomb - placed +1);
                    return
                } else if(placed < difficulty[type].bomb) {
                    el.target.classList.toggle("yellow");
                    document.getElementById('bomb-available').innerText = (difficulty[type].bomb - placed -1);
                } 
                return ;
            }
            
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
        if(!cell.classList.contains('mask')) return ;
        cell.classList.remove('mask'); 
        if(cell.classList.contains('yellow')) {
            cell.classList.remove('yellow');
            const currentVal = Number.parseInt(document.getElementById('bomb-available').innerText)
            document.getElementById('bomb-available').innerText = currentVal +1;
        }
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
        if(remainingCell.length === difficulty[type].bomb) {
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

}

function toggleHowToPlay() {
    const popup = document.getElementById('howtoplay');
    const fnToCall = popup.classList.contains('show') ? 'remove' : 'add';
    popup.classList[fnToCall]('show');
}

function displayGameOver(text, cls) {
    const popup = document.getElementById('popup');
    popup.classList.add('show');
    const cardHeader = document.getElementsByClassName('game-over-header')[0];
    cardHeader.innerText = text;
    cardHeader.classList.add(cls);
    if(cls === 'green') {
        const b2 =  document.getElementsByClassName('button2')[0];
        const b3 =  document.getElementsByClassName('button3')[0];
        if(difficulty.easy.active) { 
            difficulty.medium.available = true; 
            b2.classList.remove('inactive')
        }
        if(difficulty.medium.active) { 
            difficulty.hard.available = true; 
            b3.classList.remove('inactive')
        }
    }
}

start('easy');

