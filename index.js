const math = require('mathjs');

const INNOCENT_LIMIT = 4;
const UPGRADE_LIMIT = 8;
const PRICE = {
  white: 5000000,
  innocent: 15000000,
  piece: 2500,
};
const PIECE_PERCENT = 0.39;
const INNOCENT_PERCENT = 0.45;
const WHITE_PERCENT = 0.1;

const pieceBinom = [];
const pieceBinomCum = [];

function init() {
  for (let i = 0; i <= UPGRADE_LIMIT; i++) {
    pieceBinom[i] =
      math.pow(1 - PIECE_PERCENT, UPGRADE_LIMIT - i) *
      math.pow(PIECE_PERCENT, i) *
      math.combinations(UPGRADE_LIMIT, i);
  }
  for (let i = 0; i <= UPGRADE_LIMIT; i++) {
    pieceBinomCum[i] = 0;
    for (let j = i; j <= UPGRADE_LIMIT; j++) {
      pieceBinomCum[i] += pieceBinom[j];
    }
  }
}

function getPieceTry(i) {
  return (
    pieceBinomCum[INNOCENT_LIMIT] *
    math.pow(1 - pieceBinomCum[INNOCENT_LIMIT], i - 1)
  );
}

function getInnocentTry(i) {
  const p = pieceBinomCum[INNOCENT_LIMIT];
  if (i === 0) {
    return p;
  }
  const q = 1 - p;
  const k = INNOCENT_PERCENT;
  return p * q * k * math.pow(1 - p * k, i - 1);
}

function getInnocentMean() {
  const p = pieceBinomCum[INNOCENT_LIMIT];
  const q = 1 - p;
  const k = INNOCENT_PERCENT;
  return q / (p * k);
}

function getWhiteProb(i) {
  const p = PIECE_PERCENT;
  const q = 1 - p;
  const k = WHITE_PERCENT;
  return p * k * math.pow(1 - p * k, i - 1);
}

function getWhiteMean() {
  const p = PIECE_PERCENT;
  const q = 1 - p;
  const k = WHITE_PERCENT;
  return (p * k) / (p * p * k * k);
}

init();
const a = getInnocentTry(2);
const b = getInnocentMean();
const c = getWhiteProb(1);
console.log(a);
console.log(b);
c;
