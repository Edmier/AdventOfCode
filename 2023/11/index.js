const input = require('fs').readFileSync('input.txt').toString().split('\n');

class Node {
	constructor(x, y, value) {
		this.startX = x;
		this.startY = y;
		this.x = x;
		this.y = y;
		this.value = value;
	}

	get edges() {
		if (this._edges) return this._edges;

		const edges = [
			getNode(this.x + 1, this.y),
			getNode(this.x - 1, this.y),
			getNode(this.x, this.y + 1),
			getNode(this.x, this.y - 1),
		].filter(n => n);

		this._edges = edges;
		return edges;
	}

	shiftX(originX, amount = 1) {
		if (this.startX > originX) {
			this.x += amount;
		}
	}

	shiftY(originY, amount = 1) {
		if (this.startY > originY) {
			this.y += amount;
		}
	}
}

const lines = input.map(line => line.split(''));

function addNode(x, y, value) {
	graph.set(`${x},${y}`, new Node(x, y, value));
}

function getNode(x, y) {
	return graph.get(`${x},${y}`);
}

let graph = new Map();
let galaxies = [];

function setUp(expansion = 1) {
	galaxies = [];
	graph = new Map();

	for (let row = 0; row < lines.length; row++) {
		for (let col = 0; col < lines[0].length; col++) {
			if (lines[row][col] === '#') {
				const node = new Node(col, row, galaxies.length + 1)
				galaxies.push(node);
				graph.set(`${col},${row}`, node);
			} else {
				addNode(col, row, lines[row][col]);
			}
		}
	}
	
	for (let row = 0; row < lines.length; row++) {
		if (galaxies.some(galaxy => +galaxy.startY === row)) continue;
	
		galaxies.forEach(galaxy => galaxy.shiftY(row, expansion));
	}
	
	for (let col = 0; col < lines[0].length; col++) {
		if (galaxies.some(galaxy => +galaxy.startX === col)) continue;
		
		galaxies.forEach(galaxy => galaxy.shiftX(col, expansion));
	}	
}

function getPathLengths(expansion = 1) {
	setUp(expansion);

	let pathLengths = 0;
	const visited = new Set();
	for (const galaxy of galaxies) {
		for (const otherGalaxy of galaxies) {
			if (otherGalaxy.value === galaxy.value) continue;

			const ids = [galaxy.value, otherGalaxy.value].sort((a, b) => a - b);
			if (visited.has(ids.join(','))) continue;
			visited.add(ids.join(','));

			const x1 = galaxy.x;
			const y1 = galaxy.y;
			const x2 = otherGalaxy.x;
			const y2 = otherGalaxy.y;

			const xDiff = Math.abs(x1 - x2);
			const yDiff = Math.abs(y1 - y2);

			pathLengths += xDiff + yDiff;
		}
	}

	return pathLengths;
}

console.log('part1', getPathLengths());
console.log('part2', getPathLengths(999_999));