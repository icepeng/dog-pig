const upgrade = [];
const hammer = [];
const innocent = [];
const white = [];

const UPGRADE_PERCENTAGE = 0.39;
const INNOCENT_PERCENTAGE = 0.45;
const WHITE_PERCENTAGE = 0.1;
const HAMMER_PERCENTAGE = 0.5;

const UPGRADE_PRICE = 337.5;
const INNOCENT_PRICE = 1250;
const WHITE_PRICE = 500;
const HAMMER_PRICE = 600;

const ITERATE_NUMBER = 10000000;

function tryUpgrade(state) {
  state.upgrade += 1;
  state.left -= 1;
  if (Math.random() < UPGRADE_PERCENTAGE) {
    state.success += 1;
  }
}

function tryInnocent(state) {
  state.innocent += 1;
  if (Math.random() < INNOCENT_PERCENTAGE) {
    state.success = 0;
    state.left = 8;
    state.hammerApplied = false;
  }
}

function tryWhite(state) {
  state.white += 1;
  if (Math.random() < WHITE_PERCENTAGE) {
    state.left += 1;
  }
}

function tryHammer(state) {
  state.hammer += 1;
  state.hammerApplied = true;
  if (Math.random() < HAMMER_PERCENTAGE) {
    state.left += 1;
  }
}

function run() {
  let t = 0;
  let mean = 0;
  while (true) {
    if (t >= ITERATE_NUMBER) {
      break;
    }
    t++;

    const state = {
      success: 0,
      left: 8,
      hammerApplied: false,
      upgrade: 0,
      hammer: 0,
      innocent: 0,
      white: 0,
    };

    while (true) {
      if (state.success === 9) {
        break;
      }
      if (state.left === 0) {
        if (state.success >= 4) {
          if (!state.hammerApplied) {
            tryHammer(state);
          } else {
            tryWhite(state);
          }
          continue;
        }
        if (state.success === 3 && !state.hammerApplied) {
          tryHammer(state);
          continue;
        }
        tryInnocent(state);
        continue;
      }
      if (
        (state.hammerApplied && state.left + state.success < 4) ||
        (!state.hammerApplied && state.left + state.success + 1 < 4)
      ) {
        tryInnocent(state);
        continue;
      }
      tryUpgrade(state);
    }

    // console.log(state);
    upgrade[state.upgrade] = (upgrade[state.upgrade] || 0) + 1;
    hammer[state.hammer] = (hammer[state.hammer] || 0) + 1;
    innocent[state.innocent] = (innocent[state.innocent] || 0) + 1;
    white[state.white] = (white[state.white] || 0) + 1;
    mean +=
      (state.upgrade * UPGRADE_PRICE +
        state.hammer * HAMMER_PRICE +
        state.innocent * INNOCENT_PRICE +
        state.white * WHITE_PRICE) /
      ITERATE_NUMBER;
  }

  console.log(upgrade.reduce((sum, x, i) => sum + (i * x) / ITERATE_NUMBER, 0));
  console.log(
    innocent.reduce((sum, x, i) => sum + (i * x) / ITERATE_NUMBER, 0),
  );
  console.log(white.reduce((sum, x, i) => sum + (i * x) / ITERATE_NUMBER, 0));
  console.log(hammer.reduce((sum, x, i) => sum + (i * x) / ITERATE_NUMBER, 0));
  console.log(mean);
}

run();
