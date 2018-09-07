const data = require('./hammer_70p.json');

const stat = {};
const target = 'white';
let mean = 0;

data.forEach(item => {
  const x = item[target];
  if (!stat[x]) {
    stat[x] = 0;
  }
  stat[x] += 1;
  mean += x;
});

console.log(stat);
console.log(mean)