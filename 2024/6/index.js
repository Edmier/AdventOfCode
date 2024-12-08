const array = require('fs').readFileSync(__dirname + '/' + 'input.txt').toString().split("\n");
const Directions = {
    Up: 0,
    Right: 1,
    Down: 2,
    Left: 3
};
const xObstructions = {};
const yObstructions = {};
let start = [0, 0];
let position = [0, 0];
let direction = Directions.Up;

for (let y = 0; y < array.length; y++) {
    const line = array[y].trim().split('');
    
    for (let x = 0; x < line.length; x++) {
        const cell = line[x];
        
        if (cell === '#') {
            xObstructions[y] ??= [];
            yObstructions[x] ??= [];

            xObstructions[y].push(+x);
            yObstructions[x].push(+y);
        }

        if (cell === '^') {
            start = [+x, +y];
            position = [+x, +y];
        }
    }
}

let visited = {};
let loops = 0;

function move() {
    visited = {};
    const steps = {};

    while (true) {
        let next = nextLocation();
        const stop = next[0] === undefined || next[1] === undefined;

        if (next[0] === undefined) {
            if (direction === Directions.Left) {
                next[0] = 0;
            }
            if (direction === Directions.Right) {
                next[0] = array[0].length - 1;
            }
        }

        if (next[1] === undefined) {
            if (direction === Directions.Up) {
                next[1] = 0;
            }
            if (direction === Directions.Down) {
                next[1] = array.length - 1;
            }
        }
        
        for (let x = Math.min(position[0], next[0]); x <= Math.max(position[0], next[0]); x++) {
            for (let y = Math.min(position[1], next[1]); y <= Math.max(position[1], next[1]); y++) {
                const visit = visited[`${x},${y}`] ??= [];
                visit.push(direction);
            }
        }

        if (stop) break;
        const key = `${next[0]},${next[1]}`;

        if (steps[key]) {
            if (steps[key].includes(direction)) {
                loops++;
                return true;
            }

            steps[key].push(direction);
        } else {
            steps[key] = [ direction ];
        }

        position = next;
        rotateRight();
    }
}

move();
console.log({ part1: Object.keys(visited).length - 1 });

const startMs = Date.now();
for (let x = 0; x < array[0].length; x++) {
    for (let y = 0; y < array.length; y++) {
        if (array[y][x] === '#') {
            continue;
        }

        if (x === start[0] && y === start[1]) {
            continue;
        }

        // Add obstruction at position
        xObstructions[y] ??= [];
        yObstructions[x] ??= [];

        if (xObstructions[y].includes(x) || yObstructions[x].includes(y)) {
            continue;
        }

        xObstructions[y].push(x);
        yObstructions[x].push(y);

        yObstructions[x].sort((a, b) => a - b);
        xObstructions[y].sort((a, b) => a - b);

        position = start;
        direction = Directions.Up;
        
        if (move()) {
            // console.log({xObstructions, yObstructions});
            // printGrid([x, y]);
        }

        // Remove temporary obstruction
        xObstructions[y] = xObstructions[y].filter(o => o !== x);
        yObstructions[x] = yObstructions[x].filter(o => o !== y);
    }
}

console.log({ duration: Date.now() - startMs });

console.log({ part2: loops });

function printGrid(obstruction) {
    for (let y = 0; y < array.length; y++) {
        const line = array[y].trim().split('');
        
        for (let x = 0; x < line.length; x++) {
            if (obstruction) {
                if (obstruction[0] === x && obstruction[1] === y) {
                    process.stdout.write('O');
                    continue;
                }
            }
            if (visited[`${x},${y}`]) {
                process.stdout.write('x');
            } else {
                process.stdout.write(line[x]);
            }
        }
        process.stdout.write('\n');
    }
}

function nextLocation() {
    const [x, y] = position;

    switch (direction) {
        case Directions.Up:
            const nextY = yObstructions[x]?.findLast(o => o < y);
            return [x, nextY === undefined ? undefined : nextY + 1];
        case Directions.Right:
            const nextX = xObstructions[y]?.find(o => o > x);
            return [nextX === undefined ? undefined : nextX - 1, y];
        case Directions.Down:
            const nextY2 = yObstructions[x]?.find(o => o > y);
            return [x, nextY2 === undefined ? undefined : nextY2 - 1];
        case Directions.Left:
            const nextX2 = xObstructions[y]?.findLast(o => o < x);
            return [nextX2 === undefined ? undefined : nextX2 + 1, y];
    }
}

function rotateRight() {
    switch (direction) {
        case Directions.Up:
            direction = Directions.Right;
            break;
        case Directions.Right:
            direction = Directions.Down;
            break;
        case Directions.Down:
            direction = Directions.Left;
            break;
        case Directions.Left:
            direction = Directions.Up;
            break;
    }
}