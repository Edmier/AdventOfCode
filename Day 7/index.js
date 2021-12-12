const fs = require('fs');

let min = 0, max = 0;
const array = fs.readFileSync('input.txt').toString().split(',').map(function (x) { 
    min = Math.min(+x, min);
    max = Math.max(+x, max);
    return parseInt(x, 10); 
});

let minfuel = 10000000000000, bestposition = 0;
for (let i = min + 1; i < max; i++) {
    let fuelused = 0;
    for (let j = 0; j < array.length; j++) {
        //Part 1:
        //fuelused += Math.abs(array[j] - i);
        //Part 2:
        let distance = Math.abs(array[j] - i);
        fuelused += distance * (distance + 1) / 2;
    }
    if (fuelused < minfuel) {
        minfuel = fuelused;
        bestposition = i;
    }
}

console.log(minfuel, bestposition);