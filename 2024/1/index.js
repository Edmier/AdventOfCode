const array = require('fs').readFileSync(__dirname + '/' + 'input.txt').toString().split("\n");

const left = [];
const right = [];

for (let i = 0; i < array.length; i++) {
    const [l, r] = array[i].split('   ');
    left.push(+l);
    right.push(+r);
}

left.sort();
right.sort();

let sum = 0;

for (let i = 0; i < left.length; i++) {
    const r = right[i];
    const l = left[i];

    sum += Math.abs(+r - +l);
}

console.log({sum});

let similarity = 0;

for (let i = 0; i < left.length; i++) {
    const l = left[i];

    const matches = right.filter(r => r === l).length;

    similarity += l * matches;
}

console.log({similarity});