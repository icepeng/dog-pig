const data = require('./white.json');

const stat = {};
let mean = 0;

data.forEach(x => {
  if (!stat[x]) {
    stat[x] = 0;
  }
  stat[x] += 1 / 1000000;
  mean += x / 1000000;
});

console.log(stat);
