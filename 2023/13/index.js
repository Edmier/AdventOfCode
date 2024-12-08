const inputRows = require('fs').readFileSync('input.txt').toString().split('\r\n');

const grids = [];
let currentGrid = [];
inputRows.map(l => l.trim()).forEach((line) => {
	if (!line) {
		grids.push(currentGrid.slice());
		currentGrid = [];
		return;
	}

	currentGrid.push(line.split(''));
});
grids.push(currentGrid.slice());


const getRow = memoize((grid, y) => {
	return grid[y]?.join('') ?? '';
});

const getColumn = memoize((grid, x) => {
	let column = '';
	for (const row of grid) {
		column += row[x] ?? '';
	}
	return column;
});

const findRepeatedColumns = memoize((grid, start = 0, smudges = 0) => {
	let previousColumn = getColumn(grid, start); 
	let nextColumn = getColumn(grid, start + 1);

	if (!nextColumn) return [];
	const diffs = differences(previousColumn, nextColumn);
	if (diffs > 1) return findRepeatedColumns(grid, start + 1, smudges);

	if (diffs === 1) {
		if (smudges === 0) return findRepeatedColumns(grid, start + 1, smudges);
		smudges = 0;
	}

	return [ start, ...findRepeatedColumns(grid, start + 1, smudges) ];
});

const findRepeatedRows = memoize((grid, start = 0, smudges = 0) => {
	let previousColumn = getRow(grid, start); 
	let nextColumn = getRow(grid, start + 1);

	if (!nextColumn) return [];
	const diffs = differences(previousColumn, nextColumn);
	if (diffs > 1) return findRepeatedRows(grid, start + 1, smudges);

	if (diffs === 1) {
		if (smudges === 0) return findRepeatedRows(grid, start + 1, smudges);
		smudges = 0;
	}

	return [ start, ...findRepeatedRows(grid, start + 1, smudges) ];
});

const isMirroredColumn = memoize((grid, leftX, gap = 1) => {
	const column = getColumn(grid, leftX);
	const next = getColumn(grid, leftX + gap);

	if (!column || !next) return gap !== 1;
	if (column !== next) return false;

	return isMirroredColumn(grid, leftX - 1, gap + 2);
});

const isMirroredRow = memoize((grid, leftY, gap = 1) => {
	const column = getRow(grid, leftY);
	const next = getRow(grid, leftY + gap);

	if (!column || !next) return gap !== 1;
	if (column !== next) return false;

	return isMirroredRow(grid, leftY - 1, gap + 2);
});

const isMirroredColumnWithOneSmudge = memoize((grid, leftX, gap = 1, found = undefined) => {
	const column = getColumn(grid, leftX);
	const next = getColumn(grid, leftX + gap);

	if (!column || !next) {
		if (gap === 1) return null;

		return found ?? null;
	}

	const diffs = differences(column, next);
	if (diffs > 1) return null;

	if (diffs === 1) {
		if (found) return null;

		// get x and y of smudge
		for (let i = 0; i < column.length; i++) {
			if (column[i] !== next[i]) {
				found = { x: leftX, y: i };
				break;
			}
		}

		return isMirroredColumnWithOneSmudge(grid, leftX - 1, gap + 2, found);
	}

	return isMirroredColumnWithOneSmudge(grid, leftX - 1, gap + 2, found);
});

const isMirroredRowWithOneSmudge = memoize((grid, leftY, gap = 1, found = undefined) => {
	const row = getRow(grid, leftY);
	const next = getRow(grid, leftY + gap);

	if (!row || !next) {
		if (gap === 1) return null;

		return found ?? null;
	}

	const diffs = differences(row, next);
	if (diffs > 1) return null;

	if (diffs === 1) {
		if (found) return null;

		// get x and y of smudge
		for (let i = 0; i < row.length; i++) {
			if (row[i] !== next[i]) {
				found = { y: leftY, x: i };
				break;
			}
		}
		// console.log('found', found);
		return isMirroredRowWithOneSmudge(grid, leftY - 1, gap + 2, found);
	}

	return isMirroredRowWithOneSmudge(grid, leftY - 1, gap + 2, found);
});

const differences = memoize((line1, line2) => {
	let diff = 0;
	for (let i = 0; i < line1.length; i++) {
		if (line1[i] !== line2[i]) diff++;
	}
	return diff;
});

const fixSmudge = memoize((grid) => {
	const failingRepeatedColumns = findRepeatedColumns(grid, 0, 1).filter(c => !isMirroredColumn(grid, c));
	const failingRepeatedRows = findRepeatedRows(grid, 0, 1).filter(c => !isMirroredRow(grid, c));

	if (failingRepeatedColumns.length === 1) {
		const column = failingRepeatedColumns[0];
		const smudge = isMirroredColumnWithOneSmudge(grid, column);

		if (smudge) {
			console.log('fiXy', smudge);

			grid[smudge.y][smudge.x] = grid[smudge.y][smudge.x] === '#' ? '.' : '#';
			return;
		}
	};

	if (failingRepeatedRows.length === 1) {
		const row = failingRepeatedRows[0];
		const smudge = isMirroredRowWithOneSmudge(grid, row);

		if (smudge) {
			console.log('fixY', smudge);
			grid[smudge.y][smudge.x] = grid[smudge.y][smudge.x] === '#' ? '.' : '#';
			return;
		}
	};
});

let part1 = 0;
for (const grid of grids) {
	const repeatedColumns = findRepeatedColumns(grid).filter(c => isMirroredColumn(grid, c));
	const repeatedRows = findRepeatedRows(grid).filter(c => isMirroredRow(grid, c));

	console.log('repeatedColumns', findRepeatedColumns(grid));
	console.log('repeatedRows', findRepeatedRows(grid));

	for (const column of repeatedColumns) {
		part1 += column + 1;
	}

	for (const row of repeatedRows) {
		part1 += (row + 1) * 100;
	}
}

console.log('part1', part1);



let part2 = 0;
for (const grid of grids) {
	const repeatedColumns = findRepeatedColumns(grid).filter(c => isMirroredColumn(grid, c));
	const repeatedRows = findRepeatedRows(grid).filter(c => isMirroredRow(grid, c));

	// console.log('before');
	// printGrid(grid);
	fixSmudge(grid);
	// console.log('after');
	// printGrid(grid);

	const fixedColumns = findRepeatedColumns(grid).filter(c => isMirroredColumn(grid, c));
	const fixedRows = findRepeatedRows(grid).filter(c => isMirroredRow(grid, c));

	// Find the difference between the fixed and the original
	const diffColumns = fixedColumns.filter(c => !repeatedColumns.includes(c));
	const diffRows = fixedRows.filter(c => !repeatedRows.includes(c));

	// console.log('repeatedColumns', repeatedColumns);
	// console.log('repeatedRows', repeatedRows);
	// console.log('fixedColumns', fixedColumns);
	// console.log('fixedRows', fixedRows);
	// console.log('diffColumns', diffColumns);
	// console.log('diffRows', diffRows);

	for (const column of diffColumns) {
		// console.log('column', column);
		part2 += column + 1;
	}

	for (const row of diffRows) {
		// console.log('row', row);
		part2 += (row + 1) * 100;
	}

	// console.log('repeatedColumns', repeatedColumns);
	// console.log('repeatedRows', repeatedRows);
}

console.log('summary', part2);



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

function printGrid(grid) {
	for (const row of grid) {
		console.log(row.join(''));
	}
	console.log();
}