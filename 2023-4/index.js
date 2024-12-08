const input = require('fs').readFileSync('input.txt').toString().split('\r\n');

const cards = {};

class Card {
	constructor(line) {
		// Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
		const [id, numbers] = line.split(':');
		this.id = +id.replace('Card ', '').trim();

		// Remove double spaces
		const trimmed = numbers.replaceAll('  ', ' ').trim();
		const [winning, present] = trimmed.split('|');

		this.winning = winning
			.trim()
			.split(' ')
			.map((n) => +n);
		this.present = present
			.trim()
			.split(' ')
			.map((n) => +n);

		this.totalScore = undefined;

		cards[this.id] = this;
	}

	winningNumbers() {
		return this.present.filter((p) => this.winning.includes(p));
	}

	winCount() {
		return this.winningNumbers().length;
	}

	score() {
		const nums = this.winningNumbers();
		if (nums.length === 0) {
			return 0;
		}

		return Math.pow(2, nums.length - 1);
	}

	nextCards() {
		const copies = [];
		const count = this.winCount();

		for (let i = 1; i <= count; i++) {
			const card = cards[this.id + i];
			if (card) {
				copies.push(card);
			}
		}

		return copies;
	}

	recursiveScore() {
		if (this.totalScore) {
			return this.totalScore;
		}

		const nextCards = this.nextCards();

		if (!nextCards.length) {
			return 0;
		}

		this.totalScore = nextCards.reduce((a, b) => a + b.recursiveScore(), nextCards.length);
		
		return this.totalScore;
	}
}

const result = input
	.map((l) => l.trim())
	.map((line) => {
		return new Card(line);
	});

const part1 = result.reduce((a, b) => a + b.score(), 0);
console.log({ part1 }); // { part1: 15268 }

const part2 = result.reverse().reduce((a, b) => a + b.recursiveScore(), input.length);
console.log({ part2 }); // { part2: 6283755 }