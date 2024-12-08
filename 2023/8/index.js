const input = require('fs').readFileSync('input.txt').toString().split('\n');

function gcd(a, b) {
	if (b === 0) return a;
	return gcd(b, a % b);
}

function lcm(...numbers) {
	return numbers.reduce((acc, cur) => (acc * cur) / gcd(acc, cur), 1);
}

class Node {
	static nodes = {};
	static starts = [];

	constructor(line) {
		const [ id, second ] = line.split(' = ');
		this.id = id;

		const [ left, right ] = second.trim('').replace('(', '').replace(')', '').split(', ');

		this.left = left;
		this.right = right;

		Node.nodes[this.id] = this;

		if (this.id.endsWith('A')) {
			Node.starts.push(this);
		}
	}

	get R() {
		return Node.nodes[this.right];
	}

	get L() {
		return Node.nodes[this.left];
	}

	static find(instruction) {
		const directions = instruction.split('');

		let current = this.nodes['AAA'];
		let direction = 0;
		let steps = 0;

		while (current?.id !== 'ZZZ') {
			current = current[directions[direction]];
			direction = (direction + 1) % directions.length;
			steps++;
		}

		return steps;
	}

 	computeLoop(instruction) {
		const directions = instruction.split('');
		let direction = 0;
		let steps = 0;

		this.endings = {};
		this.patterns = {};

		let current = this;

		while (true) {
			steps++;
			current = current[directions[direction]];

			if (current.id.endsWith('Z')) {
				this.endings[current.id] ??= [];
				const ending = this.endings[current.id];

				ending.push(steps);
				if (ending.length === 5) {
					// Get difference between last 2
					this.patterns = ending[ending.length - 1] - ending[ending.length - 2];
					break;
				}
			}
			direction = (direction + 1) % directions.length;			
		}

		return this.patterns;
	}
}

const directions = input.shift().trim();
input.shift();

input.map((l) => l.trim())
	.forEach((section) => {
		return new Node(section);
	});

const part1 = Node.find(directions);
console.log({ part1 });

const part2 = lcm(...Node.starts.map((s) => s.computeLoop(directions)));
console.log({ part2 });