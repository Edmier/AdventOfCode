// Part 1, then Part 2 is commented (numbers edited slightly to hide input)
const startMs = Date.now();
const time = /*[ 7, 15, 30 ];*/ [  41968894 ];
const distance = /*[ 9, 40, 200 ];*/ [ 214178911271055 ];

const races = time.map((t, i) => {
    return { time: t, distance: distance[i] };
});

function speed(charge, goal) {
    const diff = goal - charge;
    if (diff <= 0) return 0;

    return charge * diff;
}

const waysToWin = [];
for (let i = 0; i < races.length; i++) {
    const { time, distance: goal } = races[i];

    let winCount = 0;

    for (let charge = 0; charge < time; charge++) {
        const distance = speed(charge, time);

        if (distance > goal) {
            winCount++;
        }
    }

    waysToWin.push(winCount);
}

const product = waysToWin.reduce((a, b) => a * b, 1);
console.log({ product });

console.log(`after ${(Date.now() - startMs)} ms`);