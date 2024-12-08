const input = require('fs').readFileSync('input.txt').toString().split('\n');

class Card {
	static order = [ '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A' ];
	static p2Order = [ 'J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A' ];

	constructor(label) {
		this.label = label;
		this.value = Card.order.indexOf(label);
		this.value2 = Card.p2Order.indexOf(label);
	}
}

class Hand {
	constructor(cards, bid) {
		this.bid = +bid;
		this.unsorted = cards.slice();
		this.cards = cards.sort((a, b) => b.value - a.value);

		this.grouped = {};
		this.sorted = {};

		this.grouped = this.cards.reduce((acc, card) => {
			if (!acc[card.label]) {
				acc[card.label] = 0;
			}
			acc[card.label]++;
			return acc;
		}, {});

		for (const [value, count] of Object.entries(this.grouped)) {
			if (!this.sorted[+count]) {
				this.sorted[+count] = [];
			}
			this.sorted[+count].push(value);
		}

		this.value = this.getValue();
		this.value2 = this.getValue2();
	}

	getValue() {
		if (this.ofAKind(5)) return 7; // 5 of a kind
		if (this.ofAKind(4)) return 6; // 4 of a kind
		if (this.ofAKind(3) && this.ofAKind(2)) return 5; // Full house
		if (this.ofAKind(3)) return 4; // 3 of a kind
		if (this.twoPair()) return 3; // 2 pair
		if (this.ofAKind(2)) return 2; // 1 pair
		return 1;
	}

	getValue2() {
		if (this.ofAKind(5)) return 9;

		const grouped = {};
		let jockers = 0;

		this.cards.forEach(({ label }) => {
			if (label === 'J') {
				jockers++;
				return;
			}
			grouped[label] ??= 0;
			grouped[label]++;
		});

		const sorted = Object.values(grouped).sort((a, b) => b - a);
		const first = sorted[0] + jockers;

		if (first === 5) return 9;
		if (first === 4) return 8;
		if (first === 3 && sorted[1] === 2) return 7;
		if (first === 3) return 6;
		if (first === 2 && sorted[1] === 2) return 5;
		if (first === 2) return 4;
		if (first === 1) return 3;
	}

	ofAKind(n) {
		return this.sorted[n]?.length > 0;
	}

	twoPair() {
		return this.sorted[2]?.length > 1;
	}

	compareTo(hand) {
		if (this.value !== hand.value) {
			return this.value - hand.value;
		}

		for (let i = 0; i < this.unsorted.length; i++) {
			const card = this.unsorted[i].value;
			const otherCard = hand.unsorted[i].value;

			if (card !== otherCard) {
				return card - otherCard;
			}
		}
		return 0;
	}

	compareTo2(hand) {
		if (this.value2 !== hand.value2) {
			return this.value2 - hand.value2;
		}

		for (let i = 0; i < this.unsorted.length; i++) {
			const card = this.unsorted[i].value2;
			const otherCard = hand.unsorted[i].value2;

			if (card !== otherCard) {
				return card - otherCard;
			}
		}

		return 0;
	}
}

const result = input
	.map((l) => l.trim())
	.map((section) => {
		const [cardValues, bid] = section.split(' ');

		const cards = cardValues.split('').map((v) => new Card(v));

		return new Hand(cards, bid);
	});

const part1 = result
	.sort((a, b) => a.compareTo(b))
	.reduce((acc, cur, i) => acc + cur.bid * (i + 1), 0);

console.log({ part1 });

const part2 = result
	.sort((a, b) => a.compareTo2(b))
	.reduce((acc, cur, i) => acc + cur.bid * (i + 1), 0);

console.log({ part2 });
