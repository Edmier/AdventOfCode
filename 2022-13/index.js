const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split('\n\n');
const packets = array.map((row) => row.split('\n').map((l) => eval(l)));

let indicies = 0;
for (let p = 0; p < packets.length; p++) {
	const [ left, right ] = packets[p];

	if (compare(left, right) === -1) {
		//console.log(`    - Correct order`);
		indicies += p + 1;
	} else {
		//console.log(`    - Incorrect order`);
	}
}

console.log({indicies});

const allPackets = fs.readFileSync('input.txt').toString().split('\n').filter((l) => l !== '').map((row) => eval(row.trim()));

const dividerA = [[2]];
const dividerB = [[6]];
allPackets.push(dividerA);
allPackets.push(dividerB);

allPackets.sort(compare);
console.log('Decoder Key:', (allPackets.indexOf(dividerA) + 1) * (allPackets.indexOf(dividerB) + 1));


function compare(left, right) {
	//console.log(`    - Compare`, left, 'vs', right);

	if (left === undefined) return -1;
	if (right === undefined) return 1;

	if (typeof left === 'number' && typeof right === 'number') {
		if (left === right) return 0;
		return left > right ? 1 : -1;
	}

	left = Array.isArray(left) ? left : [left];
	right = Array.isArray(right) ? right : [right];

	for (let i = 0; i < left.length; i++) {
		const result = compare(left[i], right[i]);
		if (result !== 0) return result;
	}

	return right.length > left.length ? -1 : 0;
}