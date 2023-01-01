const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split('\n');

let startPos = null;
let endPos = null;
const grid = array.map((row, y) => row.split('').map((char, x) => {
	
	if (char === 'S') {
		startPos = { x, y };
		return 'a';
	} else if (char === 'E') {
		endPos = { x, y };
		return 'z';
	}

	return char;//'abcdefghijklmnopqrstuvwxyz'.indexOf(char);
}));

console.log(startPos, endPos);

const graph = new Map();

class Node {
	constructor(x, y, value) {
		this.x = x;
		this.y = y;
		this.value = value;
		this.edges = [];
	}
}

for (let y = 0; y < grid.length; y++) {
	for (let x = 0; x < grid[0].length; x++) {
		const node = new Node(x, y, grid[y][x]);
		graph.set(`${x},${y}`, node);
	}
}

for (let y = 0; y < grid.length; y++) {
	for (let x = 0; x < grid[0].length; x++) {
		const node = graph.get(`${x},${y}`);
		const edges = [
			graph.get(`${x + 1},${y}`),
			graph.get(`${x - 1},${y}`),
			graph.get(`${x},${y + 1}`),
			graph.get(`${x},${y - 1}`),
		].filter((n) => {
			if (!n) return false; 
			return Math.abs('abcdefghijklmnopqrstuvwxyz'.indexOf(node.value) - 'abcdefghijklmnopqrstuvwxyz'.indexOf(n.value)) <= 1 || n.value < node.value;
		});

		node.edges = edges;
	}
}

// Print graph visually with edge connections shown by a arrow pointing to the node
for (let y = 0; y < grid.length; y++) {
	let row = '';
	let row2 = '';
	let row3 = '';

	for (let x = 0; x < grid[0].length; x++) {
		const node = graph.get(`${x},${y}`);

		row += node.edges.includes(graph.get(`${x},${y - 1}`)) ? ' | ' : '   ';
		row2 += node.edges.includes(graph.get(`${x - 1},${y}`)) ? '-' : ' ';
		row2 += node.value === -1 ? '+' : node.value;
		row2 += node.edges.includes(graph.get(`${x + 1},${y}`)) ? '-' : ' ';
		row3 += node.edges.includes(graph.get(`${x},${y + 1}`)) ? ' | ' : '   ';
	}

	console.log(`${row}\n${row2}\n${row3}`);
}

// DJIKSTRA'S ALGORITHM to find shortest path
function djikstra(start, end) {
	const distances = new Map();
	const previous = new Map();
	const queue = new PriorityQueue();

	for (const node of graph.values()) {
		distances.set(node, Infinity);
		previous.set(node, null);
	}

	distances.set(start, 0);
	queue.enqueue(start, 0);

	while (!queue.isEmpty()) {
		const smallest = queue.dequeue();

		if (smallest === end) {
			const path = [];
			let current = smallest;
			
			while (current) {
				path.push(current);
				current = previous.get(current);
			}

			return path.reverse();
		}

		if (smallest || distances.get(smallest) !== Infinity) {
			for (const neighbor of smallest.edges) {
				const alt = distances.get(smallest) + 1;

				if (alt < distances.get(neighbor)) {
					distances.set(neighbor, alt);
					previous.set(neighbor, smallest);
					queue.enqueue(neighbor, alt);

					//console.log(neighbor.value);
				}
			}
		}
	}

	return null;
}

class PriorityQueue {
	constructor() {
		this.queue = [];
	}

	enqueue(node, priority) {
		this.queue.push({ node, priority });
		this.queue.sort((a, b) => a.priority - b.priority);
	}

	dequeue() {
		return this.queue.shift().node;
	}

	isEmpty() {
		return this.queue.length === 0;
	}
}

const start = graph.get(`${startPos.x},${startPos.y}`);
const end = graph.get(`${endPos.x},${endPos.y}`);
console.log(start, end);
const path = djikstra(start, end);
console.log(path.map((n) => n.value));
console.log(path.map((n) => n.value).length);

let lowestStart = startPos;
let lowestLength = Infinity;

for (let y = 0; y < grid.length; y++) {
	for (let x = 0; x < grid[0].length; x++) {
		const start = graph.get(`${x},${y}`);
		if (start.value !== 'a') continue;

		const path = djikstra(start, end);
		if (path && path.length < lowestLength) {
			lowestStart = start;
			lowestLength = path.length;
		}
	}
}

console.log(lowestStart, lowestLength);