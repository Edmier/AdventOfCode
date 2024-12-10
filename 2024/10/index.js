const array = require('fs').readFileSync(__dirname + '/' + 'input.txt').toString().trim().split("\n");

const heads = [];
const goals = [];

const grid = array.map((row, y) => row.split('').map((char, x) => {
	if (char === '0') {
		heads.push({ x, y });
		return 0;
	} else if (char === '9') {
		goals.push({ x, y });
		return 9;
	}

	return +char;
}));

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
			return n.value === node.value + 1;
		});

		node.edges = edges;
	}
}

function countAllPaths(start, end) {
    const queue = [start];
    const visited = new Set();
    let count = 0;

    while (queue.length > 0) {
        const node = queue.shift();

        if (node === end) {
            count++;
        }

        visited.add(node);

        for (const neighbor of node.edges) {
            if (!visited.has(neighbor)) {
                queue.push(neighbor);
            }
        }
    }

    return count;
}

let part1 = 0;
let part2 = 0;

for (const head of heads) {
    let connections = 0;
    let paths = 0;
    for (const goal of goals) {
        const start = graph.get(`${head.x},${head.y}`);
        const end = graph.get(`${goal.x},${goal.y}`);
        const totalPaths = countAllPaths(start, end);

        if (totalPaths > 0) {
            connections++;
        }

        paths += totalPaths;
    }
    part1 += connections;
    part2 += paths;
}

console.log({ part1 });
console.log({ part2 });