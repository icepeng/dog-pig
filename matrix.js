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

function calculate(upgradeLimit, actionNormal, actionHammer) {
  const actionMatrixNormal = Array.from(Array(upgradeLimit + 1), () =>
    Array(upgradeLimit + 1).fill(null),
  );
  const actionMatrixHammer = Array.from(Array(upgradeLimit + 2), () =>
    Array(upgradeLimit + 2).fill(null),
  );

  for (let i = 0; i <= upgradeLimit; i++) {
    for (let j = 0; j < actionNormal[i].try; j++) {
      actionMatrixNormal[i][j] = 'U';
    }
    actionMatrixNormal[i][actionNormal[i].try] = actionNormal[i].action;
  }

  for (let i = 0; i <= upgradeLimit + 1; i++) {
    for (let j = 0; j < actionHammer[i].try; j++) {
      actionMatrixHammer[i][j] = 'U';
    }
    actionMatrixHammer[i][actionHammer[i].try] = actionHammer[i].action;
  }

  const costNormal = Array.from(Array(upgradeLimit + 1), () =>
    Array(upgradeLimit + 1).fill(0),
  );
  const costHammer = Array.from(Array(upgradeLimit + 2), () =>
    Array(upgradeLimit + 2).fill(0),
  );
  const innocentNormal = Array.from(Array(upgradeLimit + 1), () =>
    Array(upgradeLimit + 1).fill(0),
  );
  const innocentHammer = Array.from(Array(upgradeLimit + 2), () =>
    Array(upgradeLimit + 2).fill(0),
  );
  const costFinalNormal = Array.from(Array(upgradeLimit + 1), () =>
    Array(upgradeLimit + 1).fill(0),
  );
  const costFinalHammer = Array.from(Array(upgradeLimit + 2), () =>
    Array(upgradeLimit + 2).fill(0),
  );

  for (let i = upgradeLimit; i >= 0; i--) {
    for (let j = upgradeLimit + 1; j >= i; j--) {
      if (actionMatrixHammer[i][j] === 'U') {
        if (actionMatrixHammer[i][j + 1] === 'W') {
          costHammer[i][j] =
            costHammer[i + 1][j + 1] +
            ((1 - UPGRADE_PERCENTAGE) / UPGRADE_PERCENTAGE) *
              (WHITE_PRICE / WHITE_PERCENTAGE) +
            UPGRADE_PRICE / UPGRADE_PERCENTAGE;
          costHammer[i][j + 1] =
            costHammer[i][j] + WHITE_PRICE / WHITE_PERCENTAGE;
          innocentHammer[i][j] = innocentHammer[i + 1][j + 1];
          innocentHammer[i][j + 1] = innocentHammer[i + 1][j + 1];
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

  for (let i = upgradeLimit; i >= 0; i--) {
    for (let j = upgradeLimit; j >= i; j--) {
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

  for (let i = upgradeLimit; i >= 0; i--) {
    for (let j = upgradeLimit + 1; j >= i; j--) {
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

  for (let i = upgradeLimit; i >= 0; i--) {
    for (let j = upgradeLimit; j >= i; j--) {
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

  return costFinalNormal[0][0];
}

function tryAll(upgradeLimit) {
  const A = [];
  let min = 99999999;
  let minA;
  let minB;

  function getB(arr) {
    return arr.map(x => {
      return {
        try: x.action === 'I' ? x.try + 1 : upgradeLimit + 1,
        action: x.action === 'I' ? 'I' : 'W',
      };
    });
  }

  function recursive(t, action, depth) {
    A[depth] = { try: t, action: action };
    if (depth === upgradeLimit) {
      const B = getB(A);
      const res = calculate(upgradeLimit, A, [
        ...B,
        { try: upgradeLimit + 1, action: 'FINISH' },
      ]);
      if (res < min) {
        min = res;
        minA = JSON.parse(JSON.stringify(A));
        minB = JSON.parse(JSON.stringify(B));
      }
      const index = A.findIndex(x => x.action === 'H');
      B[index] = { try: A[index].try + 1, action: 'I' };
      const res2 = calculate(upgradeLimit, A, [
        ...B,
        { try: upgradeLimit + 1, action: 'FINISH' },
      ]);
      if (res2 < min) {
        min = res2;
        minA = JSON.parse(JSON.stringify(A));
        minB = JSON.parse(JSON.stringify(B));
      }
      return;
    }
    recursive(upgradeLimit, 'H', depth + 1);
    if (action === 'I' && depth + 1 < upgradeLimit) {
      for (let i = t + 1; i <= upgradeLimit; i++) {
        recursive(i, 'I', depth + 1);
      }
    }
  }

  for (let i = 1; i <= upgradeLimit; i++) {
    recursive(i, 'I', 0);
  }
  recursive(upgradeLimit, 'H', 0);

  console.log(min);
  console.log(minA);
  console.log(minB);
}

tryAll(8);

// const res = calculate(
//   8,
//   [
//     { try: 3, action: 'I' },
//     { try: 5, action: 'I' },
//     { try: 7, action: 'I' },
//     { try: 8, action: 'I' },
//     { try: 8, action: 'H' },
//     { try: 8, action: 'H' },
//     { try: 8, action: 'H' },
//     { try: 8, action: 'H' },
//     { try: 8, action: 'H' },
//   ],
//   [
//     { try: 4, action: 'I' },
//     { try: 6, action: 'I' },
//     { try: 8, action: 'I' },
//     { try: 9, action: 'I' },
//     { try: 9, action: 'W' },
//     { try: 9, action: 'W' },
//     { try: 9, action: 'W' },
//     { try: 9, action: 'W' },
//     { try: 9, action: 'W' },
//     { try: 9, action: 'FINISH' },
//   ],
// );

// console.log(res);
