const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split("\r\n");

class CubeGame {
    constructor(line) {
        this.blue = {
            min: 0,
            max: 0
        };

        this.red = {
            min: 0,
            max: 0
        };

        this.green = {
            min: 0,
            max: 0
        };

        // Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green

        // Get game number
        const gameNumber = line.match(/game (\d+)/i)[1];
        this.id = gameNumber;

        // Get rolls
        const rolls = line.match(/: (.+)/i)[1];

        // Split rolls
        const splitRolls = rolls.split(';');

        for (const roll of splitRolls) {
            const colors = roll.split(', ');
            const result = {};

            for (const color of colors) {
                const [, number, colorName ] = color.match(/(\d+) (.+)/i);

                result[colorName] = +number;
            }

            this.addRoll(result);
            console.log(result);
        }

        // console.log(this.minimumCubePower());
    }

    addRoll({ red, green, blue }) {
        if (red !== undefined) {
            this.red.min = Math.min(this.red.min, red);
            this.red.max = Math.max(this.red.max, red);
        }

        if (green !== undefined) {
            this.green.min = Math.min(this.green.min, green);
            this.green.max = Math.max(this.green.max, green);
        }

        if (blue !== undefined) {
            this.blue.min = Math.min(this.blue.min, blue);
            this.blue.max = Math.max(this.blue.max, blue);
        }
    }

    isPossible({ red, green, blue }) {
        if (red < this.red.max) {
            return false;
        }

        if (green < this.green.max) {
            return false;
        }

        if (blue < this.blue.max) {
            return false;
        }

        return true;
    }

    minimumCubePower() {
        return this.red.max * this.green.max * this.blue.max;
    }

    toString() {
        return `Game ${this.id}: ${this.red.min}-${this.red.max} red; ${this.green.min}-${this.green.max} green; ${this.blue.min}-${this.blue.max} blue;`;
    }
}


const result = array.map((line) => new CubeGame(line));

const possible = result.filter((game) => game.isPossible({ red: 12, green: 13, blue: 14 }));
const possibleIds = possible.map((game) => +game.id);

// Sum of all possible game numbers
const sum = possibleIds.reduce((a, b) => a + b);

console.log({ sum });

const powers = result.map((game) => game.minimumCubePower());
const powerSum = powers.reduce((a, b) => a + b);

console.log({ powerSum });