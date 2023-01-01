const fs = require('fs');
const array = fs.readFileSync('input.txt').toString().split("\n");

const values = {
    A: 1,
    B: 2,
    C: 3,
}

const outcome = {
    LOST: 0,
    WON: 6,
    DRAW: 3,
}

const scores = array.map((moves) => {
    const [ theirs, yourMove ] = moves.trim().split(' ');
    const yours = yourMove === 'X' ? 'A' : yourMove === 'Y' ? 'B' : 'C';

    if (theirs === yours) {
        return +outcome.DRAW + +values[yours];
    }

    if (theirs === 'A' && yours === 'B') {
        return +outcome.WON + +values[yours];
    }
    if (theirs === 'A' && yours === 'C') {
        return +outcome.LOST + +values[yours];
    }

    if (theirs === 'B' && yours === 'A') {
        return +outcome.LOST + +values[yours];
    }
    if (theirs === 'B' && yours === 'C') {
        return +outcome.WON + +values[yours];
    }

    if (theirs === 'C' && yours === 'A') {
        return +outcome.WON + +values[yours];
    }
    if (theirs === 'C' && yours === 'B') {
        return +outcome.LOST + +values[yours];
    }

    return 0;
});

//console.log({ scores });
console.log('Total: ' + scores.reduce((total, item) => total + +item, 0));


// Part 2

const endings = array.map((moves) => {
    const [ theirs, yours ] = moves.trim().split(' ');

    if (yours === 'Y') {
        return outcome.DRAW + values[theirs];
    }

    if (yours === 'Z') {
        if (theirs === 'A') {
            return outcome.WON + values.B;
        }
        if (theirs === 'B') {
            return outcome.WON + values.C;
        }
        if (theirs === 'C') {
            return outcome.WON + values.A;
        }
    }

    if (yours === 'X') {
        if (theirs === 'A') {
            return outcome.LOST + values.C;
        }
        if (theirs === 'B') {
            return outcome.LOST + values.A;
        }
        if (theirs === 'C') {
            return outcome.LOST + values.B;
        }
    }

    return 0;
});

//console.log({ endings });
console.log('Total: ' + endings.reduce((total, item) => total + +item, 0));