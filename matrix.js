const UPGRADE_PERCENTAGE = 0.39;
const INNOCENT_PERCENTAGE = 0.45;
const WHITE_PERCENTAGE = 0.1;
const HAMMER_PERCENTAGE = 0.5;

const UPGRADE_PRICE = 337.5;
const INNOCENT_PRICE = 1250;
const WHITE_PRICE = 500;
const HAMMER_PRICE = 600;

// const NORMAL_4 = [
//   ['U', 'U', 'U', 'U', 'U', 'I', null, null, null],
//   [null, 'U', 'U', 'U', 'U', 'U', 'I', null, null],
//   [null, null, 'U', 'U', 'U', 'U', 'U', 'I', null],
//   [null, null, null, 'U', 'U', 'U', 'U', 'U', 'I'],
//   [null, null, null, null, 'U', 'U', 'U', 'U', 'H'],
//   [null, null, null, null, null, 'U', 'U', 'U', 'H'],
//   [null, null, null, null, null, null, 'U', 'U', 'H'],
//   [null, null, null, null, null, null, null, 'U', 'H'],
//   [null, null, null, null, null, null, null, null, 'H'],
// ];

const NORMAL_4 = [
  { action: 'I', try: 5 },
  { action: 'I', try: 6 },
  { action: 'I', try: 7 },
  { action: 'I', try: 8 },
  { action: 'H', try: 8 },
  { action: 'H', try: 8 },
  { action: 'H', try: 8 },
  { action: 'H', try: 8 },
  { action: 'H', try: 8 },
];

const HAMMER_4 = [
  { try: 6, action: 'I' },
  { try: 7, action: 'I' },
  { try: 8, action: 'I' },
  { try: 9, action: 'I' },
  { try: 9, action: 'W' },
  { try: 9, action: 'W' },
  { try: 9, action: 'W' },
  { try: 9, action: 'W' },
  { try: 9, action: 'W' },
  { try: 9, action: 'FINISH' },
];

const A = [];
const B = [];
let min = 99999999;
let minA;
let minB;

function recursive(t1, a1, depth) {
  A[depth] = { try: t1, action: a1 };
  if (depth === 8) {
    // console.log(A);
    const res = calculate(A, [...B, { try: 9, action: 'FINISH' }])
    if (res < min) {
      min = res;
      minA = A;
      minB = B;
      console.log(minA);
      console.log(minB);
    }
    return;
  }
  for (let i = t1; i <= 8; i++) {
    if (a1 === 'I' && depth + 1 < 8 && i != t1) {
      recursive(i, 'I', depth + 1);
    }
    recursive(i, 'H', depth + 1);
  }
}

for (let i = 1; i <= 8; i++) {
  recursive(i, 'I', 0);
}

console.log(min);

function calculate(actionNormal, actionHammer) {
  const actionMatrixNormal = [
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
  ];

  const actionMatrixHammer = [
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
  ];

  for (let i = 0; i <= 8; i++) {
    for (let j = 0; j < actionNormal[i].try; j++) {
      actionMatrixNormal[i][j] = 'U';
    }
    actionMatrixNormal[i][actionNormal[i].try] = actionNormal[i].action;
  }

  for (let i = 0; i <= 9; i++) {
    for (let j = 0; j < actionHammer[i].try; j++) {
      actionMatrixHammer[i][j] = 'U';
    }
    actionMatrixHammer[i][actionHammer[i].try] = actionHammer[i].action;
  }

  const costNormal = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const costHammer = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const innocentNormal = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const innocentHammer = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const costFinalNormal = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const costFinalHammer = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  for (let i = 8; i >= 0; i--) {
    for (let j = 9; j >= i; j--) {
      if (actionMatrixHammer[i][j] === 'U') {
        if (actionMatrixHammer[i][j + 1] === 'W') {
          costHammer[i][j] =
            costHammer[i + 1][j + 1] +
            ((1 - UPGRADE_PERCENTAGE) / UPGRADE_PERCENTAGE) *
              (WHITE_PRICE / WHITE_PERCENTAGE) +
            UPGRADE_PRICE / UPGRADE_PERCENTAGE;
          costHammer[i][j + 1] =
            costHammer[i][j] + WHITE_PRICE / WHITE_PERCENTAGE;
        } else {
          costHammer[i][j] =
            UPGRADE_PERCENTAGE * costHammer[i + 1][j + 1] +
            (1 - UPGRADE_PERCENTAGE) * costHammer[i][j + 1] +
            UPGRADE_PRICE;
          innocentHammer[i][j] =
            UPGRADE_PERCENTAGE * innocentHammer[i + 1][j + 1] +
            (1 - UPGRADE_PERCENTAGE) * innocentHammer[i][j + 1];
        }
      }
      if (actionMatrixHammer[i][j] === 'I') {
        innocentHammer[i][j] = 1;
        costHammer[i][j] = INNOCENT_PRICE / INNOCENT_PERCENTAGE;
      }
    }
  }

  for (let i = 8; i >= 0; i--) {
    for (let j = 8; j >= i; j--) {
      if (actionMatrixNormal[i][j] === 'U') {
        costNormal[i][j] =
          UPGRADE_PERCENTAGE * costNormal[i + 1][j + 1] +
          (1 - UPGRADE_PERCENTAGE) * costNormal[i][j + 1] +
          UPGRADE_PRICE;
        innocentNormal[i][j] =
          UPGRADE_PERCENTAGE * innocentNormal[i + 1][j + 1] +
          (1 - UPGRADE_PERCENTAGE) * innocentNormal[i][j + 1];
      }
      if (actionMatrixNormal[i][j] === 'H') {
        costNormal[i][j] =
          HAMMER_PERCENTAGE * costHammer[i][j] +
          (1 - HAMMER_PERCENTAGE) * costHammer[i][j + 1] +
          HAMMER_PRICE;
        innocentNormal[i][j] =
          HAMMER_PERCENTAGE * innocentHammer[i][j] +
          (1 - HAMMER_PERCENTAGE) * innocentHammer[i][j + 1];
      }
      if (actionMatrixNormal[i][j] === 'I') {
        innocentNormal[i][j] = 1;
        costNormal[i][j] = INNOCENT_PRICE / INNOCENT_PERCENTAGE;
      }
    }
  }

  for (let i = 8; i >= 0; i--) {
    for (let j = 9; j >= i; j--) {
      if (actionMatrixHammer[i][j] === 'U') {
        if (actionMatrixHammer[i][j + 1] === 'W') {
          costFinalHammer[i][j] =
            costFinalHammer[i + 1][j + 1] +
            ((1 - UPGRADE_PERCENTAGE) / UPGRADE_PERCENTAGE) *
              (WHITE_PRICE / WHITE_PERCENTAGE) +
            UPGRADE_PRICE / UPGRADE_PERCENTAGE;
          costFinalHammer[i][j + 1] =
            costFinalHammer[i][j] + WHITE_PRICE / WHITE_PERCENTAGE;
        } else {
          costFinalHammer[i][j] =
            UPGRADE_PERCENTAGE * costFinalHammer[i + 1][j + 1] +
            (1 - UPGRADE_PERCENTAGE) * costFinalHammer[i][j + 1] +
            UPGRADE_PRICE;
        }
      }
      if (actionMatrixHammer[i][j] === 'I') {
        costFinalHammer[i][j] =
          costNormal[0][0] / (1 - innocentNormal[0][0]) +
          INNOCENT_PRICE / INNOCENT_PERCENTAGE;
      }
    }
  }

  for (let i = 8; i >= 0; i--) {
    for (let j = 8; j >= i; j--) {
      if (actionMatrixNormal[i][j] === 'U') {
        costFinalNormal[i][j] =
          UPGRADE_PERCENTAGE * costFinalNormal[i + 1][j + 1] +
          (1 - UPGRADE_PERCENTAGE) * costFinalNormal[i][j + 1] +
          UPGRADE_PRICE;
      }
      if (actionMatrixNormal[i][j] === 'H') {
        costFinalNormal[i][j] =
          HAMMER_PERCENTAGE * costFinalHammer[i][j] +
          (1 - HAMMER_PERCENTAGE) * costFinalHammer[i][j + 1] +
          HAMMER_PRICE;
      }
      if (actionMatrixNormal[i][j] === 'I') {
        costFinalNormal[i][j] =
          costNormal[0][0] / (1 - innocentNormal[0][0]) +
          INNOCENT_PRICE / INNOCENT_PERCENTAGE;
      }
    }
  }

  // console.log(costNormal);
  // console.log(costFinalNormal[0][0]);
  return costFinalNormal[0][0];
}

calculate(NORMAL_4, HAMMER_4);
