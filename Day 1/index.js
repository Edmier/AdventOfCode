const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split("\n");

let increases = 0;
for (let i = 1; i < array.length; i++) {
    if (+array[i] > +array[i - 1]) {
        increases++;
    }
}

console.log({increases});


let windowInc = 0;

for (let i = 3; i < array.length; i++) {
    const prev = (+array[i - 3]) + (+array[i - 2]) + (+array[i - 1]);
    const curr = +array[i - 2] + +array[i - 1] + +array[i];

    if (curr > prev) {
        windowInc++;
    }
}

console.log({windowInc});
