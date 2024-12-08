const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split("\n");

let illegalScore = 0;

for (let i = 0; i < array.length; i++) {
    const line = array[i].replace('\r', '').split('');
    // console.log(array[i])

    const openings = [];
    for (let k = 0; k < line.length; k++) {
        const char = line[k];

        if (['(', '[', '{', '<'].includes(char)) {
            openings.push(char);
        } else if (getOpposite(char) === openings.at(-1)) {
            openings.pop();
        } else {
            // console.log(array[i], ` - Expected ${getOpposite(openings.at(-1))}, but found ${char} instead.`);
            if (char === ')') {
                illegalScore += 3;
            } else if (char === ']') {
                illegalScore += 57;
            } else if (char === '}') {
                illegalScore += 1197;
            } else {
                illegalScore += 25137;
            }
            break;
        }
    }
}

console.log(illegalScore);

function getOpposite(char) {
    if (char === '(') return ')';
    if (char === ')') return '(';
    if (char === '[') return ']';
    if (char === ']') return '[';
    if (char === '{') return '}';
    if (char === '}') return '{';
    if (char === '<') return '>';
    if (char === '>') return '<';
    return undefined;
}

//Part 2

const scores = [];

for (let i = 0; i < array.length; i++) {
    const line = array[i].replace('\r', '').split('');

    let illegal = false;
    const openings = [];
    for (let k = 0; k < line.length; k++) {
        const char = line[k];

        if (['(', '[', '{', '<'].includes(char)) {
            openings.push(char);
        } else if (getOpposite(char) === openings.at(-1)) {
            openings.pop();
        } else {
            illegal = true;
        }
    }
    if (illegal) continue;

    const closings = openings.slice('').reverse();
    let score = 0;

    closings.forEach(char => {
        score *= 5;
        if (char === '(') {
            score += 1;
        } else if (char === '[') {
            score += 2;
        } else if (char === '{') {
            score += 3;
        } else {
            score += 4;
        }
    });

    scores.push(score);
}

console.log(scores.sort(function(a, b) {
    return a - b;
})[Math.floor(scores.length / 2)]);