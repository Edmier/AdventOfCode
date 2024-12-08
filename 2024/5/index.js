const array = require('fs').readFileSync(__dirname + '/' + 'input.txt').toString().split("\n");

const rules = [];
const updates = [];

for (let i = 0; i < array.length; i++) {
    const line = array[i].trim();
    if (line === '') continue;

    if (line.includes('|')) {
        rules.push(line.split('|').map(Number));
        continue;
    } 

    updates.push(line.split(',').map(Number));
}

let part1 = 0;
let part2 = 0;

const isCorrectlyOrdered = memoize(correctlyOrdered);

for (const update of updates) {
    if (isLineOrdered(update)) {
        part1 += update[Math.floor(update.length / 2)]
    } else {
        update.sort((a, b) => order(a, b));
        part2 += update[Math.floor(update.length / 2)];
    }
}

console.log({ part1 });
console.log({ part2 });

function correctlyOrdered(num1, num2) {
    return order(num1, num2) >= 0;
};

function order(num1, num2) {
    if (num1 === num2) return 0;

    for (const rule of rules) {
        if (!rule.includes(num1) || !rule.includes(num2)) continue;
        
        if (rule[0] === num1 && rule[1] === num2) {
            continue;
        }

        return -1;
    }

    return 1;
}

function isLineOrdered(line) {
    for (let i = 0; i < line.length - 1; i++) {
        for (let j = i + 1; j < line.length; j++) {
            if (!isCorrectlyOrdered(line[i], line[j])) {
                return false;
            }
        }
    }

    return true;
}

function memoize(func) {
	const stored = new Map();
	return (...args) => {
		const k = JSON.stringify(args);

		if (stored.has(k)) {
			return stored.get(k);
		}

		const result = func(...args);
		stored.set(k, result);
		return result;
	};
}
