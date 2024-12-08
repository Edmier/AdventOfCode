const array = require('fs').readFileSync(__dirname + '/' + 'input.txt').toString().split("\n");

const grid = array.map(line => line.trim().split(''));
const gridTwo = structuredClone(grid);

let sum = 0;
let part2 = 0;

for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === 'X') {
            // Check all directions, including diagonals
            const found = [
                lookForMas(i, j, [0, 1]),
                lookForMas(i, j, [1, 0]),
                lookForMas(i, j, [1, 1]),
                lookForMas(i, j, [1, -1]),
                lookForMas(i, j, [0, -1]),
                lookForMas(i, j, [-1, 0]),
                lookForMas(i, j, [-1, -1]),
                lookForMas(i, j, [-1, 1])
            ].filter(Boolean);

            if (found.length > 0) {
                gridTwo[i][j] = 'X';
                sum += found.length;
            }
        }

        if (grid[i][j] === 'A') {
            // Check all directions, including diagonals
            const isCross = lookForCrossMas(i, j);

            if (isCross) {
                part2++;
            }
        }
    }
}

console.log({ part1: sum, part2 });

function lookForMas(x, y, direction) {
    let line = '';

    x += direction[0];
    y += direction[1];

    while (x >= 0 && x < array.length && y >= 0 && y < array[x].length && line.length < 3) {
        line += grid[x][y];

        x += direction[0];
        y += direction[1];
    }

    return line === 'MAS';
}

function lookForCrossMas(x, y) {
    if (x < 1 || x >= grid.length - 1 || y < 1 || y >= grid[x].length - 1) {
        return false;
    }

    const dir1 = grid[x - 1][y - 1] + grid[x + 1][y + 1];
    const dir2 = grid[x - 1][y + 1] + grid[x + 1][y - 1];
    
    return ((dir1 === 'MS' || dir1 === 'SM') && (dir2 === 'MS' || dir2 === 'SM'));
}