const data = require('./rule1.json');

const stat = {};

data.forEach(x => {
  if (!stat[x]) {
    stat[x] = 0;
  }
  stat[x] += 1/1000000;
});

console.log(stat);