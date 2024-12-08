const input = require('fs').readFileSync('input.txt').toString().split('\n');

let startNode = null;

const grid = input.map((row, y) => row.split('').map((char, x) => {
	if (char === 'S') {
		// startPos = { x, y };
	}
	return char;
}));

const graph = new Map();

const upValues = ['|', 'L', 'J', 'S'];
const downValues = ['|', '7', 'F', 'S'];
const leftValues = ['-', 'J', '7', 'S'];
const rightValues = ['-', 'L', 'F', 'S'];

class Node {
	constructor(x, y, value) {
		this.x = x;
		this.y = y;
		this.value = value;
		this.edges = [];

		this.inLoop = false;

		if (value === 'S') {
			startNode = this;
			this.inLoop = true;
		}

		this.up = upValues.includes(value);
		this.down = downValues.includes(value);
		this.left = leftValues.includes(value);
		this.right = rightValues.includes(value);
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
		const edges = [];

		if (node.up) {
			const upNode = graph.get(`${x},${y - 1}`);
			if (upNode && upNode.down) edges.push(upNode);
		} 

		if (node.down) {
			const downNode = graph.get(`${x},${y + 1}`);
			if (downNode && downNode.up) edges.push(downNode);
		}

		if (node.left) {
			const leftNode = graph.get(`${x - 1},${y}`);
			if (leftNode && leftNode.right) edges.push(leftNode);
		}

		if (node.right) {
			const rightNode = graph.get(`${x + 1},${y}`);
			if (rightNode && rightNode.left) edges.push(rightNode);
		}

		node.edges = edges;
	}
}

// Staring from the start node, go in all directions until the start node is reached again

const visited = new Set();
const queue = [ startNode ];
let steps = 1;

while (queue.length) {
	const nextQueue = [];

	for (const node of queue) {
		visited.add(node);

		for (const edge of node.edges) {
			if (visited.has(edge)) continue;
			steps++;
			edge.inLoop = true;
			nextQueue.push(edge);
		}
	}

	queue.length = 0;
	queue.push(...nextQueue);
}

const part1 = (steps - 1) / 2;
console.log({ part1 });

// Check if each ground node is within the loop
let enclosed = 0;
for (let y = 0; y < grid.length; y++) {
	for (let x = 0; x < grid[0].length; x++) {
		const node = graph.get(`${x},${y}`);
		if (node.inLoop) continue;

		if (castRay(node, 1, 0) % 2 === 0) {
			node.outside = true;
			continue;
		}

		node.surrounded = true;
		enclosed++;
	}
}

const part2 = enclosed;
console.log({ part2 });

// Count the number of walls that are intersected by a ray from the start node
function castRay(startNode, dx, dy) {
	let node = startNode;
	let walls = 0;

	while (node) {
		
		if (node.inLoop) {
			// We hit a wall, make sure it's not a ceiling or floor by getting the last node that is part of the wall
			let endNode = node;

			while (endNode.inLoop) {
				// Continue until we hit a node that is not part of the loop
				const next = graph.get(`${endNode.x + dx},${endNode.y + dy}`);
				if (!endNode.edges.includes(next)) break;
				endNode = next;
			}

			// Now we have the last node of the wall, check if it's a vertical or horizontal wall
			if (endNode === node ||
				(node.value === 'F' && endNode.value === 'J') || (node.value === 'J' && endNode.value === 'L') ||
				(node.value === 'L' && endNode.value === '7') || (node.value === '7' && endNode.value === 'L')) 
			{
				// It's a valid wall
				walls++;
			}

			node = endNode;
		}


		node = graph.get(`${node.x + dx},${node.y + dy}`)
	}

	return walls;
}