const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split('\n');

let cycle = 0;
let X = 1;
let interesting = 0;
let buffer = '';

for (const intruction of array) {
    const [operation, argument] = intruction.split(' ');

    if (operation === 'noop') {
        instruction();
        continue;
    }

    if (operation === 'addx') {
        instruction();
        instruction();
        X += parseInt(argument);
        continue;
    }
}

function instruction() {
    cycle++;

    buffer += (Math.abs(X - buffer.length / 2) < 2) ? '00' : '  ';

    if (cycle % 40 === 0) {
        console.log(`Cycle ${cycle.toLocaleString(undefined, { minimumIntegerDigits: 3 })} ->   ${buffer}`);
        buffer = '';
    }

    if (cycle === 20 || (cycle - 20) % 40 === 0) {
        interesting += cycle * X;
    }
}

console.log({ interesting });