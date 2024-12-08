const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split("\r\n");

const spelledOut = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

function replaceFromStart(line) {
    for (let i = 0; i < line.length; i++) {
        const substring = line.substring(i);

        const startsWith = spelledOut.find((word) => substring.startsWith(word))

        if (startsWith) {
            line = line.replace(startsWith, spelledOut.indexOf(startsWith) + 1);
            i = 0;
        }
    }

    return line;
}

function replaceFromEnd(line) {
    for (let i = line.length; i >= 0; i--) {
        const substring = line.substring(0, i);

        const startsWith = spelledOut.find((word) => substring.endsWith(word));
        const lastIndex = line.lastIndexOf(startsWith);

        if (startsWith) {
            line =
                line.slice(0, lastIndex) + '' +
                (spelledOut.indexOf(startsWith) + 1) + '' +
                line.slice(lastIndex + startsWith.length);
            
            i = 0;
        }
    }

    return line;
}

console.log(replaceFromStart('three49oneightf'), replaceFromEnd('three49oneightf'));

const numbers = array.map((line) => {
    line = line.trim().toLowerCase();

    const firstLine = replaceFromStart(line.slice());
    const lastLine = replaceFromEnd(line.slice());

    console.log(firstLine, lastLine);

    const first = firstLine.split('').find(isNumber);
    const last = lastLine.split('').findLast(isNumber);


    console.log(first, last);

    return +(first + '' + last);
});


function isNumber(value) {
    return !isNaN(+value);
}

console.log(numbers.reduce((total, item) => total + item, 0));