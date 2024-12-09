const array = require('fs').readFileSync(__dirname + '/' + 'input.txt').toString().trim().split('');

const blocks = [];
const files = [];

let id = 0;
for (let i = 0; i < array.length; i++) {
    if (i % 2 === 0) {
        const ID = id++;
        blocks.push(...new Array(+array[i]).fill(ID));

        files.push({ id: ID, size: +array[i] });
    } else {
        blocks.push(...new Array(+array[i]).fill(null));

        files.push({ id: null, size: +array[i] });
    }
}

// console.log(blocks);
// console.log(files);
// printLine();

const reversed = blocks.slice().reverse();

for (let b = 0; b < reversed.length; b++) {
    const block = reversed[b];
    if (block === null) continue;

    const index = blocks.indexOf(null);

    if (index === -1) {
        break;
    }

    if (index < b) break;

    blocks[index] = block;
    blocks[blocks.lastIndexOf(block)] = null;
}

let checksum = 0;

for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] === null) {
        continue;
    }

    checksum += i * blocks[i];
}

// printLine();

console.log({ part1: checksum });


// Part 2

const reversedFiles = files.slice().reverse();

for (let f = 0; f < reversedFiles.length; f++) {
    const file = reversedFiles[f];
    if (file.id === null) continue;

    const empty = files.find(f => f.id === null && f.size >= file.size);

    if (!empty) {
        continue;
    }

    // printFiles();

    // Move file before empty block
    const index = files.indexOf(empty);

    if (empty.size === file.size) {
        files.splice(index, 1, structuredClone(file));
    } else {
        files.splice(index, 0, structuredClone(file));

        empty.size -= file.size;
    }

    const moved = files.findLast(f => f.id === file.id);
    moved.id = null;
}

// console.log(files);

let checksum2 = 0;

const newBlocks = [];
for (let i = 0; i < files.length; i++) {
    if (files[i].id === null) {
        newBlocks.push(...new Array(files[i].size).fill(null));
    } else {
        newBlocks.push(...new Array(files[i].size).fill(files[i].id));
    }
}

for (let i = 0; i < newBlocks.length; i++) {
    if (newBlocks[i] === null) {
        continue;
    }

    checksum2 += i * newBlocks[i];
}

console.log({ part2: checksum2 });

function printLine() {
    let line = '';
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i] === null) {
            line += '.';
        } else {
            line += blocks[i];
        }
    }
    console.log(line);
}

function printFiles() {
    let line = '';
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.id === null) {
            line += '.'.repeat(file.size);
        } else {
            line += file.id.toString().repeat(file.size);
        }
    }
    console.log(line);
}