const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split('\n');

const monkeys = new Map();

class Monkey {
	constructor(id, items, oper, test, monkeys) {
		this.id = id;
		this.items = items;
		this.operation = oper;
		this.test = test;
        this.monkeys = monkeys;
        this.inspections = 0;
	}

    doTurn(lcm) {
        for (const item of this.items) {
            this.inspections++;
            const worry = Math.floor(this.operation(item) % lcm);
            this.throw(worry);
            this.items = this.items.filter((i) => i !== item);
        }
    }

    throw(worry) {
        const result = this.monkeys[worry % this.test === 0];
        monkeys.get(result).items.push(worry);
    }
}

/* Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
    */

// monkeys.set(0,
// 	new Monkey(
// 		0,
// 		[79, 98],
// 		(old) => old * 19,
// 		23,
// 		{ true: 2, false: 3 }
// 	)
// );
// monkeys.set(1,
// 	new Monkey(
// 		1,
// 		[54, 65, 75, 74],
// 		(old) => old + 6,
// 		19,
// 		{ true: 2, false: 0 }
// 	)
// );
// monkeys.set(2,
// 	new Monkey(
// 		2,
// 		[79, 60, 97],
// 		(old) => old * old,
// 		13,
// 		{ true: 1, false: 3 }
// 	)
// );
// monkeys.set(3,
// 	new Monkey(
// 		3,
// 		[74],
// 		(old) => old + 3,
// 		17,
// 	    { true: 0, false: 1 }
// 	)
// );

monkeys.set(0,
	new Monkey(
		0,
		[98, 97, 98, 55, 56, 72],
		(old) => old * 13,
		11,
		{ true: 4, false: 7 }
	)
);
monkeys.set(1,
	new Monkey(
		1,
		[73, 99, 55, 54, 88, 50, 55],
		(old) => old + 4,
		17,
		{ true: 2, false: 6 }
	)
);
monkeys.set(2,
	new Monkey(
		2,
		[67, 98],
		(old) => old * 11,
		5,
		{ true: 6, false: 5 }
	)
);
monkeys.set(3,
	new Monkey(
		3,
		[82, 91, 92, 53, 99],
		(old) => old + 8,
		13,
		{ true: 1, false: 2 }
	)
);
monkeys.set(4,
	new Monkey(
		4,
		[52, 62, 94, 96, 52, 87, 53, 60],
		(old) => old * old,
		19,
		{ true: 3, false: 1 }
	)
);
monkeys.set(5,
	new Monkey(
		5,
		[94, 80, 84, 79],
		(old) => old + 5,
		2,
		{ true: 7, false: 0 }
	)
);
monkeys.set(6,
	new Monkey(
		6,
		[89],
		(old) => old + 1,
		3,
		{ true: 0, false: 5 }
	)
);
monkeys.set(7,
	new Monkey(
		7,
		[70, 59, 63],
		(old) => old + 3,
		7,
		{ true: 4, false: 3 }
	)
);

let lcm = 1;
for (const monkey of monkeys.values()) {
    lcm = lcm * monkey.test;
}

console.log(`LCM: ${lcm}`);
for (let i = 0; i < 10000; i++) {
    for (const monkey of monkeys.values()) {
        monkey.doTurn(lcm);
    }
    // for (const [id, monkey] of monkeys.entries()) {
    //     console.log(`Monkey ${id}: ${monkey.items.join(' ')} (${monkey.inspections} inspections)`);
    // }
}


// for (const [id, monkey] of monkeys.entries()) {
//     console.log(`Monkey ${id}: ${monkey.items.join(' ')} (${monkey.inspections} inspections)`);
// }

const result = Array.from(monkeys.values()).sort((a, b) => b.inspections - a.inspections).slice(0, 2);
console.log(`Result: ${result.map((m) => +m.inspections).reduce((a, b) => a * b, 1)}`);