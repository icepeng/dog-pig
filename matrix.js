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

  const costNormal = [];
  const costHammer = [];
  const innocentNormal = [];
  const innocentHammer = [];
  const costFinalNormal = [];
  const costFinalHammer = [];
  for (let i = 0; i <= upgradeLimit; i++) {
    costNormal[i] = [];
    costFinalNormal[i] = [];
    innocentNormal[i] = [];
    for (let j = 0; j <= upgradeLimit; j++) {
      costNormal[i][j] = {
        upgrade: [],
        white: [],
        innocent: [],
        hammer: [],
      };
      costFinalNormal[i][j] = {
        upgrade: [],
        white: [],
        innocent: [],
        hammer: [],
      };
      innocentNormal[i][j] = 0;
    }
  }

  for (let i = 0; i <= upgradeLimit + 1; i++) {
    costHammer[i] = [];
    costFinalHammer[i] = [];
    innocentHammer[i] = [];
    for (let j = 0; j <= upgradeLimit + 1; j++) {
      costHammer[i][j] = {
        upgrade: [],
        white: [],
        innocent: [],
        hammer: [],
      };
      costFinalHammer[i][j] = {
        upgrade: [],
        white: [],
        innocent: [],
        hammer: [],
      };
      innocentHammer[i][j] = 0;
    }
  }

  for (let i = upgradeLimit; i >= 0; i--) {
    for (let j = upgradeLimit + 1; j >= i; j--) {
      if (actionMatrixHammer[i][j] === 'U') {
        if (actionMatrixHammer[i][j + 1] === 'W') {
          costHammer[i][j].upgrade = [
            ...costHammer[i + 1][j + 1].upgrade,
            1 / UPGRADE_PERCENTAGE,
          ];
          costHammer[i][j].white = [
            ...costHammer[i + 1][j + 1].white,
            (1 - UPGRADE_PERCENTAGE) / UPGRADE_PERCENTAGE,
          ];
          costHammer[i][j + 1].upgrade = [...costHammer[i][j].upgrade];
          costHammer[i][j + 1].white = [...costHammer[i][j].white, 1];
          innocentHammer[i][j] = innocentHammer[i + 1][j + 1];
          innocentHammer[i][j + 1] = innocentHammer[i + 1][j + 1];
        } else {
          costHammer[i][j].upgrade = [
            ...costHammer[i + 1][j + 1].upgrade.map(
              x => x * UPGRADE_PERCENTAGE,
            ),
            ...costHammer[i][j + 1].upgrade.map(
              x => x * (1 - UPGRADE_PERCENTAGE),
            ),
            1,
          ];
          costHammer[i][j].white = [
            ...costHammer[i + 1][j + 1].white.map(x => x * UPGRADE_PERCENTAGE),
            ...costHammer[i][j + 1].white.map(
              x => x * (1 - UPGRADE_PERCENTAGE),
            ),
          ];
          costHammer[i][j].innocent = [
            ...costHammer[i + 1][j + 1].innocent.map(
              x => x * UPGRADE_PERCENTAGE,
            ),
            ...costHammer[i][j + 1].innocent.map(
              x => x * (1 - UPGRADE_PERCENTAGE),
            ),
          ];
          costHammer[i][j].hammer = [
            ...costHammer[i + 1][j + 1].hammer.map(x => x * UPGRADE_PERCENTAGE),
            ...costHammer[i][j + 1].hammer.map(
              x => x * (1 - UPGRADE_PERCENTAGE),
            ),
          ];
          innocentHammer[i][j] =
            UPGRADE_PERCENTAGE * innocentHammer[i + 1][j + 1] +
            (1 - UPGRADE_PERCENTAGE) * innocentHammer[i][j + 1];
        }
      }
      if (actionMatrixHammer[i][j] === 'I') {
        innocentHammer[i][j] = [1];
        costHammer[i][j].innocent = [1];
      }
    }
  }

  for (let i = upgradeLimit; i >= 0; i--) {
    for (let j = upgradeLimit; j >= i; j--) {
      if (actionMatrixNormal[i][j] === 'U') {
        costNormal[i][j].upgrade = [
          ...costNormal[i + 1][j + 1].upgrade.map(x => x * UPGRADE_PERCENTAGE),
          ...costNormal[i][j + 1].upgrade.map(
            x => x * (1 - UPGRADE_PERCENTAGE),
          ),
          1,
        ];
        costNormal[i][j].white = [
          ...costNormal[i + 1][j + 1].white.map(x => x * UPGRADE_PERCENTAGE),
          ...costNormal[i][j + 1].white.map(x => x * (1 - UPGRADE_PERCENTAGE)),
        ];
        costNormal[i][j].innocent = [
          ...costNormal[i + 1][j + 1].innocent.map(x => x * UPGRADE_PERCENTAGE),
          ...costNormal[i][j + 1].innocent.map(
            x => x * (1 - UPGRADE_PERCENTAGE),
          ),
        ];
        costNormal[i][j].hammer = [
          ...costNormal[i + 1][j + 1].hammer.map(x => x * UPGRADE_PERCENTAGE),
          ...costNormal[i][j + 1].hammer.map(x => x * (1 - UPGRADE_PERCENTAGE)),
        ];
        innocentNormal[i][j] =
          UPGRADE_PERCENTAGE * innocentNormal[i + 1][j + 1] +
          (1 - UPGRADE_PERCENTAGE) * innocentNormal[i][j + 1];
      }
      if (actionMatrixNormal[i][j] === 'H') {
        costNormal[i][j].upgrade = [
          ...costHammer[i][j].upgrade.map(x => x * HAMMER_PERCENTAGE),
          ...costHammer[i][j + 1].upgrade.map(x => x * (1 - HAMMER_PERCENTAGE)),
        ];
        costNormal[i][j].white = [
          ...costHammer[i][j].white.map(x => x * HAMMER_PERCENTAGE),
          ...costHammer[i][j + 1].white.map(x => x * (1 - HAMMER_PERCENTAGE)),
        ];
        costNormal[i][j].innocent = [
          ...costHammer[i][j].innocent.map(x => x * HAMMER_PERCENTAGE),
          ...costHammer[i][j + 1].innocent.map(
            x => x * (1 - HAMMER_PERCENTAGE),
          ),
        ];
        costNormal[i][j].hammer = [
          ...costHammer[i][j].hammer.map(x => x * HAMMER_PERCENTAGE),
          ...costHammer[i][j + 1].hammer.map(x => x * (1 - HAMMER_PERCENTAGE)),
          1,
        ];
        innocentNormal[i][j] =
          HAMMER_PERCENTAGE * innocentHammer[i][j] +
          (1 - HAMMER_PERCENTAGE) * innocentHammer[i][j + 1];
      }
      if (actionMatrixNormal[i][j] === 'I') {
        innocentNormal[i][j] = 1;
        costNormal[i][j].innocent = [1];
      }
    }
  }

  for (let i = upgradeLimit; i >= 0; i--) {
    for (let j = upgradeLimit + 1; j >= i; j--) {
      if (actionMatrixHammer[i][j] === 'U') {
        if (actionMatrixHammer[i][j + 1] === 'W') {
          costFinalHammer[i][j].upgrade = [
            ...costFinalHammer[i + 1][j + 1].upgrade,
            1 / UPGRADE_PERCENTAGE,
          ];
          costFinalHammer[i][j].white = [
            ...costFinalHammer[i + 1][j + 1].white,
            (1 - UPGRADE_PERCENTAGE) / UPGRADE_PERCENTAGE,
          ];
          costFinalHammer[i][j + 1].upgrade = [
            ...costFinalHammer[i][j].upgrade,
          ];
          costFinalHammer[i][j + 1].white = [...costFinalHammer[i][j].white, 1];
        } else {
          costFinalHammer[i][j].upgrade = [
            ...costFinalHammer[i + 1][j + 1].upgrade.map(
              x => x * UPGRADE_PERCENTAGE,
            ),
            ...costFinalHammer[i][j + 1].upgrade.map(
              x => x * (1 - UPGRADE_PERCENTAGE),
            ),
            1,
          ];
          costFinalHammer[i][j].white = [
            ...costFinalHammer[i + 1][j + 1].white.map(
              x => x * UPGRADE_PERCENTAGE,
            ),
            ...costFinalHammer[i][j + 1].white.map(
              x => x * (1 - UPGRADE_PERCENTAGE),
            ),
          ];
          costFinalHammer[i][j].innocent = [
            ...costFinalHammer[i + 1][j + 1].innocent.map(
              x => x * UPGRADE_PERCENTAGE,
            ),
            ...costFinalHammer[i][j + 1].innocent.map(
              x => x * (1 - UPGRADE_PERCENTAGE),
            ),
          ];
          costFinalHammer[i][j].hammer = [
            ...costFinalHammer[i + 1][j + 1].hammer.map(
              x => x * UPGRADE_PERCENTAGE,
            ),
            ...costFinalHammer[i][j + 1].hammer.map(
              x => x * (1 - UPGRADE_PERCENTAGE),
            ),
          ];
        }
      }
      if (actionMatrixHammer[i][j] === 'I') {
        costFinalHammer[i][j].upgrade = costNormal[0][0].upgrade.map(
          x => x / (1 - innocentNormal[0][0]),
        );
        costFinalHammer[i][j].white = costNormal[0][0].white.map(
          x => x / (1 - innocentNormal[0][0]),
        );
        costFinalHammer[i][j].innocent = [
          ...costNormal[0][0].innocent.map(x => x / (1 - innocentNormal[0][0])),
          1,
        ];
        costFinalHammer[i][j].hammer = costNormal[0][0].hammer.map(
          x => x / (1 - innocentNormal[0][0]),
        );
      }
    }
  }

  for (let i = upgradeLimit; i >= 0; i--) {
    for (let j = upgradeLimit; j >= i; j--) {
      if (actionMatrixNormal[i][j] === 'U') {
        costFinalNormal[i][j].upgrade = [
          ...costFinalNormal[i + 1][j + 1].upgrade.map(
            x => x * UPGRADE_PERCENTAGE,
          ),
          ...costFinalNormal[i][j + 1].upgrade.map(
            x => x * (1 - UPGRADE_PERCENTAGE),
          ),
          1,
        ];
        costFinalNormal[i][j].white = [
          ...costFinalNormal[i + 1][j + 1].white.map(
            x => x * UPGRADE_PERCENTAGE,
          ),
          ...costFinalNormal[i][j + 1].white.map(
            x => x * (1 - UPGRADE_PERCENTAGE),
          ),
        ];
        costFinalNormal[i][j].innocent = [
          ...costFinalNormal[i + 1][j + 1].innocent.map(
            x => x * UPGRADE_PERCENTAGE,
          ),
          ...costFinalNormal[i][j + 1].innocent.map(
            x => x * (1 - UPGRADE_PERCENTAGE),
          ),
        ];
        costFinalNormal[i][j].hammer = [
          ...costFinalNormal[i + 1][j + 1].hammer.map(
            x => x * UPGRADE_PERCENTAGE,
          ),
          ...costFinalNormal[i][j + 1].hammer.map(
            x => x * (1 - UPGRADE_PERCENTAGE),
          ),
        ];
      }
      if (actionMatrixNormal[i][j] === 'H') {
        costFinalNormal[i][j].upgrade = [
          ...costFinalHammer[i][j].upgrade.map(x => x * HAMMER_PERCENTAGE),
          ...costFinalHammer[i][j + 1].upgrade.map(
            x => x * (1 - HAMMER_PERCENTAGE),
          ),
        ];
        costFinalNormal[i][j].white = [
          ...costFinalHammer[i][j].white.map(x => x * HAMMER_PERCENTAGE),
          ...costFinalHammer[i][j + 1].white.map(
            x => x * (1 - HAMMER_PERCENTAGE),
          ),
        ];
        costFinalNormal[i][j].innocent = [
          ...costFinalHammer[i][j].innocent.map(x => x * HAMMER_PERCENTAGE),
          ...costFinalHammer[i][j + 1].innocent.map(
            x => x * (1 - HAMMER_PERCENTAGE),
          ),
        ];
        costFinalNormal[i][j].hammer = [
          ...costFinalHammer[i][j].hammer.map(x => x * HAMMER_PERCENTAGE),
          ...costFinalHammer[i][j + 1].hammer.map(
            x => x * (1 - HAMMER_PERCENTAGE),
          ),
          1,
        ];
      }
      if (actionMatrixNormal[i][j] === 'I') {
        costFinalNormal[i][j].upgrade = costNormal[0][0].upgrade.map(
          x => x / (1 - innocentNormal[0][0]),
        );
        costFinalNormal[i][j].white = costNormal[0][0].white.map(
          x => x / (1 - innocentNormal[0][0]),
        );
        costFinalNormal[i][j].innocent = [
          ...costNormal[0][0].innocent.map(x => x / (1 - innocentNormal[0][0])),
          1,
        ];
        costFinalNormal[i][j].hammer = costNormal[0][0].hammer.map(
          x => x / (1 - innocentNormal[0][0]),
        );
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
    for (let i = t; i <= upgradeLimit; i++) {
      recursive(i, 'H', depth + 1);
    }
    if (action === 'I' && depth + 1 < upgradeLimit) {
      for (let i = t + 1; i <= upgradeLimit; i++) {
        recursive(i, 'I', depth + 1);
      }
    }
  }

  for (let i = 1; i <= upgradeLimit; i++) {
    recursive(i, 'I', 0);
  }

  for (let i = 0; i <= upgradeLimit; i++) {
    recursive(i, 'H', 0);
  }

  console.log(min);
  console.log(minA);
  console.log(minB);
}

// tryAll(8);

const res = calculate(
  8,
  [
    { try: 5, action: 'I' },
    { try: 6, action: 'I' },
    { try: 7, action: 'I' },
    { try: 8, action: 'H' },
    { try: 8, action: 'H' },
    { try: 8, action: 'H' },
    { try: 8, action: 'H' },
    { try: 8, action: 'H' },
    { try: 8, action: 'H' },
  ],
  [
    { try: 4, action: 'I' },
    { try: 6, action: 'I' },
    { try: 8, action: 'I' },
    { try: 9, action: 'I' },
    { try: 9, action: 'W' },
    { try: 9, action: 'W' },
    { try: 9, action: 'W' },
    { try: 9, action: 'W' },
    { try: 9, action: 'W' },
    { try: 9, action: 'FINISH' },
  ],
);

// console.log(res);
