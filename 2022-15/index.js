const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split('\n');

class Sensor {
	constructor(x, y, beacon) {
		this.x = x;
		this.y = y;
		this.beacon = beacon;
	}

	withinRadius(x, y) {
		return Math.abs(this.x - x) + Math.abs(this.y - y) <= this.beacon;
	}
}
const sensors = [];

const grid = new Map();

for (const line of array) {
	const [ sens, beac ] = line.replace('Sensor at ', '').replace(' closest beacon is at ', '').split(':');

	const s = sens.split(', ');
	const sensor = { x: parseInt(s[0].substring(2)), y: parseInt(s[1].substring(2)) };
	const b = beac.split(', ');
	const beacon = { x: parseInt(b[0].substring(2)), y: parseInt(b[1].substring(2)) };

	grid.set(`${sensor.x},${sensor.y}`, "S");
	grid.set(`${beacon.x},${beacon.y}`, "B");

	const taxicab = Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y);
	sensors.push(new Sensor(sensor.x, sensor.y, taxicab));
}

let minX = Math.min(...Array.from(grid.keys()).map((key) => parseInt(key.split(',')[0])));
let maxX = Math.max(...Array.from(grid.keys()).map((key) => parseInt(key.split(',')[0])));

let y = 2000000;
let count = 0;
for (let x = minX * 2; x < maxX * 2; x++) {
	if (sensors.some((sensor) => sensor.withinRadius(x, y)) && !grid.get(`${x},${y}`)) {
		count++;
	}
}

console.log({ count });

for (const sensor of sensors) {
	// Get list of points that border the sensor radius using the taxicab distance
	// The formula for the unit circle in taxicab geometry is |x|+|y| = 1
	const points = [];
	const taxicab = sensor.beacon;

	let y = sensor.y;
	let x = sensor.x - taxicab - 1;
	for (;y <= sensor.y + taxicab + 1;) {
		points.push({ x, y });
		points.push({ x: x + taxicab + 1, y: y - taxicab - 1 });
		y++;
		x++;
	}

	y = sensor.y;
	x = sensor.x + taxicab + 1;
	for (;y <= sensor.y + taxicab + 1;) {
		points.push({ x, y });
		points.push({ x: x - taxicab - 1, y: y - taxicab - 1 });
		y++;
		x--;
	}

	for (const point of points) {
		if (point.x < 0 || point.x > 4_000_000) continue;
		if (point.y < 0 || point.y > 4_000_000) continue;
		if (!sensors.some((sensor) => sensor.withinRadius(point.x, point.y))) {
			console.log({ point }, point.x * 4000000 + point.y);
			break;
		}
	}
}



function printGrid() {
	const minX = 0;//Math.min(...Array.from(grid.keys()).map((key) => parseInt(key.split(',')[0])));
	const maxX = 30;//Math.max(...Array.from(grid.keys()).map((key) => parseInt(key.split(',')[0])));
	const minY = 0;//Math.min(...Array.from(grid.keys()).map((key) => parseInt(key.split(',')[1])));
	const maxY = 20;//Math.max(...Array.from(grid.keys()).map((key) => parseInt(key.split(',')[1])));

	for (let i = minY; i <= maxY + 10; i++) {
		let str = i.toLocaleString(undefined, { minimumIntegerDigits: 2 }) + '';
		for (let j = minX - 10; j <= maxX + 10; j++) {
			str += '' + (sensors.some((sensor) => sensor.withinRadius(j, i)) ? '#' : grid.get(`${j},${i}`) || ' ') + '';
		}
		console.log(str);
	}
}

// printGrid();