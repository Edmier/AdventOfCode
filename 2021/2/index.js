const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split("\n");

let depth = 0, hDist = 0;
for (let i = 0; i < array.length; i++) {
    const element = array[i];
    const split = element.split(' ');

    const dir = split[0];
    const num = +split[1];

    if (dir === 'forward') {
        hDist += num;
    } else if (dir === 'up') {
        depth -= num;
    } else {
        depth += num;
    }
}

console.log({depth}, {hDist}, depth * hDist);

//Part 2

depth = 0, hDist = 0, aim = 0;
for (let i = 0; i < array.length; i++) {
    const element = array[i];
    const split = element.split(' ');

    const dir = split[0];
    const num = +split[1];

    if (dir === 'forward') {
        hDist += num;
        depth += aim * num;
    } else if (dir === 'up') {
        aim -= num;
    } else {
        aim += num;
    }
}

console.log({depth}, {hDist}, depth * hDist);