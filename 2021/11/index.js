const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split("\n");

const map = []; 

let totalFlashes = 0;
let flashed = [];

for (let i = 0; i < array.length; i++) {
    const element = array[i].replace('\r', '').split('');
    
    map.push(element);
}

// printMap();

for (let i = 1; i <= 1000; i++) {
    let flashes = doStep();
    if (i === 100) {
        console.log({totalFlashes});
    }
    if (flashes === map.length * map[0].length) {
        console.log(i);
        break;
    }
}

function doStep() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            map[i][j] = +map[i][j] + 1;
        }
    }
    flash();
    flashed.forEach(f => {
        map[f.i][f.j] = 0;
    });
    // printMap();
    let flashes = flashed.length;
    flashed = [];

    totalFlashes += flashes;
    return flashes;
}

function flash() {
    for (let i = 0; i < map.length; i++) {
        const row = map[i];
        for (let j = 0; j < row.length; j++) {
            const cell = +row[j];
    
            let skip = false;
            flashed.forEach(element => {
                if (i === element.i && j === element.j) skip = true;
            });
            if (cell <= 9 || skip) continue;

            if (i > 0) {
                map[i - 1][j] = +map[i - 1][j] + 1;

                if (j > 0) {
                    map[i - 1][j - 1] = +map[i - 1][j - 1] + 1;
                } 
                if (j < row.length - 1) {
                    map[i - 1][j + 1] = +map[i - 1][j + 1] + 1;
                }
            }
            if (i < map.length - 1) {
                map[i + 1][j] = +map[i + 1][j] + 1;

                if (j > 0) {
                    map[i + 1][j - 1] = +map[i + 1][j - 1] + 1;
                } 
                if (j < row.length - 1) {
                    map[i + 1][j + 1] = +map[i + 1][j + 1] + 1;
                }
            }
            if (j > 0) {
                map[i][j - 1] = +map[i][j - 1] + 1;
            } 
            if (j < row.length - 1) {
                map[i][j + 1] = +map[i][j + 1] + 1;
            }

            map[i][j] = 0;
            flashed.push({ i: i, j: j });
            flash();
        }
    }
}

function printMap() {
    map.forEach(row => {
        console.log(row.join('').replaceAll('0', ' '));
    });
    console.log();
}