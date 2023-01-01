const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split('\n');

const grid = array.map(line => line.split('').map(h => parseInt(h)));
const scenicScores = [[]];

let visible = 0;
let highest = 0;
for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
        const current = grid[y][x];

        const left = grid[y].slice(0, x).reverse();
        const right = grid[y].slice(x + 1);
        const top = grid.slice(0, y).map(row => row[x]).reverse();
        const bottom = grid.slice(y + 1).map(row => row[x]);

        if (scenicScores[y] === undefined) {
            scenicScores[y] = [].fill(0, 0, grid[y].length);
        }
        
        let leftScore = left.findIndex(h => h >= current);
        let rightScore = right.findIndex(h => h >= current);
        let topScore = top.findIndex(h => h >= current);
        let bottomScore = bottom.findIndex(h => h >= current);

        leftScore = leftScore === -1 ? left.length : leftScore + 1;
        rightScore = rightScore === -1 ? right.length : rightScore + 1;
        topScore = topScore === -1 ? top.length : topScore + 1;
        bottomScore = bottomScore === -1 ? bottom.length : bottomScore + 1;

        scenicScores[y][x] = leftScore * rightScore * topScore * bottomScore;
        if (scenicScores[y][x] > highest) {
            highest = scenicScores[y][x];
        }

        if (left.some(h => h >= current) && right.some(h => h >= current) && top.some(h => h >= current) && bottom.some(h => h >= current)) {
            continue;
        }
        visible++;
    }
}

console.log({visible});
console.log({highest});