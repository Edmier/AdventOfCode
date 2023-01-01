const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split("\r\n\r\n");

const highestCalories = array.map((inventory) => {
    return inventory.split('\r\n').reduce((total, item) => total + +item, 0);
}, 0).sort((a, b) => b - a);

console.log('Top: ' + highestCalories[0]);
console.log('Top 3: ' + highestCalories.slice(0, 3).reduce((total, item) => total + +item, 0));