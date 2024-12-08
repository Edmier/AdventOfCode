const array = require('fs').readFileSync(__dirname + '/' + 'input.txt').toString().split("\n");

let sum = 0;
let part2 = 0;

const globalRegex = /(mul\(\d{1,3},\d{1,3}\))|(do\(\))|(don't\(\))/g;
const regex = /mul\((\d{1,3}),(\d{1,3})\)/;

let enabled = true;
for (let i = 0; i < array.length; i++) {
    const line = array[i].trim();
    const matches = line.match(globalRegex) || [];

    for (let j = 0; j < matches.length; j++) {
        const match = matches[j];

        if (match === 'do()') {
            enabled = true;
            continue;
        }

        if (match === 'don\'t()') {
            enabled = false;
            continue;
        }

        const [_, a, b] = match.match(regex);
        const result = a * b;
        if (enabled) {
            part2 += result;
        }
        sum += a * b;
    }
}

console.log({sum});
console.log({part2});