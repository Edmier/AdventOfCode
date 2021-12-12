const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split("\n");

let totalsum = 0;

for (let i = 0; i < array.length; i++) {
    const element = array[i].replace('\r', '');
    const split = element.split(' | ');

    const input = split[0].split(' ').sort(function(a, b){
        return a.length - b.length;
    });
    const output = split[1].split(' ');

    // console.log(input);

    let first = '';
    let second = '';
    let third = '';
    let fourth = '';
    let fifth = '';
    let sixth = '';
    let seventh = '';

    //Solve first
    input[1].split('').forEach(letter => {
        if (!input[0].split('').includes(letter)) first = letter;
    });

    //Solve fourth
    input[9].split('').forEach(letter => {
        if (!input[6].split('').includes(letter)) {
            if (input[2].split('').includes(letter) && !input[0].split('').includes(letter)) {
                fourth = letter;
            }
        }
    });
    input[9].split('').forEach(letter => {
        if (!input[7].split('').includes(letter)) {
            if (input[2].split('').includes(letter) && !input[0].split('').includes(letter)) {
                fourth = letter;
            }
        }
    });
    input[9].split('').forEach(letter => {
        if (!input[8].split('').includes(letter)) {
            if (input[2].split('').includes(letter) && !input[0].split('').includes(letter)) {
                fourth = letter;
            }
        }
    });
    // console.log(firstma, secondma, thirdma)
    // fourth = (firstma.length < 2 ? firstma : (secondma.length < 2 ? secondma : thirdma));

    //Solve second
    input[2].split('').forEach(letter => {
        if (!(input[0] + '' + fourth).split('').includes(letter)) second = letter;
    });

    //Solve seventh
    let firstmismatch = '';
    let secondmismatch = '';
    let thirdmismatch = '';

    const matchagainst = (input[0] + first + second + fourth).split('');

    let fmatch = input[0].split('')[0];
    let smatch = input[0].split('')[1];
    if (input[6].split('').includes(fmatch) && input[6].split('').includes(smatch)) {
        input[6].split('').forEach(letter => {
            if (!matchagainst.includes(letter)) firstmismatch += letter;
        });
    }
    if (input[7].split('').includes(fmatch) && input[7].split('').includes(smatch)) {
        input[7].split('').forEach(letter => {
            if (!matchagainst.includes(letter)) secondmismatch += letter;
        });
    }
    if (input[8].split('').includes(fmatch) && input[8].split('').includes(smatch)) {
        input[8].split('').forEach(letter => {
            if (!matchagainst.includes(letter)) thirdmismatch += letter;
        });
    }

    seventh = (firstmismatch.length < 2 ? firstmismatch : (secondmismatch.length < 2 ? secondmismatch : thirdmismatch));

    //Solve fifth
    input[9].split('').forEach(letter => {
        if (!(input[2] + first + seventh).includes(letter)) fifth = letter;
    });

    //Solve sixth
    let firstm = '';
    let secondm = '';
    let thirdm = '';

    const match = input[0].split('');

    input[6].split('').forEach(letter => {
        if (match.includes(letter)) firstm += letter;
    });
    input[7].split('').forEach(letter => {
        if (match.includes(letter)) secondm += letter;
    });
    input[8].split('').forEach(letter => {
        if (match.includes(letter)) thirdm += letter;
    });

    sixth = (firstm.length < 2 ? firstm : (secondm.length < 2 ? secondm : thirdm));

    //Solve third
    input[0].split('').forEach(letter => {
        if (!(first + second + fourth + fifth + sixth + seventh).split('').includes(letter)) third = letter;
    });

    let outputDisplay = '';

    output.forEach(out => {
        if (out.length === 2) {
            outputDisplay += '1';
        } else if (out.length === 3) {
            outputDisplay += '7';
        } else if (out.length === 4) {
            outputDisplay += '4';
        } else if (out.length === 7) {
            outputDisplay += '8';
        } else if (out.length === 5) {
            if (!out.split('').includes(sixth)) {
                outputDisplay += '2';
            } else if (!out.split('').includes(second)) {
                outputDisplay += '3';
            } else {
                outputDisplay += '5';
            }
        } else if (out.length === 6) {
            if (!out.split('').includes(fourth)) {
                outputDisplay += '0';
            } else if (!out.split('').includes(third)) {
                outputDisplay += '6';
            } else {
                outputDisplay += '9';
            }
        }
    });

//     console.log(` ${first}${first}${first}${first}
// ${second}    ${third}
// ${second}    ${third}
//  ${fourth}${fourth}${fourth}${fourth}
// ${fifth}    ${sixth}
// ${fifth}    ${sixth}
//  ${seventh}${seventh}${seventh}${seventh}`);

    totalsum += +outputDisplay;
}
console.log({totalsum});