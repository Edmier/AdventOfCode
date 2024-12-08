const fs = require('fs');

const array = fs.readFileSync('input.txt').toString().split('\n');

const knotCount = 10;
const knots = [];
for (let i = 0; i < knotCount; i++) {
    knots.push({ x: 0, y: 0 });
}

const visited = new Set();

function moveKnot(knot, direction) {
    switch (direction) {
        case 'R':
            knot.x += 1;
            break;
        case 'L':
            knot.x -= 1;
            break;
        case 'U':
            knot.y += 1;
            break;
        case 'D':
            knot.y -= 1;
            break;
    }
}


for (const move of array) {
    const [ direction, distance ] = move.split(' ');
    const dist = parseInt(distance);

    for (let i = 0; i < dist; i++) {
        
        moveKnot(knots[0], direction);

        for (let k = 1; k < knots.length; k++) {
            if (Math.abs(knots[k - 1].x - knots[k].x) > 1 || Math.abs(knots[k - 1].y - knots[k].y) > 1) {
                knots[k].x += Math.max(-1, Math.min(knots[k - 1].x - knots[k].x, 1));
                knots[k].y += Math.max(-1, Math.min(knots[k - 1].y - knots[k].y, 1));
            }
        }
        
        visited.add(`${knots[knots.length - 1].x},${knots[knots.length - 1].y}`);
    }
}

console.log('Visited: ' + visited.size);