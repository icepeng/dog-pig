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
  {
    upgradeBinom,
    upgradeBinomCum,
    innocentLimit,
    innocentPercentage,
    upgradePercentage,
    hammerPercentage,
    isBeforeHammer,
  },
) {
  const p =
    upgradeBinomCum[innocentLimit] +
    (isBeforeHammer
      ? upgradeBinom[innocentLimit - 1] * hammerPercentage * upgradePercentage
      : 0);
  if (i === 0) {
    return p;
  }
  const q = 1 - p;
  const k = innocentPercentage;
  return p * q * k * math.pow(1 - p * k, i - 1);
}

function getInnocentMean({
  upgradeBinom,
  upgradeBinomCum,
  innocentLimit,
  innocentPercentage,
  upgradePercentage,
  hammerPercentage,
  isBeforeHammer,
}) {
  const p =
    upgradeBinomCum[innocentLimit] +
    (isBeforeHammer
      ? upgradeBinom[innocentLimit - 1] * hammerPercentage * upgradePercentage
      : 0);
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
    isBeforeHammer,
  },
) {
  const total = isBeforeHammer
    ? upgradeBinomCum[innocentLimit] +
      upgradeBinom[innocentLimit - 1] * hammerPercentage * upgradePercentage
    : upgradeBinomCum[innocentLimit];
  const p = upgradePercentage * hammerPercentage;
  const q = 1 - p;
  const rate = upgradePercentage * whitePercentage;
  if (i === 0) {
    return (upgradeBinom[upgradeLimit] / total) * p;
  }
  let sum = 0;
  for (let j = 1; j <= upgradeLimit - innocentLimit + 1; j++) {
    const prob = upgradeBinom[upgradeLimit - j + 1] / total;
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
  if (i >= upgradeLimit - innocentLimit + 1 && isBeforeHammer) {
    sum +=
      ((upgradeBinom[innocentLimit - 1] *
        hammerPercentage *
        upgradePercentage) /
        total) *
      math.combinations(i - 1, upgradeLimit - innocentLimit) *
      math.pow(rate, upgradeLimit - innocentLimit + 1) *
      math.pow(1 - rate, i - upgradeLimit + innocentLimit - 1);
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
  isBeforeHammer,
}) {
  const hammerLeft = upgradeBinomCum[innocentLimit];
  const hammerUsed =
    upgradeBinom[innocentLimit - 1] * hammerPercentage * upgradePercentage;

  let sum = 0;
  for (let j = 1; j <= upgradeLimit - innocentLimit + 1; j++) {
    sum +=
      (upgradeBinom[upgradeLimit - j + 1] / upgradeBinomCum[innocentLimit]) * j;
  }
  sum /= upgradePercentage * whitePercentage;
  sum -= hammerPercentage / whitePercentage;
  return isBeforeHammer
    ? (sum * hammerLeft +
        (hammerUsed * (upgradeLimit - innocentLimit + 1)) /
          (upgradePercentage * whitePercentage)) /
        (hammerLeft + hammerUsed)
    : sum;
}

function getHammerProb(
  i,
  {
    upgradeBinom,
    upgradeBinomCum,
    innocentLimit,
    upgradePercentage,
    hammerPercentage,
    isBeforeHammer,
  },
) {
  if (!isBeforeHammer) {
    return i === 1 ? 1 : 0;
  }
  const p =
    upgradeBinomCum[innocentLimit] +
    (isBeforeHammer
      ? upgradeBinom[innocentLimit - 1] * hammerPercentage * upgradePercentage
      : 0);
  return (
    (p / upgradeBinomCum[innocentLimit - 1]) *
    math.pow(1 - p / upgradeBinomCum[innocentLimit - 1], i - 1)
  );
}

function getHammerMean({
  upgradeBinom,
  upgradeBinomCum,
  innocentLimit,
  upgradePercentage,
  hammerPercentage,
  isBeforeHammer,
}) {
  if (!isBeforeHammer) {
    return 1;
  }
  const p =
    upgradeBinomCum[innocentLimit] +
    upgradeBinom[innocentLimit - 1] * hammerPercentage * upgradePercentage;
  return upgradeBinomCum[innocentLimit - 1] / p;
}

function run() {
  const config = {
    ...init({
      upgradePercentage: 0.39,
      upgradeLimit: 8,
    }),
    innocentPercentage: 0.45,
    whitePercentage: 0.1,
    hammerPercentage: 0.5,
    innocentLimit: 4,
    isBeforeHammer: true,
  };
  const a = getInnocentProb(2, config);
  const b = getInnocentMean(config);
  const c = getWhiteProb(0, config);
  const d = getWhiteMean(config);
  const e = getHammerProb(5, config);
  const f = getHammerMean(config);
}

run();
