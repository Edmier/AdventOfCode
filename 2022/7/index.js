const fs = require('fs');

const array = fs.readFileSync('input.txt').toString();

class Directory {
    constructor(name, parent) {
        this.name = name;
        this.children = new Map();
        this.parent = parent;
    }

    totalSize() {
        let total = 0;
        for (const child of this.children.values()) {
            if (child instanceof File) {
                total += child.size;
            } else {
                total += child.totalSize();
            }
        }
        return total;
    }
}

class File {
    constructor(name, size) {
        this.name = name;
        this.size = parseInt(size);
    }
}

const root = new Directory('/');
const allDirectories = [ root ];
let currentDirectory = root;

for (const line of array.split('$ ')) {
    const [ cmd, ...results ] = line.trim().split('\n');

    if (cmd.startsWith('cd')) {
        const dir = cmd.split(' ')[1];
        if (dir === '..') {
            currentDirectory = currentDirectory.parent;
        } else if (dir === '/') {
            currentDirectory = root;
        } else {
            child = new Directory(dir, currentDirectory);
            currentDirectory.children.set(dir, child);
            currentDirectory = child;
            allDirectories.push(child);
        }
    } else if (cmd === 'ls') {
        for (const child of results) {
            const [ size, name ] = child.split(' '); 

            if (size === 'dir') {
                const dir = new Directory(name, currentDirectory);
                currentDirectory.children.set(name, dir);
                allDirectories.push(dir);
            } else {
                currentDirectory.children.set(name, new File(name, size));
            }
        }
    }
}

// console.log(root);
console.log('Total Size: ' + root.totalSize());

let smallTotal = 0;
for (const dir of allDirectories) {
    const total = dir.totalSize();
    if (total < 100000) {
        smallTotal += total;
    }
}

console.log('Small Total: ' + smallTotal);

const totalSpace = 70000000;
const requiredSpace = 30000000;
const currentSize = root.totalSize();

allDirectories.sort((a, b) => a.totalSize() - b.totalSize());

for (const dir of allDirectories) {
    const total = dir.totalSize();
    if (currentSize - total <= totalSpace - requiredSpace) {
        console.log('Remove: ' + dir.name + ' ' + total);
        break;
    }
}