const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split("\n");

const map = [];
for (let i = 0; i < 1000; i++) {
    let temp = [];
    for (let j = 0; j < 1000; j++) { 
        temp.push(0);
    }
    map.push(temp);
}

let doublecount = 0;

for (let i = 0; i < array.length; i++) {
    const segment = array[i];
    const startpair = segment.split(' ')[0].split(',');
    const endpair = segment.replace('\r', '').split(' ')[2].split(',');

    const start = {
        x: +startpair[0],
        y: +startpair[1]
    }
    const end = {
        x: +endpair[0],
        y: +endpair[1]
    }
    
    if (start.x === end.x) {
        const begin = Math.min(start.y, end.y);
        const stop = Math.max(start.y, end.y);

        for (let j = begin; j <= stop; j++) {
            let square = map[j][start.x];
            if (square === 1) {
                doublecount++;
            }
            map[j][start.x]++;
        }
    } else if (start.y === end.y) {
        const begin = Math.min(start.x, end.x);
        const stop = Math.max(start.x, end.x);

        for (let j = begin; j <= stop; j++) {
            let square = map[start.y][j];
            if (square === 1) {
                doublecount++;
            }
            map[start.y][j]++;
        }
    } else {
        const beginX = Math.min(start.x, end.x);
        const stopX = Math.max(start.x, end.x);

        const beginY = (beginX === start.x) ? start.y : end.y;
        const stopY = (beginX === start.x) ? end.y : start.y;

        let y = 0;
        for (let x = beginX; x <= stopX; x++) {
            let square = map[y + beginY][x];
            if (square === 1) {
                doublecount++;
            }
            map[y + beginY][x]++;

            y += (beginY < stopY) ? 1 : -1;
        }
    }
}

// map.forEach(row => {
//     console.log(row.toString().replaceAll('0', '.').replaceAll(',', ''));
// });

console.log(doublecount);