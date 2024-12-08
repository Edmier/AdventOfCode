const input = require('fs').readFileSync('input.txt').toString().split('\n');

const isValidPermutation = memoize((input, guess, offset) => {
	// console.log('input', input, offset);
	// Check that the guess doesn't interfere with the input
	for (let i = offset; i < guess.length; i++) {
		const inputChar = input[i];
		const guessChar = guess[i];

		// console.log('input', inputChar, guessChar, 'guess');

		if (inputChar === guessChar) continue;
		if (inputChar === '#' && guessChar !== inputChar) {
			return false;
		}

		if (inputChar === '.' && guess[i] === '#') return false;
	}

	return true;
});

const doubleCheck = memoize((input, guess) => {
	for (let i = 0; i < input.length; i++) {
		const inputChar = input[i];
		const guessChar = guess[i];

		if (inputChar === '#' && guessChar !== inputChar) {
			return false;
		}

		if (inputChar === '.' && guess[i] === '#') return false;
	}

	return true;
});

const remaining = memoize((i, inserts, maxLength) => {
	const remaining = inserts.slice(i + 1);
	return (
		maxLength -
		remaining.reduce((acc, cur) => acc + cur.length, remaining.length)
	);
});


// Adapted from https://gist.github.com/Nathan-Fenner/781285b77244f06cf3248a04869e7161
const countPermutations = memoize((line, groups) => {
	// Ending condition
	if (line.length === 0) {
		// If not all groups are used, return 0 for invalid
		return groups.length === 0 ? 1 : 0;
	}

	// Ran out of groups, make sure there are no remaining #
	if (groups.length === 0) {
		for (let i = 0; i < line.length; i++) {
			if (line[i] === '#') {
				return 0;
			}
		}
		// All # have been accounted for
		return 1;
	}

	// The line is not long enough for all runs
	if (line.length < groups.reduce((a, b) => a + b, 0) + groups.length - 1) {
		return 0;
	}

	// Starting . can be ignored
	if (line[0] === '.') {
		return countPermutations(line.slice(1), groups);
	}

	// Look to see if any of the groups fit
	if (line[0] === '#') {
		const [ group, ...leftover ] = groups;

		// If the first group is interrupted by a ., return 0
		for (let i = 0; i < group; i++) {
			if (line[i] === '.') {
				return 0;
			}
		}

		// If there's a # after the group, return 0 (group doesn't fit)
		if (line[group] === '#') {
			return 0;
		}

		// Continue recursively
		return countPermutations(line.slice(group + 1), leftover);
	}
	
	// Check both possibilities
	return (
		countPermutations('#' + line.slice(1), groups) +
		countPermutations('.' + line.slice(1), groups)
	);
});


console.log('part1', input.map((line) => {
	const [springs, conditions] = line.split(' ');
	const groups = conditions.split(',').map((g) => +g);

	return possiblePermutations(springs, groups);
}).reduce((acc, cur) => acc + cur, 0));


console.log('part2', input.map((line, i) => {
	const [springs, conditions] = line.split(' ');
	const groups = conditions.split(',').map((g) => +g);

	const fivesprings = springs + '?' + springs + '?' + springs + '?' + springs + '?' + springs;
	const fivegroups = [ ...groups, ...groups, ...groups, ...groups, ...groups, ];

	return countPermutations(fivesprings, fivegroups);
}).reduce((acc, cur) => acc + cur, 0));

/*
springs | groups
?###???????? 3,2,1

permutations
.###.##.#...
.###.##..#..
.###.##...#.
.###.##....#
.###..##.#..
.###..##..#.
.###..##...#
.###...##.#.
.###...##..#
.###....##.#
*/
function possiblePermutations(springs, groups) {
	if (!springs.includes('?')) {
		return [springs];
	}
	let permCount = 0;
	//const permutations = [];
	const maxLength = springs.length;

	const inserts = groups.map((g) => '#'.repeat(g));
	const possiblePositions = {};
	const minPositions = {};

	for (let i = 0; i < inserts.length; i++) {
		const insert = inserts[i];
		minPositions[i] = Infinity;

		let startIndex = 0;
		if (i > 0) {
			// console.log('possiblePositions[i - 1]', possiblePositions[i - 1]);
			startIndex = minPositions[i - 1] + inserts[i - 1].length;
		}
		const furthestIndex = remaining(i, inserts, maxLength);
		const possible = [];

		// console.log('insert', insert, i);
		// console.log('startIndex', startIndex);
		// console.log('maxLength', maxLength);
		// console.log('furthestIndex', furthestIndex);

		for (let j = startIndex; j <= furthestIndex; j++) {
			if (maxLength - j - insert.length < 0) continue;

			let test = '?'.repeat(j) + insert;
			if (maxLength > test.length) {
				test += '?';
			}

			const valid = isValidPermutation(springs, test, Math.max(0, j - 1));
			// console.log('test', test, valid);
			if (valid) {
				minPositions[i] = Math.min(j, minPositions[i]);
				possible.push(j);
			}
		}

		possiblePositions[i] = possible;
	}

	const possibleSegments = {};

	const segments = Object.entries(possiblePositions);
	const steps = {};

	for (let i = 0; i < segments.length; i++) {
		const [key, value] = segments[i];
		const insert = inserts[key];

		if (i === 0) {
			steps[i] ??= value.map((v) => '.'.repeat(v) + insert);
			continue;
		}

		const isLast = i === segments.length - 1;

		const previous = steps[i - 1].slice();
		steps[i] = [];

		for (const prev of previous) {
			for (const position of value) {
				const diff = position - prev.length;
				if (diff <= 0) continue;

				const test = '.'.repeat(position - prev.length) + insert;
				const step = prev + test;

				if (isLast) {
					const diff = maxLength - step.length;
					if (diff < 0) continue;

					const value2 = step + '.'.repeat(diff);
					if (doubleCheck(springs, value2)) {
						permCount++;
					}
				} else {
					steps[i].push(step);
				}
			}
		}

		possibleSegments[key] = '';
	}

	// console.log('possiblePositions', possiblePositions);
	// console.log('possibleSegments', permutations);

	return permCount; //permutations.filter(p => doubleCheck(springs, p));
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
