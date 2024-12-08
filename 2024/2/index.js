const array = require('fs').readFileSync(__dirname + '/' + 'input.txt').toString().split("\n");

const safe = [];
const unsafe = [];

for (let i = 0; i < array.length; i++) {
    const numbers = array[i].trim().split(' ').map(Number);
    if (isSafe(numbers)) {
        safe.push(numbers);
    } else {
        unsafe.push(numbers);
    }
}

console.log({safe: safe.length});

const dampened = [];

for (let i = 0; i < array.length; i++) {
    const numbers = array[i].trim().split(' ').map(Number);
    
    if (isSafe(numbers)) {
        dampened.push(numbers);
        continue;
    }

    for (let j = 1; j <= numbers.length; j++) {
        const removed = [...numbers.slice(0, j - 1), ...numbers.slice(j)];
        // console.log({removed});
        if (isSafe(removed)) {
            dampened.push(removed);
            break;
        }
    }
}

console.log({dampened: dampened.length});

function isSafe(numbers) {
    let previous = numbers[0];
    let increasing = undefined;
    
    for (let j = 1; j < numbers.length; j++) {
        const next = numbers[j];

        if (j === 1) {
            increasing = previous < next;
        }

        if (increasing && previous > next) {
            return false;
        }

        if (!increasing && previous < next) {
            return false;
        }

        const diff = Math.abs(+previous - +next);

        if (diff > 3) {
            return false;
        }

        if (diff < 1) {
            return false;
        }

        previous = next;
        
        if (j === numbers.length - 1) {
            return true;
        }
    }
}