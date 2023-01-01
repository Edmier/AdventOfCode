const fs = require('fs');
const array = fs.readFileSync('input.txt').toString().split("\n");

const pairs = array.map((item) => {
    const [ first, second ] = item.split(',');

    const [ firstStart, firstEnd ] = first.trim().split('-');
    const [ secondStart, secondEnd ] = second.trim().split('-');

    const length = Math.max(firstEnd, secondEnd) + 3;
    const firstArray = new Array(length).fill('.');
    const secondArray = new Array(length).fill('.');

    for (let i = firstStart; i <= firstEnd; i++) {
        firstArray[i] = i;
    }

    for (let i = secondStart; i <= secondEnd; i++) {
        secondArray[i] = i;
    }

    // console.log(`${firstStart}-${firstEnd} ${firstArray.join(' ')}`);
    // console.log(`${secondStart}-${secondEnd} ${secondArray.join(' ')}`);
    // console.log((+firstStart <= +secondStart && +firstEnd >= +secondEnd) || (+secondStart <= +firstStart && +secondEnd >= +firstEnd));
    
    return (+firstStart <= +secondStart && +firstEnd >= +secondEnd) || (+secondStart <= +firstStart && +secondEnd >= +firstEnd);
});

console.log('Full Contains: ' + pairs.filter((e) => e).length);

const anyOverlap = array.map((item) => {
    const [ first, second ] = item.split(',');

    const [ firstStart, firstEnd ] = first.trim().split('-');
    const [ secondStart, secondEnd ] = second.trim().split('-');

    for (let i = +firstStart; i <= +firstEnd; i++) {
        //console.log(i, +secondStart, +secondEnd);
        if (i >= +secondStart && i <= +secondEnd) {
            return true;
        }
    }

    return false;
});

console.log('Any Overlap: ' + anyOverlap.filter((e) => e).length);