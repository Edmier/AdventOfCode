const fs = require('fs');

const [ stacksRaw, steps ] = fs.readFileSync('input.txt').toString().split('\r\n\r\n');

let stacks = [[]];

const stackLines = stacksRaw.split('\r\n');

for (let i = stackLines.length - 2; i >= 0; i--) {
    const line = stackLines[i];
    
    for (let j = 0; j < line.length; j++) {
        const char = line[j].trim();
        if (' []'.includes(char)) continue;
        if (!stacks[j]) stacks[j] = [];
        stacks[j].push(line[j]);
    }
}
stacks = stacks.filter(s => s.length > 0);

const bulkStacks = stacks.slice();

// console.log(stacks, stacks.length);

// for (const step of steps.split('\r\n')) {
//     const [ amount, from, to ] = step.replace('move ', '').replace(' from ', '.').replace(' to ', '.').trim().split('.').map(s => parseInt(s.trim()));

//     try {
//         const fromStack = stacks[from - 1];
//         const toStack = stacks[to - 1];
    
//         for (let i = 0; i < amount; i++) {
//             if (fromStack.length === 0) break;
//             toStack.push(fromStack.pop());
//         }
//     } catch (e) {
//         console.log(step);
//         console.log(amount, from, to);
//         console.log(e);
//     }
// }

// console.log(stacks);

//console.log('Top Of Each: ' + stacks.map(s => s.pop()).join(''));
console.log(bulkStacks);
for (const step of steps.split('\r\n')) {
    const [ amount, from, to ] = step.replace('move ', '').replace(' from ', '.').replace(' to ', '.').trim().split('.').map(s => parseInt(s.trim()));

    try {
        const fromStack = bulkStacks[from - 1];
        const toStack = bulkStacks[to - 1];

        bulkStacks[to - 1] = toStack.concat(fromStack.splice(fromStack.length - amount));
    } catch (e) {
        console.log(step);
        console.log(amount, from, to);
        console.log(e);
    }
}

console.log(bulkStacks);

console.log('Top Of Bulk: ' + bulkStacks.map(s => s.pop()).join(''));