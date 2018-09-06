const math = require('mathjs');

function init({ upgradeLimit, piecePercentage }) {
  const pieceBinom = [];
  const pieceBinomCum = [];
  for (let i = 0; i <= upgradeLimit; i++) {
    pieceBinom[i] =
      math.pow(1 - piecePercentage, upgradeLimit - i) *
      math.pow(piecePercentage, i) *
      math.combinations(upgradeLimit, i);
  }
  for (let i = 0; i <= upgradeLimit; i++) {
    pieceBinomCum[i] = 0;
    for (let j = i; j <= upgradeLimit; j++) {
      pieceBinomCum[i] += pieceBinom[j];
    }
  }
  return {
    upgradeLimit,
    piecePercentage,
    pieceBinomCum,
    pieceBinom,
  };
}

// function getPieceTry(i) {
//   return (
//     pieceBinomCum[INNOCENT_LIMIT] *
//     math.pow(1 - pieceBinomCum[INNOCENT_LIMIT], i - 1)
//   );
// }

function getInnocentTry(
  i,
  { pieceBinomCum, innocentLimit, innocentPercentage },
) {
  const p = pieceBinomCum[innocentLimit];
  if (i === 0) {
    return p;
  }
  const q = 1 - p;
  const k = innocentPercentage;
  return p * q * k * math.pow(1 - p * k, i - 1);
}

function getInnocentMean({ pieceBinomCum, innocentLimit, innocentPercentage }) {
  const p = pieceBinomCum[innocentLimit];
  const q = 1 - p;
  const k = innocentPercentage;
  return q / (p * k);
}

function getWhiteProb(
  i,
  {
    pieceBinom,
    pieceBinomCum,
    piecePercentage,
    upgradeLimit,
    innocentLimit,
    whitePercentage,
  },
) {
  const p = piecePercentage;
  const q = 1 - p;
  const rate = p * whitePercentage;
  if (i === 0) {
    return (pieceBinom[upgradeLimit] / pieceBinomCum[innocentLimit]) * p;
  }
  let sum = 0;
  for (let j = innocentLimit; j <= upgradeLimit; j++) {
    const prob = pieceBinom[j] / pieceBinomCum[innocentLimit];
    const k = upgradeLimit + 1 - j;
    if (i >= k) {
      sum +=
        q *
        prob *
        math.combinations(i - 1, k - 1) *
        math.pow(rate, k) *
        math.pow(1 - rate, i - k);
    }
    if (k >= 2 && i >= k - 1) {
      sum +=
        p *
        prob *
        math.combinations(i - 1, k - 2) *
        math.pow(rate, k - 1) *
        math.pow(1 - rate, i - k + 1);
    }
  }
  return sum;
}

function getWhiteMean({
  pieceBinom,
  pieceBinomCum,
  piecePercentage,
  upgradeLimit,
  innocentLimit,
  whitePercentage,
}) {
  const p = piecePercentage;
  const q = 1 - p;
  const rate = p * whitePercentage;
  let sum = 0;
  for (let j = innocentLimit; j <= upgradeLimit; j++) {
    const prob = pieceBinom[j] / pieceBinomCum[innocentLimit];
    const k = upgradeLimit + 1 - j;
    sum += (q * prob * k) / rate;
    sum += (p * prob * (k - 1)) / rate;
  }
  return sum;
}

function run() {
  const config = {
    ...init({
      piecePercentage: 0.39,
      upgradeLimit: 8,
    }),
    innocentPercentage: 0.45,
    whitePercentage: 0.1,
    innocentLimit: 4,
  };
  const a = getInnocentTry(2, config);
  const b = getInnocentMean(config);
  const c = getWhiteProb(0, config);
  const d = getWhiteMean(config);
  console.log(b, d);
}

run();
