const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split("\n");

const map = []; 

for (let i = 0; i < array.length; i++) {
    const element = array[i].replace('\r', '').split('');
    
    map.push(element);
}

let risksum = 0;

for (let i = 0; i < map.length; i++) {
    const row = map[i];
    for (let j = 0; j < row.length; j++) {
        const cell = +row[j];
        
        let lowest = true;
        if (i > 0) {
            if (+map[i - 1][j] <= cell) {
                lowest = false;
            }
        } 
        if (i < map.length - 1) {
            if (+map[i + 1][j] <= cell) {
                lowest = false;
            } 
        }
        if (j > 0) {
            if (+map[i][j - 1] <= cell) {
                lowest = false;
            } 
        } 
        if (j < row.length - 1) {
            if (+map[i][j + 1] <= cell) {
                lowest = false;
            }
        }

        if (lowest) {
            risksum += (cell + 1);
            // console.log(calcBasin(i , j));
        };
    }
}

// console.log({risksum});

//Part 2

const basinmap = map.slice();

const basinLines = [];

for (let i = 0; i < basinmap.length; i++) {
    const row = basinmap[i];
    for (let j = 0; j < row.length; j++) {
        const cell = +row[j];

        if (cell !== 9 && (j === 0 || +row[j - 1] === 9)) {
            basinLines.push(calcBasinLine(i, j));
        }
    }
}

let highest = 0, secondhigh = 0, thirdhigh = 0;
basinLines.forEach(line => {
    if (!line.used) {
        const basinSize = groupLines(line);
        // console.log(`Full ${basinSize}`);
        if (basinSize > highest) {
            thirdhigh = secondhigh;
            secondhigh = highest;
            highest = basinSize;
        } else if (basinSize > secondhigh) {
            thirdhigh = secondhigh;
            secondhigh = basinSize;
        } else if (basinSize > thirdhigh) {
            thirdhigh = basinSize;
        }
    } 
});
console.log(highest, secondhigh, thirdhigh, highest * secondhigh * thirdhigh);

function groupLines(startLine) {
    let fullsize = startLine.length;
    startLine.used = true;
    for (let i = 0; i < basinLines.length; i++) {
        const line = basinLines[i];
        
        if (!(line.i === startLine.i + 1 || line.i === startLine.i - 1) || line.used) continue;

        for (let j = line.j; j < line.length + line.j; j++) {
            if (startLine.j <= j && j < startLine.j + startLine.length) {
                line.used = true;
                fullsize += groupLines(line, true);
                break;
            }
        }
    }
    return fullsize;
}

function calcBasinLine(y, x) {
    let basinsize = 0;

    for (let i = x; i < basinmap[y].length; i++) {
        const cell = +basinmap[y][i];
        if (cell !== 9) {
            basinsize++;            
        } else break;
    }

    return {
        i: y, 
        j: x,
        length: basinsize,
        used: false
    };
}

// basinmap.forEach(row => {
//     console.log(row.toString().replaceAll('9', ' ').replaceAll(',', ' '));
// });



// function calcBasin(i, j) {
//     let basinsize = 1;

//     let stop = false;
//     for (let i = 0; i < checked.length; i++) {
//         const e = checked[i];
//         if (e.x === i && e.x === j) {
//             stop = true;
//             return;
//         }
//     }

//     if (stop) return basinsize;

//     checked.push({ x: i, y: j });

//     if (i > 0) {
//         if (map[i - 1][j] !== 9) {
//             basinsize += calcBasin(i - 1, j);
//         }
//     } 
//     if (i < map.length - 1) {
//         if (map[i + 1][j] !== 9) {
//             basinsize += calcBasin(i + 1, j);
//         } 
//     }
//     if (j > 0) {
//         if (map[i][j - 1] !== 9) {
//             basinsize += calcBasin(i, j - 1);
//         } 
//     } 
//     if (j < map[0].length - 1) {
//         if (map[i][j + 1] !== 9) {
//             basinsize += calcBasin(i, j + 1);
//         }
//     }
//     return basinsize;
// }

// function basinNeighbors(i, j) {

// }

