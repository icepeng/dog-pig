const math = require('mathjs');

function init({ upgradeLimit, upgradePercentage }) {
  const upgradeBinom = [];
  const upgradeBinomCum = [];
  for (let i = 0; i <= upgradeLimit; i++) {
    upgradeBinom[i] =
      math.pow(1 - upgradePercentage, upgradeLimit - i) *
      math.pow(upgradePercentage, i) *
      math.combinations(upgradeLimit, i);
  }
  for (let i = 0; i <= upgradeLimit; i++) {
    upgradeBinomCum[i] = 0;
    for (let j = i; j <= upgradeLimit; j++) {
      upgradeBinomCum[i] += upgradeBinom[j];
    }
  }
  return {
    upgradeLimit,
    upgradePercentage,
    upgradeBinomCum,
    upgradeBinom,
  };
}

// function getupgradeTry(i) {
//   return (
//     upgradeBinomCum[INNOCENT_LIMIT] *
//     math.pow(1 - upgradeBinomCum[INNOCENT_LIMIT], i - 1)
//   );
// }

function getInnocentProb(
  i,
  { upgradeBinomCum, innocentLimit, innocentPercentage },
) {
  const p = upgradeBinomCum[innocentLimit];
  if (i === 0) {
    return p;
  }
  const q = 1 - p;
  const k = innocentPercentage;
  return p * q * k * math.pow(1 - p * k, i - 1);
}

function getInnocentMean({
  upgradeBinomCum,
  innocentLimit,
  innocentPercentage,
}) {
  const p = upgradeBinomCum[innocentLimit];
  const q = 1 - p;
  const k = innocentPercentage;
  return q / (p * k);
}

function getWhiteProb(
  i,
  {
    upgradeBinom,
    upgradeBinomCum,
    upgradePercentage,
    upgradeLimit,
    innocentLimit,
    whitePercentage,
    hammerPercentage,
  },
) {
  const p = upgradePercentage * hammerPercentage;
  const q = 1 - p;
  const rate = p * whitePercentage;
  if (i === 0) {
    return (upgradeBinom[upgradeLimit] / upgradeBinomCum[innocentLimit]) * p;
  }
  let sum = 0;
  for (let j = 1; j <= upgradeLimit - innocentLimit + 1; j++) {
    const prob =
      upgradeBinom[upgradeLimit - j + 1] / upgradeBinomCum[innocentLimit];
    if (i >= j) {
      sum +=
        q *
        prob *
        math.combinations(i - 1, j - 1) *
        math.pow(rate, j) *
        math.pow(1 - rate, i - j);
    }
    if (j >= 2 && i >= j - 1) {
      sum +=
        p *
        prob *
        math.combinations(i - 1, j - 2) *
        math.pow(rate, j - 1) *
        math.pow(1 - rate, i - j + 1);
    }
  }
  return sum;
}

function getWhiteMean({
  upgradeBinom,
  upgradeBinomCum,
  upgradePercentage,
  upgradeLimit,
  innocentLimit,
  whitePercentage,
  hammerPercentage,
}) {
  const rate = upgradePercentage * whitePercentage;
  let sum = 0;
  for (let j = 1; j <= upgradeLimit - innocentLimit + 1; j++) {
    sum +=
      (upgradeBinom[upgradeLimit - j + 1] / upgradeBinomCum[innocentLimit]) * j;
  }
  sum /= upgradePercentage * whitePercentage;
  sum -= hammerPercentage / whitePercentage;
  return sum;
}

function run() {
  const config = {
    ...init({
      upgradePercentage: 0.39,
      upgradeLimit: 8,
    }),
    innocentPercentage: 0.45,
    whitePercentage: 0.1,
    hammerPercentage: 1,
    innocentLimit: 4,
  };
  const a = getInnocentProb(2, config);
  const b = getInnocentMean(config);
  const c = getWhiteProb(0, config);
  const d = getWhiteMean(config);
  console.log(d);
}

run();
