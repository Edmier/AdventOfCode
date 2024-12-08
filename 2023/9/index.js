const input = require('fs').readFileSync('input.txt').toString().split('\n');

class History {
	constructor(line) {
		const values = line.trim().split(' ').map((v) => new Node(+v));

		for (let i = 0; i < values.length; i++) {
			const node = values[i];

			node.next = values.at(i + 1) ?? null;
			node.prev = values.at(i - 1) ?? null;
		}

		this.levels = {
			0: values,
		}

		this.buildLevels();
	}

	buildLevels() {
		let levelIndex = 0;
		let level = this.levels[levelIndex];

		while (level.some((node) => node.value !== 0)) {
			levelIndex++;
			let nextLevel = [];

			for (const node of level) {
				if (!node.next) break;
				nextLevel.push(new Node(node.next.value - node.value, levelIndex));
			}

			// Connect the new nodes
			for (let i = 0; i < nextLevel.length; i++) {
				const node = nextLevel[i];
	
				node.next = nextLevel[i + 1] ?? null;
				node.prev = nextLevel[i - 1] ?? null;
			}

			this.levels[levelIndex] = nextLevel;
			level = nextLevel;
		}
	}

	extrapolate(count = 1) {
		let levelCount = Object.keys(this.levels).length;
		for (let i = 0; i < count; i++) {
			for (let level = levelCount; level >= 0; level--) {
				this.addPredictedNodes(level);
			}
		}
	}

	static dummyNodes = [ { value: 0 }, { value: 0 } ];

	addPredictedNodes(level) {
		const thisLevel = this.levels[level];
		if (!thisLevel) return;

		// Get level below
		const levelBelow = this.levels[level + 1] ?? History.dummyNodes;
		const lastNode = thisLevel.at(-1);

		// Add a new node to the end
		const lastLowerNode = levelBelow.at(-1);
		const increase = lastLowerNode.value;

		const newNode = new Node(lastNode.value + increase, level);
		newNode.prev = lastNode;
		lastNode.next = newNode;
		thisLevel.push(newNode);

		// Also add a new node to the start
		const firstNode = thisLevel[0];
		const firstLowerNode = levelBelow[0];
		const increase2 = firstLowerNode.value;

		const newNode2 = new Node(firstNode.value - increase2, level);
		newNode2.next = firstNode;
		firstNode.prev = newNode2;
		thisLevel.unshift(newNode2);

		return;
	}

	nextValue() {
		this.extrapolate();
		return this.levels[0].at(-1)?.value ?? 0;	
	}

	prevValue() {
		return this.levels[0][0]?.value ?? 0;	
	}
}

class Node {
	constructor(value, level = 0) {
		this.value = value;
		this.level = level;

		this.next = null;
		this.prev = null;
	}
}

const histories = input.map((line) => new History(line));

const part1 = histories.map((history) => history.nextValue()).reduce((a, b) => a + b, 0);
const part2 = histories.map((history) => history.prevValue()).reduce((a, b) => a + b, 0);

console.log({ part1 });
console.log({ part2 });