const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split("\n");

let gamma = '', epsilon = '';
for (let i = 0; i < array[0].split('').length - 1; i++) {
    let ones = 0, zeros = 0;
    for (let j = 0; j < array.length; j++) {
        if (array[j].split('')[i] === '0') {
            zeros++;
        } else {
            ones++;
        }
    }

    gamma += (ones > zeros) ? '1' : '0';
    epsilon += (ones > zeros) ? '0' : '1';
}

console.log(gamma, epsilon, parseInt(gamma, 2) * parseInt(epsilon, 2));

//Part 2

let oxygen = array.slice();
let scrubber = array.slice();

for (let i = 0; i < array[0].split('').length - 1; i++) {
    let ones = 0, zeros = 0;
    for (let j = 0; j < oxygen.length; j++) {
        if (oxygen[j].split('')[i] === '0') {
            zeros++;
        } else {
            ones++;
        }
    }

    const oxcommon = (ones >= zeros) ? '1' : '0';
    for (let j = oxygen.length - 1; j >= 0; j--) {
        if (oxygen[j].split('')[i] !== oxcommon) {
            oxygen.splice(j, 1);
        }
    }

    ones = 0; zeros = 0;
    for (let j = 0; j < scrubber.length; j++) {
        if (scrubber[j].split('')[i] === '0') {
            zeros++;
        } else {
            ones++;
        }
    }

    const sccommon = (ones >= zeros) ? '1' : '0';
    for (let j = scrubber.length - 1; j >= 0; j--) {
        if (scrubber.length === 1) break;
        if (scrubber[j].split('')[i] === sccommon) {
            scrubber.splice(j, 1);
        }
    }
}

console.log(oxygen[0], scrubber[0], parseInt(oxygen[0], 2) * parseInt(scrubber[0], 2));