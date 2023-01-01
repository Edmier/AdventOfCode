const fs = require('fs');

const input = fs.readFileSync('input.txt').toString().trim();

let marker = '';

for (let i = 3; i < input.length; i++) {
    const segment = input.substring(i - 3, i + 1);

    const set = new Set(segment);

    if (set.size === 4) {
        marker = segment;
        break;
    }
}

console.log(marker, input.indexOf(marker) + 4);


let message = '';

for (let i = 13; i < input.length; i++) {
    const segment = input.substring(i - 13, i + 1);
    const set = new Set(segment);

    if (set.size === 14) {
        message = segment;
        break;
    }
}

console.log(message, input.indexOf(message) + 14);