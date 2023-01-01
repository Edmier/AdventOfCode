const fs = require('fs');
const array = fs.readFileSync('input.txt').toString().split("\n");

const priority = (letter) => {
    return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(letter) + 1;
}

const prioritySum = (line) => {
    const letters = line.split('');
    const firstHalf = letters.slice(0, letters.length / 2);
    const secondHalf = letters.slice(letters.length / 2);

    const letter = firstHalf.find((letter) => {
        return secondHalf.includes(letter);
    });

    return priority(letter);
}

const sum = array.reduce((acc, line) => {
    return acc + prioritySum(line);
}, 0);

console.log('Priority Sum: ' + sum);

const groups = array.reduce((acc, line) => {
    const current = acc[acc.length - 1];

    if (current.length < 3) {
        current.push(line);
    } else {
        acc.push([line]);
    }

    return acc;
}, [[]]);

const groupSum = groups.reduce((acc, group) => {

    const letter = group[0].split('').find((letter) => {
        return group.every((line) => {
            return line.includes(letter);
        });
    });

    return acc + priority(letter);
}, 0);

console.log('Group Sum: ' + groupSum);