const array = require('fs').readFileSync(__dirname + '/' + 'input.txt').toString().trim().split("\n");

const antenna = {};
const width = array[0].trim().length;
const height = array.length;

for (let y = 0; y < array.length; y++) {
    const line = array[y].trim();
    for (let x = 0; x < line.length; x++) {
        const value = array[y][x];
        if (value !== '.') {
            antenna[value] ??= [];
            antenna[value].push({ x, y });
        }
    }
}

const antiNodes = {};
const antiNodes2 = {};

for (const antennas of Object.values(antenna)) {
    for (let i = 0; i < antennas.length; i++) {
        const node = antennas[i];
        antiNodes2[node.x + ',' + node.y] = true;

        for (let a = 0; a < antennas.length; a++) {
            if (i === a) continue;
            const node2 = antennas[a];
            const distance = getDistanceBetweenNodes(node, node2);

            let newPoint = pointFromMovement(node, [ -distance[0], -distance[1] ]);

            if (newPoint.x >= 0 && newPoint.x < width && newPoint.y >= 0 && newPoint.y < height) {
                antiNodes[newPoint.x + ',' + newPoint.y] = true;
            }

            // Part 2
            while (newPoint.x >= 0 && newPoint.x < width && newPoint.y >= 0 && newPoint.y < height) {
                antiNodes2[newPoint.x + ',' + newPoint.y] = true;
                newPoint = pointFromMovement(newPoint, [ -distance[0], -distance[1] ]);
            }
        }
    }
}

console.log({ part1: Object.keys(antiNodes).length });
console.log({ part2: Object.keys(antiNodes2).length });
// printGridWithAntinodes();

function printGridWithAntinodes() {
    for (let y = 0; y < height; y++) {
        let line = '';
        for (let x = 0; x < width; x++) {
            if (antiNodes[x + ',' + y]) {
                line += 'X';
            } else {
                line += '.';
            }
        }
        console.log(line);
    }
}

function getDistanceBetweenNodes(node1, node2) {
    return [ node2.x - node1.x, node2.y - node1.y ];
}

function pointFromMovement(node, movement) {
    return { x: node.x + movement[0], y: node.y + movement[1] };
}