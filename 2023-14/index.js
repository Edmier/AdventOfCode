const inputRows = require('fs').readFileSync('input.txt').toString().split('\r\n');

const getColumn = memoize((grid, x) => {
	let column = '';
	for (const row of grid) {
		column += row[x] ?? '';
	}
	return column;
});

const getRow = memoize((grid, y) => {
	return grid[y]?.join('') ?? '';
});

const splitBoulders = memoize((line) => line.split('#'));

const grid = inputRows.map(l => l.trim()).map(l => l.split(''));

const boulders = memoize((line) => line.split('').filter(c => c === 'O').length);

const tiltNorth = memoize((line) => {
	if (line.length === 1) return line;

	const count = boulders(line);
	return 'O'.repeat(count) + '.'.repeat(line.length - count);
});

const tiltSouth = memoize((line) => {
	if (line.length === 1) return line;

	const count = boulders(line);
	return '.'.repeat(line.length - count) + 'O'.repeat(count);
});

const tiltGrid = () => {
	const newGrid = Array.from({ length: grid.length }, () => []);

	for (let i = 0; i < grid[0].length; i++) {
		const column = getColumn(grid, i);
		const shifted = splitBoulders(column).map(tiltNorth).join('#');

		for (let j = 0; j < grid.length; j++) {
			newGrid[j][i] = shifted[j];
		}
	}

	return newGrid;
}

const gridTiltNorth = memoize((grid) => {
	for (let i = 0; i < grid[0].length; i++) {
		const column = getColumn(grid, i);
		const shifted = splitBoulders(column).map(tiltNorth).join('#');

		for (let j = 0; j < grid.length; j++) {
			grid[j][i] = shifted[j];
		}
	}
});

const gridTiltSouth = memoize((grid) => {
	for (let i = 0; i < grid[0].length; i++) {
		const column = getColumn(grid, i);
		const shifted = splitBoulders(column).map(tiltNorth).join('#');

		for (let j = 0; j < grid.length; j++) {
			grid[j][i] = shifted[j];
		}
	}
});

const gridTiltEast = memoize((grid) => {
	for (let i = 0; i < grid.length; i++) {
		const row = getRow(grid, i);
		const shifted = splitBoulders(row).map(tiltSouth).join('#');
		grid[i] = shifted.split('');
	}
});

const gridTiltWest = memoize((grid) => {
	for (let i = 0; i < grid.length; i++) {
		const row = getRow(grid, i);
		const shifted = splitBoulders(row).map(tiltNorth).join('#');
		grid[i] = shifted.split('');
	}
});

const spinGrid = memoize((grid) => {
	gridTiltNorth(grid);
	gridTiltWest(grid);
	gridTiltSouth(grid);
	gridTiltEast(grid);

	return grid;
});

const countLoad = memoize((line, value) => {
	return line.split('').filter(c => c === 'O').length * value;
})

const countFullLoad = (grid) => {
	let load = 0;
	for (let row = 0; row < grid.length; row++) {
		const line = getRow(grid, row);
		// console.log(line);
		load += countLoad(line, grid.length - row);
	}
	return load;	
}

console.log('part1', countFullLoad(tiltGrid()));


const startTime = Date.now();

let newGrid = grid;
for (let i = 0; i < 3; i++) {
	newGrid = spinGrid(newGrid);

	if (i % 10000 === 0) {
		// Print eta every 10k iterations
		const elapsed = Date.now() - startTime;
		const eta = (elapsed / i) * (1000000000 - i);
		console.log('eta', eta / 1000 / 60, 'minutes');
	}
}

// console.log(newGrid.map(l => l.join('')).join('\n'));

console.log('part2', countFullLoad(newGrid));


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