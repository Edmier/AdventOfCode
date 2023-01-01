const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split('\n');

const grid = new Map();

let minX = undefined;
let maxX = undefined; 
let minY = undefined;
let maxY = undefined;

for (const path of array) {
	const points = path.split(' -> ').map((point) => point.split(',').map((num) => parseInt(num)));

	for (let i = 0; i < points.length - 1; i++) {
		const [ x1, y1 ] = points[i];
		const [ x2, y2 ] = points[i + 1];

		minX = Math.min(x1, x2, minX ?? x1);
		maxX = Math.max(x1, x2, maxX ?? x1);
		minY = Math.min(y1, y2, minY ?? y1);
		maxY = Math.max(y1, y2, maxY ?? y1);

		const x = Math.min(x1, x2);
		const y = Math.min(y1, y2);

		for (let j = x; j <= Math.max(x1, x2); j++) {
			for (let k = y; k <= Math.max(y1, y2); k++) {
				const key = `${j},${k}`;
				if (!grid.has(key)) {
					grid.set(key, '#');
				}
			}
		}
	}
}

console.log(grid.size);

function printGrid() {
	for (let i = 0; i <= maxY + 2; i++) {
		let str = '';
		for (let j = minX - 2; j <= maxX + 2; j++) {
			str += '' + (grid.get(`${j},${i}`) || ' ') + '';
		}
		console.log(str);
	}
}

const sandSpawn = [ 500, 0 ];

function spawnSand(x, y) {
	while (!grid.get(`${x},${y + 1}`)) {
		y++;
		if (y > maxY + 3) {
			return false;
		}
	}

	const left = grid.get(`${x - 1},${y + 1}`);
	const right = grid.get(`${x + 1},${y + 1}`);

	//console.log('Spawn', x, y, left, right);
	if (left && right) {
		grid.set(`${x},${y}`, 'o');
		//console.log('Set', x, y);
	} else if (left) {
		return spawnSand(x + 1, y);
	} else if (right || !left) {
		return spawnSand(x - 1, y);
	}


	return true;
}

for (let i = 0; i < 10000000; i++) {
	if (!spawnSand(...sandSpawn)) {
		console.log('Done', i);
		break;
	}
}
// printGrid();

// Make floor for part 2
for (let x = minX - 100000; x <= maxX + 100000; x++) {
	grid.set(`${x},${maxY + 2}`, '#');
}

// Clear sand
//! BROKEN
for (let x = minX - 20; x <= maxX + 20; x++) {
	for (let y = minY - 2; y <= maxY + 2; y++) {
		if (grid.get(`${x},${y}`) === 'o') {
			grid.set(`${x},${y}`, undefined);
		}
	}
}

minX -= 48;
maxX += 48;
maxX += 2;

for (let i = 0; i < 1000000; i++) {
	if (grid.get(`${sandSpawn[0]},${sandSpawn[1]}`) === 'o') {
		//grid.set(`${sandSpawn[0]},${sandSpawn[1]}`, '+');
		printGrid();
		console.log('Plugged', i);
		break;
	}
	spawnSand(...sandSpawn)
}