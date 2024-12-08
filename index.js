// Get current year
const year = new Date().getFullYear();
// Get current day of month
const day = process.argv[2] ?? new Date().getDate();

require(`./${year}/${day}/index.js`);