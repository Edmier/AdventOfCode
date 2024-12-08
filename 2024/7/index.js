const array = require('fs').readFileSync(__dirname + '/' + 'input.txt').toString().split("\n");

const cases = [];
const cases2 = [];

for (let i = 0; i < array.length; i++) {
    const [result, ...rest] = array[i].trim().split(' ');
    cases.push({ result: +result.slice(0, -1), nodes: { 0: rest.map(r =>  [ +r ]) } });
    cases2.push({ result: +result.slice(0, -1), nodes: { 0: rest.map(r =>  [ +r ]) } });
}

const Operators = {
    Add: 0,
    Multiply: 1,
    Concat: 2
};

let part1 = 0;

const ops = [ Operators.Add, Operators.Multiply ];
for (const { result, nodes } of cases) {
    for (let i = 1; i < nodes[0].length; i++) {
        if (calculateLevel(nodes, i, result, ops)) {
            part1 += result;
            break;
        }
    }
}

console.log({ part1 });

let part2 = 0;
const ms = Date.now();
const ops2 = [ Operators.Add, Operators.Multiply, Operators.Concat ];
for (const { result, nodes } of cases2) {
    for (let i = 1; i < nodes[0].length; i++) {
        if (calculateLevel(nodes, i, result, ops2)) {
            part2 += result;
            break;
        }
    }
}
console.log({ part2, ms: Date.now() - ms });

function calculateLevel(nodes, level, target, operators) {
    if (nodes[level - 1].length === 1) {
        return nodes[level - 1][0][0] === target;
    }

    const leaves = [];

    const left = nodes[level - 1][0];
    const right = nodes[level - 1][1];

    for (const l of left) {
        for (const r of right) {
            for (const op of operators) {
                const result = calculate(op, +l, +r);
                leaves.push(result);

                if (result === target) {
                    return true;
                }
            }
        }
    }

    nodes[level] ??= [];
    nodes[level].push(leaves);
    nodes[level].push(...nodes[level - 1].slice(2));

    return false;
}

function calculate(operator, a, b) {
    switch (operator) {
        case Operators.Add: return a + b;
        case Operators.Multiply: return a * b;
        case Operators.Concat: return +`${a}${b}`;
    }
}