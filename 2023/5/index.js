const input = require('fs').readFileSync.toString().split('\r\n\r\n');

const seeds = [];

class AlmanacMap {
	static maps = {};

	constructor(lines) {
		const [ name, ...mapLines ] = lines;

		this.name = name.split(' ')[0];
		const parts = name.split('-');
		this.source = parts[0];
		this.target = parts[2].split(' ')[0];

		this.ranges = [];

		for (const line of mapLines) {
			const [ destStart, sourceStart, length ] = line.split(' ').map(toNum);

			this.ranges.push({
				dest: destStart,
				source: sourceStart,
				length,
			});
		}

		AlmanacMap.maps[this.source] = this;
	}

	get(source) {
		for (const range of this.ranges) {
			if (source >= range.source && source < range.source + range.length) {
				return range.dest + (source - range.source);
			}
		}

		return source;
	}

	static chain(input, steps) {
		let result = input;
		for (const step of steps) {
			const map = AlmanacMap.maps[step];
			if (!map) {
				throw new Error(`No map found for step ${step}`);
			}
			result = AlmanacMap.maps[step].get(result);
		}

		return result;
	}

	toString() {
		return this.name;
	}
}

seeds.push(...input.shift().split(': ')[1].split(' ').map((n) => +n));

const result = input.map((l) => l.trim()).map((section) => {
	return new AlmanacMap(section.split('\r\n'));
}).filter(a => a);

const path = ['seed', 'soil', 'fertilizer', 'water', 'light', 'temperature', 'humidity'];

const paths = seeds.map(s => AlmanacMap.chain(s, path));
console.log('part1', Math.min(...paths));

let lowest = Infinity;
let seedCount = 0;
const startTime = Date.now();

for (let i = 0; i < seeds.length; i += 2) {
	const start = seeds[i];
	const length = seeds[i + 1];

	for (let j = start; j < start + length; j++) {
		const result = AlmanacMap.chain(j, path);
		lowest = Math.min(lowest, result);

		if (seedCount++ % 5_000_000 === 0) {
			// Calculate ETA
			const elapsed = Date.now() - startTime;
			const perSeed = elapsed / seedCount;
			const remaining = perSeed * (2104769314 - seedCount);
			const eta = new Date(Date.now() + remaining);

			console.log((seedCount / 2104769314 * 100).toFixed(2) + '%', eta.toLocaleTimeString());
		}
	}
}

console.log({ lowest });