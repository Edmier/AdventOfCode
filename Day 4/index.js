const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split("\n");
const draws = array[0].replace('\r', '').split(',');

const boards = [];
let bingocount = 0;

let tempboard = [[], [], [], [], []];
for (let i = 2; i < array.length; i += 6) {
    for (let j = 0; j < 5; j++) {
        const row = array[i + j].trim().replaceAll('  ', ' ').replace('\r', '').split(' ');

        for (let k = 0; k < row.length; k++) {
            tempboard[j].push({ val: +row[k], sel: false });
        }
    }
    boards.push(tempboard);
    tempboard = [[], [], [], [], []];
}

for (let i = 0; i < draws.length; i++) {
    const draw = +draws[i];

    //Select drawn numbers
    for (let j = 0; j < boards.length; j++) {
        for (let k = 0; k < boards[j].length; k++) {
            for (let l = 0; l < boards[j][k].length; l++) {
                if (boards[j][k][l].val === draw) {
                    boards[j][k][l].sel = true;
                }
            }
        }
    }

    //Check for bingo
    for (let j = 0; j < boards.length; j++) {
        const board = boards[j];
        let isBingo = false;
        //Check rows
        for (let k = 0; k < board.length; k++) {
            let selected = 0;
            for (let l = 0; l < board[k].length; l++) {
                if (board[k][l].sel) selected++;
            }
            if (selected > 4) {
                bingo(board, draw);
                boards.splice(j, 1);
                isBingo = true;
            }
        }
        if (isBingo) continue;
        //Check columns
        for (let k = 0; k < board.length; k++) {
            let selected = 0;
            for (let l = 0; l < board[k].length; l++) {
                if (board[l][k].sel) selected++;
            }
            if (selected > 4) {
                bingo(boards[j], draw);
                boards.splice(j, 1);
            }
        }
    }
}

function bingo(board, draw) {
    bingocount++;

    let unselectedsum = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (!board[i][j].sel) {
                unselectedsum += board[i][j].val;
            }
        }
    }

    const score = unselectedsum * draw;

    if (bingocount === 1) {
        console.log('Bingo', score);
    } else if (bingocount === 100) {
        console.log('Last Bingo', score);
    }
}