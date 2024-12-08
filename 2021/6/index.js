const fs = require('fs');

const fish = fs.readFileSync('input.txt').toString().split(',');

const fishes = {
    age0: 0,
    age1: 0,
    age2: 0,
    age3: 0,
    age4: 0,
    age5: 0,
    age6: 0,
    age7: 0,
    age8: 0,
    total: 0 
}

for (let i = 0; i < fish.length; i++) {
    fishes['age' + fish[i]]++;
}

function calcFish(times) {
    let temp = fishes.age0;
    fishes.age0 = fishes.age1;
    fishes.age1 = fishes.age2;
    fishes.age2 = fishes.age3;
    fishes.age3 = fishes.age4;
    fishes.age4 = fishes.age5;
    fishes.age5 = fishes.age6;
    fishes.age6 = fishes.age7 + temp;
    fishes.age7 = fishes.age8;
    fishes.age8 = temp;

    fishes.total = 0;
    for (let i = 0; i < 9; i++) {
        fishes.total += +fishes['age' + i];
    }

    if (--times !== 0) {
        calcFish(times);
    }
}

calcFish(256);

console.log(fishes.total)
