const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split("\r\n");

const grid = array.map((line) => {
    return line.replaceAll('.', ' ').split('');
});

class GridRegion {
    
    constructor(x, y, char) {
        this.x = x;
        this.y = y;
        this.char = char;
    }

    

    toString() {
        return `${this.char} (${this.x}, ${this.y})`;
    }

}

class Grid {
    constructor(grid = [[]]) {
        this.grid = grid;
    }

    get(x, y) {
        if (!this.inBounds(x, y)) return undefined;
        return row[x];
    }

    trySet(x, y, char) {
        if (!this.inBounds(x, y)) return false;

        this.grid[y][x] = char;
        return true;
    }

    inBounds(x, y) {
        if (y < 0 || y >= this.grid.length) return false;
        if (x < 0 || x >= this.grid[y].length) return false;
        return true;
    }

    neighbors(x, y, filter = () => true) {
        const neighbors = [
            [ x - 1, y - 1 ], [ x, y - 1 ], [ x + 1, y - 1 ],
            [ x - 1, y     ],               [ x + 1, y     ],
            [ x - 1, y + 1 ], [ x, y + 1 ], [ x + 1, y + 1 ]
        ];

        return neighbors
            .filter(([x, y]) => this.inBounds(x, y))
            .filter(filter)
            .map(([x, y]) => ({
                x, y, value: this.grid[y][x]
            }));
    }

    adjacent(x, y, filter = () => true) {
        const neighbors = [
                        [ x, y - 1 ],
            [ x - 1, y ],           [ x + 1, y ],
                        [ x, y + 1 ],
        ];

        return neighbors
            .filter(([x, y]) => this.inBounds(x, y))
            .filter(filter)
            .map(([x, y]) => ({
                x, y, value: this.grid[y][x]
            }));
    }

    toString() {
        return this.grid.map((line) => {
            return line.join('');
        }).join('\n');
    }
}

const foundNumbers = [];

for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    let line = row.join('');

    const numbers = line.replace(/[^0-9]/g, ' ').split(' ')
        .filter((number) => number)
        .map((number) => {
            return number.trim();
        });

    for (const number of numbers) {
        const x = line.indexOf(number);

        // console.log({ x, y, number });
        for (let j = 0; j < number.length; j++) {
            
            if (someNeighbor(x + j, y, (char) => {
                const bool = char !== '' && isNaN(+char);
                if (bool) {
                    // console.log({ char });
                }
                return bool;
            })) {
                foundNumbers.push(+number);
                // console.log('found', number);
                break;
            }
        }

        // Remove number from line
        line = line.replace(number, ' '.repeat(number.length));
    }
}

const foundGears = [];

for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    let line = row.join('');

    const gears = line.replace(/[^*]/g, ' ').split(' ')
        .filter((number) => number)
        .map((number) => {
            return number.trim();
        });

    for (const gear of gears) {
        const x = line.indexOf(gear);

        // console.log({ x, y, number });
        for (let j = 0; j < gear.length; j++) {
            const neighbors = getNeighbors(x + j, y)
                .filter(({ char }) => char.trim() !== '' && !isNaN(+char));

            if (neighbors.length < 2) continue;

            const uniqueNeighbors = neighbors.filter(({ x, y }) => {
                return !neighbors.some(({ x: x2, y: y2 }) => {
                    if (y !== y2) return false;
                    if (x === x2 + 1) return true;
                    return false;
                });
            });

            // console.log({ neighbors });
            // console.log({ uniqueNeighbors });

            if (uniqueNeighbors.length === 2) {
                // console.log('found', uniqueNeighbors);

                const [ num1, num2 ] = uniqueNeighbors.map(({ x, y }) => {
                    return +getNumber(x, y);
                });

                console.log({ num1, num2 });

                foundGears.push(num1 * num2);

                break;
            }
        }

        // Remove number from line
        line = line.replace(gear, ' ');
    }
}

function getNeighbors(x, y) {
    const neighbors = [
        [ x - 1, y - 1 ], [ x, y - 1 ], [ x + 1, y - 1 ],
        [ x - 1, y ], [ x + 1, y ],
        [ x - 1, y + 1 ], [ x, y + 1 ], [ x + 1, y + 1 ]
    ];

    return neighbors.filter(([x, y]) => {
        if (y < 0 || y >= grid.length) {
            return false;
        }

        if (x < 0 || x >= grid[y].length) {
            return false;
        }

        return true;
    }).map(([x, y]) => {
        return {
            x, y, char: grid[y][x]
        };
    });
}

function someNeighbor(x, y, predicate) {
    const neighbors = [
        [ x - 1, y - 1 ], [ x, y - 1 ], [ x + 1, y - 1 ],
        [ x - 1, y ], [ x + 1, y ],
        [ x - 1, y + 1 ], [ x, y + 1 ], [ x + 1, y + 1 ]
    ];

    const characters = neighbors.map(([x, y]) => {
        if (y < 0 || y >= grid.length) {
            return ' ';
        }

        if (x < 0 || x >= grid[y].length) {
            return ' ';
        }

        return grid[y][x];
    });

    // console.log({ characters });

    return characters.some(predicate);
}

function getNumber(x, y) {
    // Search for digits before and after the current position to find the number
    let number = '';
    let pos = 0;

    const line = grid[y].join('').replace(/[^0-9]/g, ' ')

    // Find first white space to the left
    for (let i = x; i >= 0; i--) {
        if (line[i] === ' ') {
            break;
        }
        pos = i;
    }

    // Add all digits to the right of pos until a white space is found
    for (let i = pos; i < line.length; i++) {
        if (line[i] === ' ') {
            break;
        }
        number += line[i];
    }

    const num = +number;

    if (isNaN(num)) {
        console.log({ x, y, number });
        // throw new Error('Not a number');
    }

    return +number;
}

// console.log({ foundNumbers });
const sum = foundNumbers.reduce((a, b) => a + b, 0);
console.log({ sum });

const sum2 = foundGears.reduce((a, b) => a + b, 0);
console.log({ sum2 });